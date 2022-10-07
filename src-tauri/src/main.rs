#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod profiles;
pub mod utils;
mod settings;
pub mod themes;

use std::sync::Mutex;

use profiles::{LauncherProfiles, load_profiles};
use settings::{LauncherSettings, load_settings};
use tauri::{WindowBuilder, WindowUrl, Manager, AppHandle};
use themes::{LauncherThemes, load_themes};
use utils::{create_launcher_dirs, get_cache_path, get_launcher_path, get_alert_messaging, get_faq, get_news, open_folder_from_launcher, get_launcher_patch_notes, get_minicraft_patch_notes, get_minicraft_plus_patch_notes};

use crate::settings::{get_setting, set_setting};

pub struct LauncherState {
    pub settings: Mutex<LauncherSettings>,
    pub profiles: Mutex<LauncherProfiles>,
    pub themes: Mutex<LauncherThemes>,
    app_handle: AppHandle
}

#[tokio::main]
async fn main() {
    create_launcher_dirs();
    
    tauri::Builder::default()
    .setup(|app| {
        let main_win = WindowBuilder::new(app, "core", WindowUrl::App("index.html".into()))
            .data_directory(get_cache_path())
            .inner_size(1020.0, 600.0)
            .min_inner_size(1020.0, 600.0)
            .title("Minicraft Launcher")
            .visible(false)
            .build()?;

        let settings = load_settings();
        let profiles = load_profiles();
        let themes = load_themes();
        
        main_win.manage(LauncherState {
            settings: Mutex::from(settings),
            profiles: Mutex::from(profiles),
            themes: Mutex::from(themes),
            app_handle: app.app_handle()
        });

        main_win.show().unwrap();

        Ok(())
    })
    .invoke_handler(tauri::generate_handler![
        get_launcher_path,
        open_folder_from_launcher,
        get_alert_messaging,
        get_faq,
        get_news,
        get_launcher_patch_notes,
        get_minicraft_patch_notes,
        get_minicraft_plus_patch_notes,
        get_setting,
        set_setting
    ])
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd|{
        println!("{}, {argv:?}, {cwd}", app.package_info().name);
    }))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
