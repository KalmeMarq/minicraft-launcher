#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{WindowBuilder, WindowUrl};

fn main() {
  tauri::Builder::default()
    .setup(|app| {
        let _main_win = WindowBuilder::new(app, "core", WindowUrl::App("index.html".into()))
            .inner_size(1020.0, 600.0)
            .min_inner_size(1020.0, 600.0)
            .title("Minicraft Launcher")
            .build()?;
        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
