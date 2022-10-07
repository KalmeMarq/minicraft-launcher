#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod profiles;
pub mod utils;
mod settings;
pub mod themes;

use std::sync::Mutex;

use log::{LevelFilter, error, warn, info};
use log4rs::{append::{console::{ConsoleAppender}, file::FileAppender}, encode::pattern::PatternEncoder, Config, config::{Appender, Root, Logger}};
use profiles::{LauncherProfiles, load_profiles};
use settings::{LauncherSettings, load_settings};
use tauri::{WindowBuilder, WindowUrl, Manager, AppHandle};
use themes::{LauncherThemes, load_themes};
use utils::{create_launcher_dirs, get_cache_path};

use crate::{settings::{get_setting, set_setting}, utils::get_launcher_path};

#[allow(dead_code)]
pub struct LauncherState {
    pub settings: Mutex<LauncherSettings>,
    pub profiles: Mutex<LauncherProfiles>,
    pub themes: Mutex<LauncherThemes>,
    app_handle: AppHandle
}

fn init_logger() {
    let stdout = ConsoleAppender::builder()
        .encoder(Box::new(PatternEncoder::new("{h([{l}: {d(%Y-%m-%d %H:%M:%S.%f)}: {f}:{L}] {m}{n})}")))
        .build();
    let logfile = FileAppender::builder()
        .append(false)
        .encoder(Box::new(PatternEncoder::new("[{l}: {d(%Y-%m-%d %H:%M:%S.%f)}: {f}:{L}] {m}{n}")))
        .build(get_launcher_path().join("launcher_log.txt"))
        .unwrap();
    
    let config = Config::builder()
        .appender(Appender::builder().build("stdout", Box::new(stdout)))
        .appender(Appender::builder().build("logfile", Box::new(logfile)))
        .logger(Logger::builder().build("tao", LevelFilter::Off))
        .build(
            Root::builder()
                .appender("logfile")
                .appender("stdout")
                .build(LevelFilter::Info),
        )
        .unwrap();
    
    let _handle = log4rs::init_config(config).unwrap();
}

#[tokio::main]
async fn main() {
    create_launcher_dirs();

    init_logger();

    error!("Goes to stderr and file");
    warn!("Goes to stderr and file");
    info!("Goes to stderr and file");
    
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
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd|{
        println!("{}, {argv:?}, {cwd}", app.package_info().name);
    }))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
