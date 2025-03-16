extern crate dirs;
extern crate tokio;

mod yaylog;
mod yaymem;
mod yaynn;

use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::vec::Vec;

use rayon::prelude::*;
use tokio::task;

use yaylog::{log_match, log_message, log_set_app_handle, LogLevel};
use yaymem::{dump_process, get_output_dir, get_process_list};
use yaynn::yaynn_get_dataset;

use sysinfo::System;
use walkdir::WalkDir;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[derive(Serialize, Deserialize)]
struct YayRuleset {
    name: String,
    path: String,
    rules: Vec<String>,
    compiled: bool,
}

//struct ScanHandle { //TODO: Implement tokio cancellation tokens for canceling in-progress scans.

//}
#[tauri::command]
fn get_ruleset_dir_path() -> String {
    //TODO: error handling here.
    println!("RSD: {}", dirs::data_dir().unwrap().display());
    dirs::data_dir()
        .map(|path| path.join("yara-forge-rules"))
        .unwrap()
        .display()
        .to_string()
}

/// helper command for reading files from the frontend
#[tauri::command]
fn open_file(path: String) -> Result<String, String> {
    println!("open_file: {:?}", path);
    fs::read_to_string(PathBuf::from(path)).map_err(|e| {
        log_message(LogLevel::Error, &e.to_string(), false);
        e.to_string()
    })
}
/// returns a file as vector of bytes
fn get_file_as_byte_vec(filename: &String) -> Result<Vec<u8>, String> {
    let mut f = File::open(&filename).map_err(|e| {
        log_message(LogLevel::Error, &e.to_string(), false);
        e.to_string()
    })?;

    let metadata = fs::metadata(&filename).map_err(|e| {
        log_message(LogLevel::Error, &e.to_string(), false);
        e.to_string()
    })?;

    let mut buffer = vec![0; metadata.len() as usize];
    f.read(&mut buffer).map_err(|e| {
        log_message(LogLevel::Error, &e.to_string(), false);
        e.to_string()
    })?;

    Ok(buffer)
}

/// return available rulesets to the frontend
#[tauri::command]
fn yay_get_rulesets() -> Result<Vec<YayRuleset>, String> {
    let mut rulesets = Vec::new();
    for path in yay_get_ruleset_paths()? {
        let path_buf = PathBuf::from(path.clone());
        let mut rule_paths = Vec::new();
        let mut rule_bin_paths = Vec::new();

        let entries = fs::read_dir(path).map_err(|e| {
            log_message(LogLevel::Error, &e.to_string(), false);
            e.to_string()
        })?;

        for entry in entries {
            let dir = entry.map_err(|e| {
                log_message(LogLevel::Error, &e.to_string(), false);
                e.to_string()
            })?;

            let pb = dir.path();
            if pb.is_file() && pb.extension().and_then(|s| s.to_str()) == Some("yar") {
                rule_paths.push(pb.to_string_lossy().to_string());
            }

            if pb.is_file() && pb.extension().and_then(|s| s.to_str()) == Some("bin") {
                rule_bin_paths.push(pb.to_string_lossy().to_string());
            }
        }

        let ruleset = YayRuleset {
            name: path_buf
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string(),
            path: path_buf.to_string_lossy().to_string(),
            rules: rule_paths.clone(),
            compiled: (rule_bin_paths.len() == rule_paths.len()),
        };

        rulesets.push(ruleset);
    }

    Ok(rulesets)
}

/// returns the paths of available rulesets
fn yay_get_ruleset_paths() -> Result<Vec<String>, String> {
    let mut ruleset_dir_paths = Vec::new();
    let entries = fs::read_dir(get_ruleset_dir_path()).map_err(|e| {
        log_message(LogLevel::Error, &e.to_string(), false);
        e.to_string()
    })?;

    for entry in entries {
        let dir = entry.map_err(|e| {
            log_message(LogLevel::Error, &e.to_string(), false);
            e.to_string()
        })?;

        let path_buf = dir.path();
        if path_buf.is_dir() {
            ruleset_dir_paths.push(path_buf.to_string_lossy().to_string());
        }
    }
    Ok(ruleset_dir_paths)
}

/// Constructs an `Arc<yara_x::Rules>` from a compiled YARA rule `.bin` file
fn yara_rule_from_compiled(filename: &String) -> Result<Arc<yara_x::Rules>, String> {
    let bytes_vec = get_file_as_byte_vec(filename)?;
    let rules = yara_x::Rules::deserialize(&bytes_vec).map_err(|e| {
        log_message(LogLevel::Error, &e.to_string(), false);
        "Failed to deserialize rule bytes!".to_string()
    })?;

    Ok(Arc::new(rules)) // Wrap in Arc immediately
}

/// Compile a yara rule file to a .bin binary
#[tauri::command]
async fn yara_compile(path: String) {
    task::spawn_blocking(move || {
        log_message(
            LogLevel::None,
            format!("Compiling: {}", path).as_str(),
            false,
        );

        let mut compiler = yara_x::Compiler::new();
        let core_rules_string =
            fs::read_to_string(PathBuf::from(path.clone())).expect("Failed to read file");

        compiler
            .add_source(yara_x::SourceCode::from(core_rules_string.as_str()).with_origin(&path))
            .expect("Failed to compile YARA rules");

        let built_rules = compiler.build();
        let rules_bytes = built_rules.serialize().expect("Rule serialization failed!");

        let file_stem = PathBuf::from(&path)
            .file_stem()
            .expect("Failed to get file stem")
            .to_string_lossy()
            .to_string();

        let parent = PathBuf::from(&path)
            .parent()
            .expect("Failed to get parent")
            .to_string_lossy()
            .to_string();

        let output_file = format!("{}/{}.bin", parent, file_stem);

        fs::write(output_file.clone(), rules_bytes).expect("Failed to write file!");
    })
    .await
    .expect("Task execution failed");
}

/// compiles a set of yara rule files to yara_x::Rules structs
/// then serializes them to binary files
#[tauri::command]
async fn yara_compile_rulesets(mut paths: Vec<String>) {
    log_message(
        LogLevel::Info,
        "yayAV is compiling YARA rules, standby.",
        false,
    );

    for path in paths.iter_mut() {
        yara_compile(path.to_string()).await
    }

    log_message(LogLevel::Success, "Done.", false);
}

fn yara_scan_mem(memory: Vec<u8>, rules: &[Arc<yara_x::Rules>]) {
    log_message(
        LogLevel::Warning,
        &format!("Scanning {} bytes.", memory.len()),
        false,
    );

    for rule in rules {
        let mut scanner = yara_x::Scanner::new(rule);
        if let Ok(results) = scanner.scan(&memory) {
            for rule in results.matching_rules() {
                log_message(
                    LogLevel::Error,
                    &format!("{} matched: {}", "MEMORY", rule.identifier()),
                    false,
                );

                log_match(&rule, "MEMORY");
            }
        } else {
            log_message(LogLevel::Error, "Scan failed!", false);
        }
    }
}

/// Scan a given directory, recursively
#[tauri::command]
async fn yara_scan_dir(path: &str, rules: &[Arc<yara_x::Rules>]) -> Result<(), String> {
    let entries: Vec<_> = WalkDir::new(path)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().is_file())
        .collect();

    entries.par_iter().for_each(|entry| {
        if let Some(path_str) = entry.path().to_str() {
            yara_scan_file(path_str, rules);
        }
    });

    Ok(())
}

/// Scan a given file against a set of preloaded YARA rules
fn yara_scan_file(path: &str, rules: &[Arc<yara_x::Rules>]) {
    log_message(
        LogLevel::Warning,
        &format!("Scanning target: {}", path),
        false,
    );

    for rule in rules {
        let mut scanner = yara_x::Scanner::new(rule);
        if let Ok(results) = scanner.scan_file(path) {
            for rule in results.matching_rules() {
                log_message(
                    LogLevel::Error,
                    &format!("{} matched: {}", path, rule.identifier()),
                    false,
                );
                log_match(&rule, path);
            }
        } else {
            log_message(LogLevel::Error, "Scan failed!", false);
        }
    }
}

fn print_block_text() {
    let text = r#"
███████████████████████████████
█▄─█─▄██▀▄─██▄─█─▄██▀▄─██▄─█─▄█
██▄─▄███─▀─███▄─▄███─▀─███▄▀▄██
▀▀▄▄▄▀▀▄▄▀▄▄▀▀▄▄▄▀▀▄▄▀▄▄▀▀▀▄▀▀▀
yayAV 0.1a
"#;
    log_message(LogLevel::Info, text, true);
}

fn panic_scan(e: String) {
    let msg = "Error in scan thread!".to_string();
    log_message(
        LogLevel::Error,
        format!("{} Error:\n {}", msg, e).as_str(),
        false,
    );
    panic!("{}", e.to_string());
}

async fn scan(paths: &[String], rules: &[Arc<yara_x::Rules>], dirs: bool, memory: bool) {
    if dirs {
        // Scan dirs
        for dir in paths {
            if let Err(e) = yara_scan_dir(dir, rules).await {
                //Dir scan threads are spawned in the yara_scan_dir function
                panic_scan(e.to_string());
            }
        }
    } else {
        let _ = task::spawn_blocking({
            let paths = paths.to_owned();
            let rules = rules.to_owned();

            move || {
                if memory {
                    // Scan memory
                    let outdir = get_output_dir();
                    let pids = get_process_list();
                    for pid in pids {
                        let pid_outdir = format!("{}/by-pid/{}", outdir, pid);
                        fs::create_dir_all(&pid_outdir).unwrap();

                        if let Some(mem) = dump_process(pid.as_str(), &pid_outdir) {
                            yara_scan_mem(mem, &rules);
                        }
                    }
                } else {
                    // Scan single files
                    for target in paths {
                        yara_scan_file(&target, &rules);
                    }
                }
            }
        })
        .await
        .map_err(|e| panic_scan(e.to_string()));
    }
}

/// TODO: Return Result<(), Error>, rather than just panicing on an error.
/// Loads all rules into memory before scanning
#[tauri::command]
async fn yara_scan_targets(paths: Vec<String>, rule_paths: Vec<String>, dirs: bool, memory: bool) {
    print_block_text();
    log_message(
        LogLevel::Info,
        "Loading Yara rules into memory, this may take a while...",
        false,
    );

    // Load all rules into Arc<Rules>
    let mut rules = Vec::new();
    for rule_path in &rule_paths {
        let compiled_path = format!(
            "{}/{}.bin",
            Path::new(rule_path)
                .parent()
                .unwrap_or_else(|| Path::new(""))
                .to_string_lossy(),
            Path::new(rule_path)
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
        );

        log_message(
            LogLevel::Info,
            &format!("Reading: {}", compiled_path),
            false,
        );

        match yara_rule_from_compiled(&compiled_path) {
            Ok(rule) => rules.push(rule),
            Err(e) => {
                log_message(
                    LogLevel::Error,
                    &format!("Failed to load rule: {}", e),
                    false,
                );
            }
        }
    }

    log_message(LogLevel::Success, "Done.", false);
    scan(&paths, &rules, dirs, memory).await;
    log_message(LogLevel::Success, "Scan complete.", false);
}

pub fn run() {
    static TEST_DATA: &str = "Lorem Ipsum";
    println!("{}", TEST_DATA);

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            log_set_app_handle(app.handle().clone());

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            yay_get_rulesets,
            yara_compile_rulesets,
            yara_compile,
            yara_scan_targets,
            open_file,
            get_ruleset_dir_path,
            yaynn_get_dataset
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
