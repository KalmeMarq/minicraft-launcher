#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod profiles;

use std::{path::PathBuf, fs::{self, File}, process::Command, sync::Mutex};

use profiles::{LauncherProfiles, load_profiles};
use serde::{Serialize, Deserialize};
use tauri::{WindowBuilder, WindowUrl, Manager};

#[tauri::command]
fn get_launcher_path() -> PathBuf {
    dirs::data_dir().unwrap().join(".minicraft_launcher")
}

fn get_cache_path() -> PathBuf {
    get_launcher_path().join("cache")
}

fn get_versions_path() -> PathBuf {
    get_launcher_path().join("versions")
}

fn get_saves_path() -> PathBuf {
    get_launcher_path().join("saves")
}

fn get_libraries_path() -> PathBuf {
    get_launcher_path().join("libraries")
}

fn open_folder(path: PathBuf) {
    #[cfg(target_os = "windows")]
    Command::new("explorer").arg("/select,".to_owned() + path.to_str().unwrap()).spawn().unwrap();

    #[cfg(target_os = "macos")]
    Command::new("open").args(["-R", &path]).spawn().unwrap();

    #[cfg(target_os = "linux")]
    Command::new("xdg-open").arg(&path).spawn().unwrap();    
}

#[tauri::command]
fn open_folder_from_launcher(id: &str) {
    let path = get_launcher_path().join(id);
    
    if fs::metadata(&path).is_ok() {
        open_folder(path)
    }
}

fn bool_true() -> bool {
    true
}

fn default_language() -> String {
    "en-US".to_string()
}

pub struct LauncherState {
    pub settings: Mutex<LauncherSettings>,
    pub profiles: Mutex<LauncherProfiles>
}

#[derive(Serialize, Deserialize)]
pub struct LauncherSettings {
    #[serde(rename = "keepLauncherOpen", default = "bool_true")]
    keep_launcher_open: bool,
    #[serde(default = "default_language")]
    language: String,
    #[serde(rename = "openOutputLog", default)]
    open_output_log: bool
}

fn load_settings() -> LauncherSettings {
    let settings_path = get_launcher_path().join("launcher_settings.json");

    let mut settings: LauncherSettings = LauncherSettings {
        keep_launcher_open: true,
        language: "en-US".to_string(),
        open_output_log: false
    };

    if settings_path.exists() {
        let data = fs::read_to_string(settings_path).expect("Could not read launcher settings");
        settings = serde_json::from_str(&data).expect("Could not load launcher settings");
    } else {
        serde_json::to_writer_pretty(&File::create(settings_path).expect("Could not create launcher settings"), &settings).expect("Could not save settings");
    }

    settings
}

#[tokio::main]
async fn main() {
    if !get_launcher_path().exists() {
        fs::create_dir(get_launcher_path()).expect("Could not create launcher directory");
    }
    
    if !get_versions_path().exists() {
        fs::create_dir(get_versions_path()).expect("Could not create versions directory");
    }

    if !get_saves_path().exists() {
        fs::create_dir(get_saves_path()).expect("Could not create saves directory");
    }

    if !get_libraries_path().exists() {
        fs::create_dir(get_libraries_path()).expect("Could not create libraries directory");
    }
    
    tauri::Builder::default()
    .setup(|app| {
        let main_win = WindowBuilder::new(app, "core", WindowUrl::App("index.html".into()))
            .data_directory(get_cache_path())
            .inner_size(1020.0, 600.0)
            .min_inner_size(1020.0, 600.0)
            .title("Minicraft Launcher")
            .visible(false)
            .build()?;

        tauri::async_runtime::spawn(async move {
            let settings = load_settings();
            let profiles = load_profiles();
            
            main_win.manage(LauncherState {
                settings: Mutex::from(settings),
                profiles: Mutex::from(profiles)
            });

            main_win.show().unwrap();
        });

        Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_launcher_path, open_folder_from_launcher])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
