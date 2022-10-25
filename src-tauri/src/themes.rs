use std::{collections::HashMap, fs, sync::Mutex};
use log::{info, warn};

use serde::{Serialize, Deserialize};
use tauri::Manager;

use crate::{utils::{get_themes_path, LauncherLoad}, LauncherState, CoreConfig};

fn default_dark_theme(app_handle: &tauri::AppHandle) -> Theme {
    let mut theme = Theme {
        theme_type: ThemeType::Dark,
        name: "Dark".to_string(),
        styles: HashMap::new()
    };

    let theme_path = app_handle.path_resolver().resolve_resource("resources/dark_theme.yml").expect("failed to resolve default dark_theme.yml resource");
    let data = fs::read_to_string(&theme_path).expect("Could not read file");
    theme.styles = serde_yaml::from_str(&data).expect("Could not load file");

    theme
}

fn default_light_theme(app_handle: &tauri::AppHandle) -> Theme {
    let mut theme = Theme {
        theme_type: ThemeType::Light,
        name: "Light".to_string(),
        styles: HashMap::new()
    };

    let theme_path = app_handle.path_resolver().resolve_resource("resources/light_theme.yml").expect("failed to resolve default light_theme.yml resource");
    let data = fs::read_to_string(&theme_path).expect("Could not read file");
    theme.styles = serde_yaml::from_str(&data).expect("Could not load file");

    theme
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "snake_case")]
pub enum ThemeType {
    Dark,
    Light
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Theme {
    #[serde(rename = "type")]
    theme_type: ThemeType,
    pub name: String,
    styles: HashMap<String, String>
}

pub struct LauncherThemes {
    pub themes: Vec<Theme>
}

impl LauncherThemes {
    fn push(&mut self, theme: Theme) {
        self.themes.push(theme);
    }
}

impl LauncherLoad<LauncherThemes> for LauncherThemes {
    fn load(app_handle: &tauri::AppHandle, core_config: &CoreConfig) -> LauncherThemes {
        info!("Loading launcher themes");

        let paths = fs::read_dir(get_themes_path(&core_config.launcher_path)).unwrap();

        let mut themes = LauncherThemes { themes: Vec::new() };
    
        themes.push(default_dark_theme(&app_handle));
        themes.push(default_light_theme(&app_handle));
    
        for path in paths {
            let file_path = path.unwrap().path();
            
            if file_path.extension().unwrap() == "json" {
                let data: String = fs::read_to_string(&file_path).unwrap().parse().unwrap();
                let theme: Theme = serde_json::from_str(&data).unwrap();
    
                info!("Found theme: type={:?} name={}", theme.theme_type, theme.name);
    
                if !themes.themes.iter().position(|t| t.name == theme.name).is_some() {
                    themes.push(theme);
                } else {
                    warn!("Theme {} already exists", theme.name);
                }
            }
        }
    
        themes
    }
}

#[tauri::command]
pub fn get_themes(state: tauri::State<LauncherState>) -> Vec<Theme> {
    state.themes.lock().unwrap().themes.clone()
}

#[tauri::command]
pub fn refresh_themes(app_handle: tauri::AppHandle, state: tauri::State<LauncherState>) -> Result<(), ()> {
    info!("Refreshing themes");

    let mut themes: Vec<Theme> = Vec::new();

    themes.push(default_dark_theme(&app_handle));
    themes.push(default_light_theme(&app_handle));

    let paths = fs::read_dir(get_themes_path(&app_handle.state::<Mutex<CoreConfig>>().lock().unwrap().launcher_path)).unwrap();

    for path in paths {
        let file_path = path.unwrap().path();
        
        if file_path.extension().unwrap() == "json" {
            let data: String = fs::read_to_string(&file_path).unwrap().parse().unwrap();
            let theme: Theme = serde_json::from_str(&data).unwrap();

            if !themes.iter().position(|t| t.name == theme.name).is_some() {
                themes.push(theme);
            }
        }
    }

    state.themes.lock().unwrap().themes.clear();
    state.themes.lock().unwrap().themes = themes;

    Ok(())
}