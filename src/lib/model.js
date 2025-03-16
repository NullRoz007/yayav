import { invoke } from "$lib/invoke-wrapper";
import { Command } from '@tauri-apps/plugin-shell';
import { set_model_sidecar_ready, yayState } from "$lib/state.svelte";

const API_PORT = 3000;
const API_HOST = "http://localhost"

export const start_model_sidecar = async() => {    
    const command = Command.sidecar('binaries/yaymodel');
    const output = await command.execute();
    console.log("Model Sidecar is now ready!");
    set_model_sidecar_ready(true);
}

const api_request = async (endpoint, method, data) => {
    let opts = {
        'method': method
    };
    
    if(method === 'POST') { 
        opts['body'] = JSON.stringify(data);
        opts['headers'] = {
            'Content-Type': 'application/json',
        };
    }

    const response = await fetch(API_HOST + ':' + API_PORT+'/'+endpoint, opts);

    const result = await response.json();
    return result;
}

export const get_model_status = async () => {
    const status = await api_request("model/status", 'GET', {});
    return status;
}

export const start_training = async () => {
    const result = await api_request("model/train", "POST", {
        datasetPath: '/home/bens/Documents/Programming/yayAV/yayAV/sidecar-model/datasets/dataset_1.csv',
        epochs: 2
    });
}

export const json_to_model = async (json_str) => {
    const json = JSON.parse(json_str);
    const weightData = new Uint8Array(Buffer.from(json.weightData, "base64")).buffer;
    const model = await tf.loadLayersModel(tf.io.fromMemory(json.modelTopology, json.weightSpecs, weightData));

    return model;
}