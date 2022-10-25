use std::{collections::HashMap, path::PathBuf, fs::File};

use log::info;
use serde::{Serialize, Deserialize};
use time::OffsetDateTime;

use crate::{utils::{LauncherSave, LauncherLoad}, LauncherState, CoreConfig};

fn get_launcher_profiles_path(launcher_path: &PathBuf) -> PathBuf {
    launcher_path.join("launcher_profiles.json")
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ProfileType {
    #[serde(rename = "minicraftplus")]
    MinicraftPlus,
    #[serde(rename = "minicraft")]
    Minicraft
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    #[serde(rename = "type")]
    profile_type: ProfileType,
    name: String,
    icon: String,
    #[serde(with = "time::serde::rfc3339")]
    created: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    last_used: OffsetDateTime,
    version_id: String,
    last_time_played: u32,
    total_time_played: u32,
    jvm_args: Option<String>,
    java_path: Option<String>,
    game_dir: String
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Group {
    #[serde(default = "bool::default")]
    hidden: bool,
    installations: Vec<String>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LauncherProfiles {
    profiles: HashMap<String, Profile>,
    groups: HashMap<String, Group>
}

impl LauncherSave for LauncherProfiles {
    fn save(&self, _app_handle: &tauri::AppHandle, core_config: &CoreConfig) {
        info!("Saving launcher profiles");

        serde_json::to_writer_pretty(
            &File::create(get_launcher_profiles_path(&core_config.launcher_path)).expect("Could not save launcher profiles file"), 
            self
        ).expect("Could not save launcher profiles");
    } 
}

impl LauncherLoad<LauncherProfiles> for LauncherProfiles {
    fn load(app_handle: &tauri::AppHandle, core_config: &CoreConfig) -> LauncherProfiles {
        info!("Loading launcher profiles");

        let profiles_path = get_launcher_profiles_path(&core_config.launcher_path);

        let mut profiles: LauncherProfiles = LauncherProfiles {
            profiles: HashMap::new(),
            groups: HashMap::new()
        };
    
        if profiles_path.exists() {
            let data = std::fs::read_to_string(profiles_path).expect("Could not read launcher profiles file");
            profiles = serde_json::from_str(&data).expect("Could not load launcher profiles");
        } else {
            profiles.save(app_handle, core_config);
        }
    
        profiles
    }
}

#[tauri::command]
pub fn get_minicraftplus_profiles(state: tauri::State<LauncherState>) -> HashMap<String, Profile>  {
   state.profiles.lock().unwrap().profiles.clone().into_iter().filter(|(_, prof)| prof.profile_type == ProfileType::MinicraftPlus).collect()
}

#[tauri::command]
pub fn get_minicraft_profiles(state: tauri::State<LauncherState>) -> HashMap<String, Profile> {
    state.profiles.lock().unwrap().profiles.clone().into_iter().filter(|(_, prof)| prof.profile_type == ProfileType::Minicraft).collect()
}

#[tauri::command]
pub fn create_profile(state: tauri::State<LauncherState>, profile_type: ProfileType, id: String, name: String, icon: String, version_id: String, game_dir: String, jvm_args: Option<String>, java_path: Option<String>) {
    state.profiles.lock().unwrap().profiles.insert(id, Profile {
        profile_type,
        name,
        icon,
        created: OffsetDateTime::now_utc(),
        last_used: OffsetDateTime::now_utc(),
        version_id,
        game_dir,
        jvm_args,
        java_path,
        last_time_played: 0,
        total_time_played: 0
    });
}

#[tauri::command]
pub fn update_profile(state: tauri::State<LauncherState>, id: String, name: Option<String>, icon: Option<String>, version_id: Option<String>, game_dir: Option<String>, jvm_args: Option<String>, java_path: Option<String>) {
    if state.profiles.lock().unwrap().profiles.contains_key(&id) {
        let mut profile = state.profiles.lock().unwrap().profiles.get_mut(&id).unwrap().clone();

        if name.is_some() {
            profile.name = name.unwrap();
        }

        if icon.is_some() {
            profile.icon = icon.unwrap();
        }

        if version_id.is_some() {
            profile.version_id = version_id.unwrap();
        }

        if game_dir.is_some() {
            profile.game_dir = game_dir.unwrap();
        }

        if jvm_args.is_some() {
            profile.jvm_args = jvm_args;
        }

        if java_path.is_some() {
            profile.java_path = java_path;
        }

        state.profiles.lock().unwrap().profiles.insert(id, profile);
    }
}

#[derive(Serialize)]
pub struct ProfileResponse {
    message: Option<String>,
    success: bool
}

#[tauri::command]
pub fn duplicate_profile(state: tauri::State<LauncherState>, profile_id: String, duplicate_profile_id: String) -> ProfileResponse {
    if state.profiles.lock().unwrap().profiles.contains_key(&profile_id) {
        let mut profile = state.profiles.lock().unwrap().profiles.get_mut(&profile_id).unwrap().clone();
        profile.total_time_played = 0;
        profile.last_time_played = 0;

        state.profiles.lock().unwrap().profiles.insert(duplicate_profile_id, profile);

        ProfileResponse {
            message: None,
            success: true
        }
    } else {
        ProfileResponse {
            message: Some("Profile does not exist".into()),
            success: false
        }
    }
}

#[tauri::command]
pub fn delete_profile(state: tauri::State<LauncherState>, profile_id: String) -> ProfileResponse {
    if state.profiles.lock().unwrap().profiles.contains_key(&profile_id) {
        state.profiles.lock().unwrap().profiles.remove(&profile_id).unwrap();
        
        ProfileResponse {
            message: None,
            success: true
        }
    } else {
        ProfileResponse {
            message: Some("Profile does not exist".into()),
            success: false
        }
    }
}