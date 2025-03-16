use chrono::Local; // For timestamps
use colored::*; // For colored output

use once_cell::sync::Lazy;
use std::sync::Mutex;

use tauri::AppHandle;
use tauri::Emitter;

use serde::Serialize;
use serde_json::Value;

static APP_HANDLE: Lazy<Mutex<Option<AppHandle>>> = Lazy::new(|| Mutex::new(None));

#[derive(Clone, Serialize)]
struct LogMessageEvent<'a> {
    msg: &'a str,
    time: &'a str,
    lvl: LogLevel,
}

#[derive(Clone, Serialize)]
struct SerializableRule {
    identifier: String,
    namespace: String,
    metadata: Value,
    tags: String,
    patterns: String,
}

#[derive(Clone, Serialize)]
struct MatchMessageEvent {
    rule_json: String,
    path: String,
}

fn rule_to_serializable_rule(rule: &yara_x::Rule) -> SerializableRule {
    let serializable_rule = SerializableRule {
        identifier: rule.identifier().to_string(),
        namespace: rule.namespace().to_string(),
        metadata: rule.metadata().into_json(),
        tags: String::from(""),
        patterns: String::from(""),
    };

    serializable_rule
}

/// Call this once during app setup to store the AppHandle
pub fn log_set_app_handle(handle: AppHandle) {
    let mut app_handle = APP_HANDLE.lock().unwrap();
    *app_handle = Some(handle);
}

/// Log levels for the logging function.
#[derive(Clone, Serialize)]
pub enum LogLevel {
    Info,
    Warning,
    Error,
    Success,
    None,
}

pub fn log_match(_rule: &yara_x::Rule, _path: &str) {
    if let Some(app_handle) = APP_HANDLE.lock().unwrap().as_ref() {
        let sr = rule_to_serializable_rule(_rule);
        let r = serde_json::to_string(&sr).expect("Failed to serialize Rule!");

        let _ = app_handle.emit(
            "log_match",
            MatchMessageEvent {
                rule_json: r,
                path: _path.to_string(),
            },
        );
    }
}

/// Logs a message to the console with a specific level.
pub fn log_message(level: LogLevel, message: &str, no_format: bool) {
    let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    let (level_str, colorized_message) = match level {
        LogLevel::Info => ("INFO", message.blue()),
        LogLevel::Warning => ("WARNING", message.yellow()),
        LogLevel::Error => ("ERROR", message.red().bold()),
        LogLevel::Success => ("SUCCESS", message.green()),
        LogLevel::None => ("INFO", message.white()),
    };

    if no_format {
        println!("{}", colorized_message)
    } else {
        println!(
            "[{}] [{}] {}",
            timestamp.bold().dimmed(),
            level_str.bold(),
            colorized_message
        );
    }

    if let Some(app_handle) = APP_HANDLE.lock().unwrap().as_ref() {
        let _ = app_handle.emit(
            "log_message",
            LogMessageEvent {
                msg: message,
                time: timestamp.as_str(),
                lvl: level,
            },
        );
    }
}
