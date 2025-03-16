static DATASET_PATH: &str =
    "/home/bens/Documents/Programming/yayAV/yayAV-ML/datasets/dataset_1.csv";

use csv::ReaderBuilder;
use csv::StringRecord;
use std::error::Error;

#[tauri::command]
pub fn yaynn_get_dataset() -> Result<Vec<String>, String> {
    let mut rdr = ReaderBuilder::new().from_path(DATASET_PATH).unwrap();
    let mut records = std::vec::Vec::new();
    for result in rdr.records() {
        records.push(String::from(result.unwrap().as_slice()));
    }

    Ok(records)
}
