use std::fs::{self, File};

use serde::{Deserialize, Serialize};
use tauri::State;

use crate::{utils::get_launcher_path, LauncherState};

fn bool_true() -> bool {
    true
}

fn default_language() -> String {
    "en-US".to_string()
}

fn default_theme() -> String {
    "dark".to_string()
}

fn default_ui_state() -> UIState {
    let pn_filter = PatchNotesFilter {
        releases: true,
        betas: false
    };

    let conf_filter = ConfigurationFilter {
        releases: true,
        betas: true,
        sort_by: SortBy::Name
    };

    let ui_state = UIState {
        configurations: conf_filter,
        patch_notes: pn_filter
    };

    ui_state
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PatchNotesFilter {
    #[serde(default = "bool_true")]
    releases: bool,
    #[serde(default = "bool_true")]
    betas: bool
}

impl PatchNotesFilter {
    pub fn set_releases(&mut self, value: bool) {
        self.releases = value;
    }

    pub fn set_betas(&mut self, value: bool) {
        self.betas = value;
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
enum SortBy {
    #[serde(rename = "name")]
    Name,
    #[serde(rename = "last-played")]
    LastPlayed
}

impl SortBy {
    fn as_str(&self) -> &'static str {
        match self {
            SortBy::Name => "name",
            SortBy::LastPlayed => "last-played"
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ConfigurationFilter {
    #[serde(default = "bool_true")]
    releases: bool,
    #[serde(default = "bool_true")]
    betas: bool,
    #[serde(rename = "sortBy")]
    sort_by: SortBy
}

impl ConfigurationFilter {
    pub fn set_sort_by(&mut self, value: &str) {
        if value == "last-played" {
            self.sort_by = SortBy::LastPlayed;
        } else if value == "name" {
            self.sort_by = SortBy::Name;
        }
    }

    pub fn set_releases(&mut self, value: bool) {
        self.releases = value;
    }

    pub fn set_betas(&mut self, value: bool) {
        self.betas = value;
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct UIState {
    configurations: ConfigurationFilter,
    #[serde(rename = "patchNotes")]
    patch_notes: PatchNotesFilter
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LauncherSettings {
    #[serde(default = "bool_true")]
    keep_launcher_open: bool,
    #[serde(default = "default_theme")]
    theme: String,
    #[serde(default = "default_language")]
    language: String,
    #[serde(default)]
    open_output_log: bool,
    #[serde(default)]
    show_community_tab: bool,
    #[serde(default)]
    animate_pages: bool,
    #[serde(default = "default_ui_state")]
    minicraft_plus: UIState,
    #[serde(default = "default_ui_state")]
    minicraft: UIState
}

impl LauncherSettings {
    pub fn set_keep_launcher_open(&mut self, value: bool) {
        self.keep_launcher_open = value;
    }

    pub fn set_language(&mut self, value: &str) {
        if LANGUAGES.contains(&value) {
            self.language = value.to_string();
        }
    }

    pub fn set_theme(&mut self, value: &str) {
        self.theme = value.to_string();
    }

    pub fn set_animate_pages(&mut self, value: bool) {
        self.animate_pages = value;
    }

    pub fn set_show_community_tab(&mut self, value: bool) {
        self.show_community_tab = value;
    }

    pub fn set_open_output_log(&mut self, value: bool) {
        self.open_output_log = value;
    }
}

fn parse_set_bool(val: &str) -> bool {
    match val {
        "true" => true,
        "false" => false,
        _ => false,
    }
}

static LANGUAGES: [&str; 4] = ["en-US", "en-GB", "pt-PT", "pt-BR"];

#[tauri::command]
pub fn set_setting(state: State<LauncherState>, option: &str, value: &str) {
    match option {
        "keepLauncherOpen" => state.settings.lock().unwrap().set_keep_launcher_open(parse_set_bool(value)),
        "theme" => state.settings.lock().unwrap().set_theme(value),
        "language" => state.settings.lock().unwrap().set_language(value),
        "animatePages" => state.settings.lock().unwrap().set_animate_pages(parse_set_bool(value)),
        "openOutputLog" => state.settings.lock().unwrap().set_open_output_log(parse_set_bool(value)),
        "showCommunityTab" => state.settings.lock().unwrap().set_show_community_tab(parse_set_bool(value)),
        "minicraftPlus:configurations/sortBy" => state.settings.lock().unwrap().minicraft_plus.configurations.set_sort_by(value),
        "minicraftPlus:configurations/releases" => state.settings.lock().unwrap().minicraft_plus.configurations.set_releases(parse_set_bool(value)),
        "minicraftPlus:configurations/betas" => state.settings.lock().unwrap().minicraft_plus.configurations.set_betas(parse_set_bool(value)),
        "minicraftPlus:patchNotes/betas" => state.settings.lock().unwrap().minicraft_plus.patch_notes.set_betas(parse_set_bool(value)),
        "minicraftPlus:patchNotes/releases" => state.settings.lock().unwrap().minicraft_plus.patch_notes.set_releases(parse_set_bool(value)),
        "minicraft:configurations/sortBy" => state.settings.lock().unwrap().minicraft.configurations.set_sort_by(value),
        "minicraft:configurations/releases" => state.settings.lock().unwrap().minicraft.configurations.set_releases(parse_set_bool(value)),
        "minicraft:configurations/betas" => state.settings.lock().unwrap().minicraft.configurations.set_betas(parse_set_bool(value)),
        "minicraft:patchNotes/betas" => state.settings.lock().unwrap().minicraft.patch_notes.set_betas(parse_set_bool(value)),
        "minicraft:patchNotes/releases" => state.settings.lock().unwrap().minicraft.patch_notes.set_releases(parse_set_bool(value)),
        _ => {}
    }
}

#[tauri::command]
pub fn get_setting(state: State<LauncherState>, option: &str) -> String {
   match option {
       "keepLauncherOpen" => state.settings.lock().unwrap().keep_launcher_open.to_string(),
       "theme" => state.settings.lock().unwrap().theme.clone(),
       "language" => state.settings.lock().unwrap().language.clone(),
       "animatePages" => state.settings.lock().unwrap().animate_pages.to_string(),
       "openOutputLog" => state.settings.lock().unwrap().open_output_log.to_string(),
       "showCommunityTab" => state.settings.lock().unwrap().show_community_tab.to_string(),
       "minicraftPlus:configurations/sortBy" => state.settings.lock().unwrap().minicraft_plus.configurations.sort_by.as_str().to_string(),
       "minicraftPlus:configurations/releases" => state.settings.lock().unwrap().minicraft_plus.configurations.releases.to_string(),
       "minicraftPlus:configurations/betas" => state.settings.lock().unwrap().minicraft_plus.configurations.betas.to_string(),
       "minicraftPlus:patchNotes/releases" => state.settings.lock().unwrap().minicraft_plus.patch_notes.releases.to_string(),
       "minicraftPlus:patchNotes/betas" => state.settings.lock().unwrap().minicraft_plus.patch_notes.betas.to_string(),
       "minicraft:configurations/sortBy" => state.settings.lock().unwrap().minicraft.configurations.sort_by.as_str().to_string(),
       "minicraft:configurations/releases" => state.settings.lock().unwrap().minicraft.configurations.releases.to_string(),
       "minicraft:configurations/betas" => state.settings.lock().unwrap().minicraft.configurations.betas.to_string(),
       "minicraft:patchNotes/releases" => state.settings.lock().unwrap().minicraft.patch_notes.releases.to_string(),
       "minicraft:patchNotes/betas" => state.settings.lock().unwrap().minicraft.patch_notes.betas.to_string(),
       _ => "unknown".to_string()
   } 
}

pub fn load_settings() -> LauncherSettings {
    let settings_path = get_launcher_path().join("launcher_settings.json");

    let mut settings: LauncherSettings = LauncherSettings {
        keep_launcher_open: true,
        theme: default_theme(),
        language: default_language(),
        open_output_log: false,
        show_community_tab: false,
        animate_pages: false,
        minicraft_plus: default_ui_state(),
        minicraft: default_ui_state()
    };

    if settings_path.exists() {
        let data = fs::read_to_string(settings_path).expect("Could not read launcher settings");
        settings = serde_json::from_str(&data).expect("Could not load launcher settings");
    } else {
        serde_json::to_writer_pretty(&File::create(settings_path).expect("Could not create launcher settings"), &settings).expect("Could not save settings");
    }

    settings
}