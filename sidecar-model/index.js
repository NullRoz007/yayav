const fs = require('fs');
const { readFileSync } = require('fs');
const { parse } = require('papaparse');
const tf = require('@tensorflow/tfjs-node');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Model state tracking
const modelState = {
  status: 'not_started', // 'not_started', 'training', 'completed', 'failed'
  startTime: null,
  endTime: null,
  error: null,
  metrics: {
    accuracy: null,
    loss: null
  },
  datasetInfo: {
    path: null,
    size: null
  },
  modelInfo: {
    jsonModel: null,
    outputPath: null,
    epochs: null
  },
  progress: {
    currentEpoch: 0,
    totalEpochs: 0
  }
};

let trainedModel = null;
let normalizedStats = null;

const load_data_set = (datasetPath) => {
  try {
    const csvData = readFileSync(datasetPath, 'utf8');
    const parsedData = parse(csvData, { header: true, skipEmptyLines: true });
    const dataset = parsedData.data;
    
    modelState.datasetInfo.size = dataset.length;
    return dataset;
  } catch (error) {
    throw new Error(`Failed to load dataset: ${error.message}`);
  }
};

const map_to_tensors = (dataset) => {
  try {
    const X = dataset.map(row => Object.values(row).slice(2, -1).map(Number));
    const y = dataset.map(row => Number(row['legitimate']));

    const X_tensor = tf.tensor2d(X);
    const y_tensor = tf.tensor2d(y, [y.length, 1]);

    return { X_tensor, y_tensor, X, y };
  } catch (error) {
    throw new Error(`Failed to convert data to tensors: ${error.message}`);
  }
};

const build_model = (input) => {
  try {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [input.shape[1]] }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  } catch (error) {
    throw new Error(`Failed to build model: ${error.message}`);
  }
};

const train_model = async (datasetPath, outputPath, epochs = 1) => {
  try {
    modelState.status = 'training';
    modelState.startTime = new Date().toISOString();
    modelState.datasetInfo.path = datasetPath;
    modelState.modelInfo.outputPath = outputPath;
    modelState.modelInfo.epochs = epochs;
    modelState.error = null;
    
    const dataset = load_data_set(datasetPath);

    const { X_tensor, y_tensor, X, y } = map_to_tensors(dataset);
    const { mean, variance } = tf.moments(X_tensor, 0);
    const X_norm = X_tensor.sub(mean).div(variance.sqrt());
    
    normalizedStats = { 
      mean: mean.arraySync(), 
      variance: variance.arraySync() 
    };
    
    const trainSize = Math.floor(0.8 * X.length);
    const X_train = X_norm.slice([0, 0], [trainSize, -1]);
    const X_test = X_norm.slice([trainSize, 0], [-1, -1]);
    const y_train = y_tensor.slice([0, 0], [trainSize, -1]);
    const y_test = y_tensor.slice([trainSize, 0], [-1, -1]);

    const model = build_model(X_train);
    
    modelState.progress.totalEpochs = epochs;
    modelState.progress.currentEpoch = 0;

    console.log(`Training model with ${epochs} epochs...`);
    const result = await model.fit(X_train, y_train, {
      epochs: epochs,
      batchSize: 32,
      validationSplit: 0.1,
      callbacks: {
        onEpochBegin: (epoch) => {
          modelState.progress.currentEpoch = epoch + 1;
        },
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}, Accuracy = ${logs.acc}`);
          modelState.metrics.loss = logs.loss;
          modelState.metrics.accuracy = logs.acc;
        }
      }
    });

    console.log("Model trained. Evaluating...");

    const evalResult = model.evaluate(X_test, y_test);
    const testAccuracy = evalResult[1].dataSync()[0];
    console.log("Test accuracy:", testAccuracy);
    
    modelState.metrics.testAccuracy = testAccuracy;

    if (outputPath) {
      await model.save(`file:///${outputPath}`);
      console.log("Model saved to", outputPath);
    }

    trainedModel = model;
    
    modelState.status = 'completed';
    modelState.endTime = new Date().toISOString();
  
    let saveResult = await model.save(tf.io.withSaveHandler(async artifacts => artifacts));
    saveResult.weightData = Buffer.from(saveResult.weightData).toString("base64");
    modelState.modelInfo = JSON.stringify(saveResult);
    
    return model;
  } catch (error) {
    console.error("Training failed:", error);
    modelState.status = 'failed';
    modelState.error = error.message;
    modelState.endTime = new Date().toISOString();
    throw error;
  }
};

// API Routes
// POST /model/train - Start model training
app.post('/model/train', async (req, res) => {
  console.log(req);

  try {
    const { datasetPath, outputPath, epochs = 1 } = req.body;
    
    if (!datasetPath) {
      return res.status(400).json({ error: 'Dataset path is required' });
    }
    
    const numEpochs = parseInt(epochs);
    if (isNaN(numEpochs) || numEpochs < 1) {
      return res.status(400).json({ error: 'Epochs must be a positive integer' });
    }
    
    if (!fs.existsSync(datasetPath)) {
      return res.status(400).json({ error: 'Dataset file does not exist' });
    }
    
    if (modelState.status === 'training') {
      return res.status(409).json({ 
        error: 'Model is currently being trained',
        status: modelState.status
      });
    }

    train_model(datasetPath, outputPath, numEpochs)
      .catch(err => console.error('Background training error:', err));
    
    return res.status(202).json({ 
      message: 'Model training started',
      status: modelState.status,
      configuration: {
        datasetPath,
        outputPath,
        epochs: numEpochs
      }
    });
  } catch (error) {
    console.error('Error starting training:', error);
    return res.status(500).json({ error: 'Failed to start model training', details: error.message });
  }
});

// GET /model/status - Get current training status
app.get('/model/status', (req, res) => {
  res.json({
    status: modelState.status,
    startTime: modelState.startTime,
    endTime: modelState.endTime,
    error: modelState.error,
    metrics: modelState.metrics,
    datasetInfo: modelState.datasetInfo,
    modelInfo: modelState.modelInfo,
    progress: modelState.progress
  });
});

// GET /model - Get model representation
app.get('/model', (req, res) => {
  if (modelState.status !== 'completed' || !trainedModel) {
    return res.status(404).json({ 
      error: 'No trained model available',
      status: modelState.status 
    });
  }
  
  res.json({
    status: 'success',
    modelInfo: modelState.modelInfo,
    metrics: modelState.metrics,
    normalization: normalizedStats,
    datasetInfo: {
      size: modelState.datasetInfo.size,
      path: modelState.datasetInfo.path
    },
    trainedAt: modelState.endTime
  });
});

app.listen(PORT, () => {
  console.log(`Model API server running on port ${PORT}`);
});
