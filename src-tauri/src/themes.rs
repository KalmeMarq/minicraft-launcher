use std::{collections::HashMap, fs::{self, File}};
use log::{info, warn};

use serde::{Serialize, Deserialize};

use crate::{utils::get_themes_path, LauncherState};

fn default_dark_theme() -> Theme {
    let mut theme = Theme {
        theme_type: ThemeType::Dark,
        name: "Dark".to_string(),
        styles: HashMap::new()
    };

    theme.styles.insert("background".into(), "#333333".into());
    theme.styles.insert("mainmenu.background".into(), "#1e1e1e".into());
    theme.styles.insert("mainmenu.tab.background".into(), "#1e1e1e".into());
    theme.styles.insert("mainmenu.tab.foreground".into(), "#ffffff".into());
    theme.styles.insert("mainmenu.tab.selected.indicator".into(), "#ffffff".into());
    theme.styles.insert("submenu.background".into(), "#1e1e1e".into());
    theme.styles.insert("modal.dialog.background".into(), "#303030".into());

    theme
}

fn default_light_theme() -> Theme {
    let mut theme = Theme {
        theme_type: ThemeType::Light,
        name: "Light".to_string(),
        styles: HashMap::new()
    };

    theme.styles.insert("background".into(), "#fcfcfc".into());
    theme.styles.insert("mainmenu.background".into(), "#f1f1f1".into());
    theme.styles.insert("mainmenu.tab.background".into(), "#f1f1f1".into());
    theme.styles.insert("mainmenu.tab.foreground".into(), "#222222".into());
    theme.styles.insert("mainmenu.tab.selected.indicator".into(), "#1f51db".into());
    theme.styles.insert("submenu.background".into(), "#f1f1f1".into());
    theme.styles.insert("modal.dialog.background".into(), "#f1f1f1".into());

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
    name: String,
    styles: HashMap<String, String>
}

pub struct LauncherThemes {
    themes: Vec<Theme>
}

impl LauncherThemes {
    fn push(&mut self, theme: Theme) {
        self.themes.push(theme);
    }
}

#[tauri::command]
pub fn get_themes(state: tauri::State<LauncherState>) -> Vec<Theme> {
    state.themes.lock().unwrap().themes.clone()
}

pub fn load_themes() -> LauncherThemes {
    info!("Loading launcher themes");

    let default_dark_theme_path = get_themes_path().join("default_dark.json");
    let default_light_theme_path = get_themes_path().join("default_light.json");

    if !default_dark_theme_path.exists() {
        serde_json::to_writer_pretty(
            &File::create(default_dark_theme_path).expect("Could not save dark theme file"), 
            &default_dark_theme()
        ).expect("Could not save dark theme");
    }

    if !default_light_theme_path.exists() {
        serde_json::to_writer_pretty(
            &File::create(default_light_theme_path).expect("Could not save light theme file"), 
            &default_light_theme()
        ).expect("Could not save light theme");
    }

    let paths = fs::read_dir(get_themes_path()).unwrap();

    let mut themes = LauncherThemes { themes: Vec::new() };

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