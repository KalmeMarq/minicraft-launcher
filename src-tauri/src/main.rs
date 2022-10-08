#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod profiles;
pub mod utils;
pub mod settings;
pub mod themes;

use std::sync::Mutex;

use log::info;
use profiles::{LauncherProfiles, load_profiles};
use settings::{LauncherSettings, load_settings};
use tauri::{WindowBuilder, WindowUrl, Manager, AppHandle};
use themes::{LauncherThemes, load_themes};
use utils::{create_launcher_dirs, get_cache_path, LauncherSave};

use crate::{settings::{get_setting, set_setting}, utils::init_logger};

#[allow(dead_code)]
pub struct LauncherState {
    pub settings: Mutex<LauncherSettings>,
    pub profiles: Mutex<LauncherProfiles>,
    pub themes: Mutex<LauncherThemes>,
    app_handle: AppHandle
}

impl LauncherState {
    fn save(&self) {
        self.settings.lock().unwrap().save();
        self.profiles.lock().unwrap().save();
    }
}

#[tokio::main]
async fn main() {
    create_launcher_dirs();

    init_logger();
    
    tauri::Builder::default()
        .setup(|app| {
            info!("Creating core window");
            
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

            info!("Window creation finished");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            utils::get_launcher_path,
            utils::open_folder_from_launcher,
            utils::get_alert_messaging,
            utils::get_faq,
            utils::get_news,
            utils::get_launcher_patch_notes,
            utils::get_minicraft_patch_notes,
            utils::get_minicraft_plus_patch_notes,
            get_setting,
            set_setting
        ])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Destroyed => {
                if event.window().label() == "core" {
                    event.window().app_handle().state::<LauncherState>().save();
                }
            }
            _ => {}
          })
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd|{
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
        }))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    info!("Closing app");
}
