# Yayav

Yayav is a cross-platform antivirus scanner built using Tauri and SvelteKit. It leverages yara-forge YARA rules to detect malicious files and memory patterns efficiently.

## Features

-   Fast, multi-threaded scanning using Rust and Tokio.
    
-   Custom YARA rule support for advanced threat detection.
    
-   Tauri-based lightweight desktop application.
    
-   SvelteKit frontend for an interactive user experience.
    

## Requirements

-  Node.js (latest LTS recommended)
-  Rust
-  libwebgtk2 (Linux)
-  yara-forge (optional) (https://github.com/YARAHQ/yara-forge)
    

## Installation & Build

Follow these steps to build the project:

1.  Clone the repository:
    
    ```
    git clone https://github.com/yourusername/yayav.git
    cd yayav
    ```
    
2.  Run the bootstrap script (Linux only) to build YARA-Forge and the Linpmem driver:
    
    ```
    ./bootstrap.sh
    ```
    For Windows builds, please clone the yara-forge repo and follow the build steps there.
    
3.  Install dependencies:
    
    ```
    npm install
    ```
    
4.  Build the Tauri application:
    
    ```
    npm run tauri build
    ```

## Usage
Once built, you can run Yayav and start scanning directories for malicious activity using YARA rules. The UI provides an interactive way to manage and review scan results.

## Planned Features
- In memory scanning via linpmem/winpmem. 
- Export scan results (with the intent for easy ingestion into SEIM's). 

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have improvements or bug fixes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.