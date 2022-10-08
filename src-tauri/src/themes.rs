use std::{collections::HashMap, fs::{self}};
use log::info;

use serde::{Serialize, Deserialize};

use crate::utils::get_themes_path;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum ThemeType {
    Dark,
    Light
}

#[derive(Serialize, Deserialize, Debug)]
struct Theme {
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

pub fn load_themes() -> LauncherThemes {
    info!("Loading launcher themes");

    let paths = fs::read_dir(get_themes_path()).unwrap();

    let mut themes = LauncherThemes { themes: Vec::new() };

    for path in paths {
        let file_path = path.unwrap().path();
        
        if file_path.extension().unwrap() == "json" {
            let data: String = fs::read_to_string(&file_path).unwrap().parse().unwrap();
            let theme: Theme = serde_json::from_str(&data).unwrap();

            info!("Found theme: type={:?} name={}", theme.theme_type, theme.name);

            if themes.themes.iter().position(|t| t.name != theme.name).is_some() {
                themes.push(theme);
            }
        }
    }

    themes
}