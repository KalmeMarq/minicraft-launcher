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
    theme.styles.insert("mainmenu.tab-hover-background".into(), "#353535".into());
    theme.styles.insert("mainmenu.tab-focus-background".into(), "#292929".into());
    theme.styles.insert("mainmenu.tab.foreground".into(), "#ffffff".into());
    theme.styles.insert("mainmenu.tab.selected.indicator".into(), "#ffffff".into());
    theme.styles.insert("submenu.background".into(), "#1e1e1e".into());
    theme.styles.insert("play.bar-background".into(), "#1e1e1e".into());
    theme.styles.insert("modal.dialog.background".into(), "#303030".into());
    theme.styles.insert("playbutton.foreground".into(), "#FFFFFF".into());
    theme.styles.insert("playbutton.foreground-disabled".into(), "#AAA".into());
    theme.styles.insert("playbutton.border".into(), "#000".into());
    theme.styles.insert("playbutton.border-active".into(), "#FFF".into());
    theme.styles.insert("playbutton.top".into(), "#27CE40".into());
    theme.styles.insert("playbutton.top-active".into(), "#064D2A".into());
    theme.styles.insert("playbutton.top-disabled".into(), "#1B902D".into());
    theme.styles.insert("playbutton.side".into(), "#0C6E3D".into());
    theme.styles.insert("playbutton.bottom".into(), "#064D2A".into());
    theme.styles.insert("playbutton.bottom-active".into(), "#0AA618".into());
    theme.styles.insert("playbutton.bottom-disabled".into(), "#04361D".into());
    theme.styles.insert("playbutton.gradient-top".into(), "#009147".into());
    theme.styles.insert("playbutton.gradient-top-hover".into(), "#0A8F4C".into());
    theme.styles.insert("playbutton.gradient-top-active".into(), "#008542".into());
    theme.styles.insert("playbutton.gradient-top-focus".into(), "#0A9B51".into());
    theme.styles.insert("playbutton.gradient-top-disabled".into(), "#006532".into());
    theme.styles.insert("playbutton.gradient-bottom".into(), "#008542".into());
    theme.styles.insert("playbutton.gradient-bottom-hover".into(), "#0A9B51".into());
    theme.styles.insert("playbutton.gradient-bottom-active".into(), "#009147".into());
    theme.styles.insert("playbutton.gradient-bottom-focus".into(), "#0A8F4C".into());
    theme.styles.insert("playbutton.gradient-bottom-disabled".into(), "#005D2E".into());
    theme.styles.insert("divider".into(), "#484848".into());
    theme.styles.insert("settings.about.divider".into(), "#3D3D3D".into());
    theme.styles.insert("checkbox.background".into(), "#00000000".into());
    theme.styles.insert("checkbox.border".into(), "#626262".into());
    theme.styles.insert("checkbox.hover-background".into(), "#515151".into());
    theme.styles.insert("checkbox.hover-border".into(), "#747474".into());
    theme.styles.insert("checkbox.active-background".into(), "#212121".into());
    theme.styles.insert("checkbox.active-border".into(), "#4d4d4d".into());
    theme.styles.insert("checkbox.checked-background".into(), "#008542".into());
    theme.styles.insert("checkbox.checked-hover-background".into(), "#0DD166".into());
    theme.styles.insert("checkbox.checked-active-background".into(), "#006431".into());

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

#[tauri::command]
pub fn get_themes(state: tauri::State<LauncherState>) -> Vec<Theme> {
    state.themes.lock().unwrap().themes.clone()
}

#[tauri::command]
pub fn refresh_themes(state: tauri::State<LauncherState>) -> Result<(), ()> {
    info!("Refreshing themes");

    let mut themes: Vec<Theme> = Vec::new();

    let paths = fs::read_dir(get_themes_path()).unwrap();

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

pub fn load_themes() -> LauncherThemes {
    info!("Loading launcher themes");

    let default_dark_theme_path = get_themes_path().join("default_dark.json");
    let default_light_theme_path = get_themes_path().join("default_light.json");

    // if !default_dark_theme_path.exists() {
        serde_json::to_writer_pretty(
            &File::create(default_dark_theme_path).expect("Could not save dark theme file"), 
            &default_dark_theme()
        ).expect("Could not save dark theme");
    // }

    // if !default_light_theme_path.exists() {
        serde_json::to_writer_pretty(
            &File::create(default_light_theme_path).expect("Could not save light theme file"), 
            &default_light_theme()
        ).expect("Could not save light theme");
    // }

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