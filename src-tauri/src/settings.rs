use std::fs::{self, File};

use serde::{Deserialize, Serialize};

use crate::utils::get_launcher_path;

fn bool_true() -> bool {
    true
}

fn default_language() -> String {
    "en-US".to_string()
}

fn default_sort_by() -> String {
    "name".to_string()
}

#[derive(Serialize, Deserialize)]
pub struct PatchNotesFilter {
    #[serde(default = "bool_true")]
    release: bool,
    #[serde(default = "bool_true")]
    beta: bool
}

#[derive(Serialize, Deserialize)]
pub struct MinicraftConfigurationFilter {
    #[serde(rename = "sortBy", default = "default_sort_by")]
    sort_by: String
}

#[derive(Serialize, Deserialize)]
pub struct MinicraftPlusConfigurationFilter {
    #[serde(default = "bool_true")]
    release: bool,
    #[serde(default = "bool_true")]
    beta: bool,
    #[serde(rename = "sortBy", default = "default_sort_by")]
    sort_by: String
}

#[derive(Serialize, Deserialize)]
pub struct LauncherSettings {
    #[serde(rename = "keepLauncherOpen", default = "bool_true")]
    keep_launcher_open: bool,
    #[serde(default = "default_language")]
    language: String,
    #[serde(rename = "openOutputLog", default)]
    open_output_log: bool,
    #[serde(rename = "minicraftPlusPatchNotesFilter")]
    minicraft_plus_patch_notes_filter: PatchNotesFilter,
    #[serde(rename = "minicraftPatchNotesFilter")]
    minicraft_patch_notes_filter: PatchNotesFilter,
    #[serde(rename = "minicraftPlusConfigurationFilter")]
    minicraft_plus_configuration_filter: MinicraftPlusConfigurationFilter,
    #[serde(rename = "minicraftConfigurationFilter")]
    minicraft_configuration_filter: MinicraftConfigurationFilter
}

pub fn load_settings() -> LauncherSettings {
    let settings_path = get_launcher_path().join("launcher_settings.json");

    let mcp_pn_filter = PatchNotesFilter {
        release: true,
        beta: true
    };

    let mc_pn_filter = PatchNotesFilter {
        release: true,
        beta: true
    };

    let mcp_conf_filter = MinicraftPlusConfigurationFilter {
        release: true,
        beta: true,
        sort_by: "name".to_string()
    };

    let mc_conf_filter = MinicraftConfigurationFilter {
        sort_by: "name".to_string()
    };

    let mut settings: LauncherSettings = LauncherSettings {
        keep_launcher_open: true,
        language: "en-US".to_string(),
        open_output_log: false,
        minicraft_plus_patch_notes_filter: mcp_pn_filter,
        minicraft_patch_notes_filter: mc_pn_filter,
        minicraft_plus_configuration_filter: mcp_conf_filter,
        minicraft_configuration_filter: mc_conf_filter
    };

    if settings_path.exists() {
        let data = fs::read_to_string(settings_path).expect("Could not read launcher settings");
        settings = serde_json::from_str(&data).expect("Could not load launcher settings");
    } else {
        serde_json::to_writer_pretty(&File::create(settings_path).expect("Could not create launcher settings"), &settings).expect("Could not save settings");
    }

    settings
}