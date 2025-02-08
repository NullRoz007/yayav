use std::fs::File;
use std::{fs, io::{Read, Seek, SeekFrom}, path::Path, process::Command};
use crate::yaylog::{log_message, LogLevel};

/// ============================================ ///
///             Helper Functions                 ///
/// ============================================ ///
fn check_env() -> bool {
    cfg!(target_os = "linux")
}

fn hostname() -> String {
    String::from_utf8_lossy(&Command::new("hostname").output().unwrap().stdout).trim().to_string()
}

fn date() -> String {
    String::from_utf8_lossy(&Command::new("date").arg("+%Y%m%d").output().unwrap().stdout).trim().to_string()
}

/// ============================================ ///
///       Linux Memory Dumping Functions         ///
/// ============================================ ///

/// Return the output dir for memory dumping 
pub fn get_output_dir() -> String {
    format!("./{}-{}", hostname(), date())
}

/// Return a list of PID's from /proc
pub fn get_process_list() -> Vec<String> {
    let mut pids = Vec::new();
    if let Ok(entries) = fs::read_dir("/proc") {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                if let Some(filename) = path.file_name().and_then(|n| n.to_str()) {
                    if filename.chars().all(|c| c.is_numeric()) {
                        pids.push(filename.to_string());
                    }
                }
            }
        }
    }
    pids
}

/// Read memory from /proc/{pid}/memory with a given range string (formatted: "start-end")
fn dump_range(pid: &str, range: &str, outf: &str) -> Option<Vec<u8>> {
    let ranges: Vec<&str> = range.split('-').collect();
    if ranges.len() != 2 {
        log_message(LogLevel::Error, &format!("Invalid range format for pid {}", pid), false);
        return None;
    }

    let start = u64::from_str_radix(ranges[0], 16).unwrap_or(0);
    let end = u64::from_str_radix(ranges[1], 16).unwrap_or(0);
    let size = end.saturating_sub(start);

    let mut buffer = vec![0; size as usize];
    if let Ok(mut mem) = File::open(format!("/proc/{}/mem", pid)) {
        if mem.seek(SeekFrom::Start(start)).is_ok() && mem.read_exact(&mut buffer).is_ok() {
            fs::write(outf, &buffer).unwrap_or(());
            return Some(buffer);
        }
    }

    log_message(LogLevel::Error, &format!("Failed to dump memory for pid {}", pid), false);
    None
}

/// Create a Vec<u8> representing the contents of a given processes memory
pub fn dump_process(pid: &str, dir: &str) -> Option<Vec<u8>> {
    let cmdline_path = format!("/proc/{}/cmdline", pid);
    println!("path: {}", cmdline_path);
    if let Ok(cmdline) = fs::read(&cmdline_path) { 
        fs::write(format!("{}/cmdline", dir), cmdline).unwrap();
    }

    let memory_dir = format!("{}/memory/user", dir);
    let shared_libs_dir = format!("{}/memory/shared-libs", dir);
    fs::create_dir_all(&memory_dir).unwrap();
    fs::create_dir_all(&shared_libs_dir).unwrap();

    let maps_path = format!("/proc/{}/maps", pid);
    let maps_content = match fs::read_to_string(&maps_path) {
        Ok(content) => content,
        Err(e) => {
            log_message(LogLevel::Error, &format!("Failed to read maps file for pid {}: {}", pid, e), false);
            return None;
        }
    };

    let mut memory_dump = Vec::new();
    for line in maps_content.lines() {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() < 2 { continue; }
        
        let range = parts[0];
        let perms = parts[1];
        let what = parts.get(5).copied().unwrap_or("");

        if perms.starts_with("rw") {
            let rangestart = range.split('-').next().unwrap_or("");
            let dump_path = match what {
                "" => format!("{}/user@{}", memory_dir, rangestart),
                "[heap]" => format!("{}/heap@{}", memory_dir, rangestart),
                "[stack]" => format!("{}/stack@{}", memory_dir, rangestart),
                _ if what.contains(".so") => {
                    let libname = Path::new(what).file_name().unwrap().to_str().unwrap();
                    format!("{}/{}@{}", shared_libs_dir, libname, rangestart)
                },
                _ => continue,
            };
            if let Some(data) = dump_range(pid, range, &dump_path) {
                memory_dump.extend(data);
            }
        }
    }
    
    Some(memory_dump)
}