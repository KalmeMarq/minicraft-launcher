use std::{collections::HashMap, path::PathBuf, fs::File, hash::Hash};

use log::info;
use serde::{Serialize, Deserialize};
use time::OffsetDateTime;

use crate::{utils::{LauncherSave, LauncherLoad, get_random_id, get_installations_path}, LauncherState, CoreConfig};

fn get_launcher_profiles_path(launcher_path: &PathBuf) -> PathBuf {
    launcher_path.join("launcher_profiles.json")
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MinicraftProfile {
    #[serde(rename = "type")]
    profile_type: String,
    name: String,
    icon: String,
    #[serde(with = "time::serde::rfc3339")]
    created: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    last_used: OffsetDateTime,
    #[serde(rename = "lastVersionId")]
    version_id: String,
    last_time_played: u32,
    total_time_played: u32,
    #[serde(skip_serializing_if="Option::is_none")]
    jvm_args: Option<String>,
    #[serde(skip_serializing_if="Option::is_none")]
    java_path: Option<String>,
    #[serde(skip_serializing_if="Option::is_none")]
    game_dir: Option<String>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnitycraftProfile {
    #[serde(rename = "type")]
    profile_type: String,
    name: String,
    icon: String,
    #[serde(with = "time::serde::rfc3339")]
    created: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    last_used: OffsetDateTime,
    #[serde(rename = "lastVersionId")]
    version_id: String,
    last_time_played: u32,
    total_time_played: u32
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "format")]
pub enum Profile {
    #[serde(rename = "minicraftplus")]
    MinicraftPlus(MinicraftProfile),
    #[serde(rename = "minicraft")]
    Minicraft(MinicraftProfile),
    #[serde(rename = "unitycraft")]
    Unitycraft(UnitycraftProfile)
}

impl Profile {
    pub fn id(&self) -> String {
        match self {
            Profile::MinicraftPlus(_) => "minicraftplus".to_string(),
            Profile::Minicraft(_) => "minicraft".to_string(),
            Profile::Unitycraft(_) => "unitycraft".to_string()
        }
    }

    fn reset_time_played(&mut self) {
        match self {
            Profile::MinicraftPlus(profile) => {
                profile.total_time_played = 0;
                profile.last_time_played = 0;
            },
            Profile::Minicraft(profile) => {
                profile.total_time_played = 0;
                profile.last_time_played = 0;
            },
            Profile::Unitycraft(profile) => {
                profile.total_time_played = 0;
                profile.last_time_played = 0;
            }
        }
    }
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

pub fn default_profiles(_core_config: &CoreConfig) -> HashMap<String, Profile> {
    let mut map: HashMap<String, Profile> = HashMap::new();

    map.insert(get_random_id(), Profile::MinicraftPlus(MinicraftProfile {
        profile_type: "latest-release".into(),
        name: "".into(),
        icon: "Apple".into(),
        version_id: "latest-release".into(),
        last_time_played: 0,
        total_time_played: 0,
        created: OffsetDateTime::now_utc(),
        last_used: OffsetDateTime::now_utc(),
        game_dir: None,
        java_path: None,
        jvm_args: None
    }));

    let beta_id = get_random_id();
    map.insert(beta_id, Profile::MinicraftPlus(MinicraftProfile {
        profile_type: "latest-beta".into(),
        name: "".into(),
        icon: "Wood_Shovel".into(),
        version_id: "latest-beta".into(),
        last_time_played: 0,
        total_time_played: 0,
        created: OffsetDateTime::now_utc(),
        last_used: OffsetDateTime::now_utc(),
        game_dir: None,
        java_path: None,
        jvm_args: None
    }));

    map
}

impl LauncherProfiles {
    fn default(core_config: &CoreConfig) -> Self {
        LauncherProfiles {
            profiles: default_profiles(core_config),
            groups: HashMap::new()
        }
    }
}

#[allow(dead_code)]
impl LauncherProfiles {
    fn check_profiles(&mut self) {
    }
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

        let mut profiles: LauncherProfiles = LauncherProfiles::default(core_config);

        if profiles_path.exists() {
            let data = std::fs::read_to_string(profiles_path).expect("Could not read launcher profiles file");
            profiles = serde_json::from_str(&data).expect("Could not load launcher profiles");
        } else {
            profiles.save(app_handle, core_config);
        }

        profiles.check_profiles();

        profiles
    }
}

#[tauri::command]
pub fn get_minicraftplus_profiles(state: tauri::State<LauncherState>) -> HashMap<String, Profile>  {
   state.profiles.lock().unwrap().profiles.clone().into_iter().filter(|(_, prof)| prof.id() == "minicraftplus").collect()
}

#[tauri::command]
pub fn get_minicraft_profiles(state: tauri::State<LauncherState>) -> HashMap<String, Profile> {
    state.profiles.lock().unwrap().profiles.clone().into_iter().filter(|(_, prof)| prof.id() == "minicraft").collect()
}

#[tauri::command]
pub fn get_unitycraft_profiles(state: tauri::State<LauncherState>) -> HashMap<String, Profile> {
    state.profiles.lock().unwrap().profiles.clone().into_iter().filter(|(_, prof)| prof.id() == "unitycraft").collect()
}

#[tauri::command]
pub fn create_minicraft_profile(state: tauri::State<LauncherState>, id: String, name: String, icon: String, version_id: String, game_dir: Option<String>, jvm_args: Option<String>, java_path: Option<String>) {
    state.profiles.lock().unwrap().profiles.insert(id, Profile::Minicraft(MinicraftProfile {
        profile_type: "custom".into(),
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
    }));
}

#[tauri::command]
pub fn create_unitycraft_profile(state: tauri::State<LauncherState>, id: String, name: String, icon: String, version_id: String) {
    state.profiles.lock().unwrap().profiles.insert(id, Profile::Unitycraft(UnitycraftProfile {
        profile_type: "custom".into(),
        name,
        icon,
        created: OffsetDateTime::now_utc(),
        last_used: OffsetDateTime::now_utc(),
        version_id,
        last_time_played: 0,
        total_time_played: 0
    }));
}

#[tauri::command]
pub fn update_minicraft_profile(state: tauri::State<LauncherState>, id: String, name: Option<String>, icon: Option<String>, version_id: Option<String>, game_dir: Option<String>, jvm_args: Option<String>, java_path: Option<String>) -> ProfileResponse{
    if state.profiles.lock().unwrap().profiles.contains_key(&id) {
        let profile = state.profiles.lock().unwrap().profiles.get_mut(&id).unwrap().clone();

        match profile {
            Profile::MinicraftPlus(mut prof) => {
                if name.is_some() {
                    prof.name = name.unwrap();
                }

                if icon.is_some() {
                    prof.icon = icon.unwrap();
                }

                if version_id.is_some() {
                    prof.version_id = version_id.unwrap();
                }

                prof.game_dir = game_dir;

                prof.jvm_args = jvm_args;

                prof.java_path = java_path;

                state.profiles.lock().unwrap().profiles.insert(id, Profile::MinicraftPlus(prof));
            },
            Profile::Minicraft(mut prof) => {
                if name.is_some() {
                    prof.name = name.unwrap();
                }

                if icon.is_some() {
                    prof.icon = icon.unwrap();
                }

                if version_id.is_some() {
                    prof.version_id = version_id.unwrap();
                }

                prof.game_dir = game_dir;

                prof.jvm_args = jvm_args;

                prof.java_path = java_path;

                state.profiles.lock().unwrap().profiles.insert(id, Profile::Minicraft(prof));
            },
            _ => {}
        }

        ProfileResponse {
            title: None,
            message: None,
            success: true
        }
    } else {
        ProfileResponse {
            title: Some("Failed to update profile".into()),
            message: Some("Profile does not exist".into()),
            success: false
        }
    }
}

#[tauri::command]
pub fn update_unitycraft_profile(state: tauri::State<LauncherState>, id: String, name: Option<String>, icon: Option<String>, version_id: Option<String>) -> ProfileResponse{
    if state.profiles.lock().unwrap().profiles.contains_key(&id) {
        let profile = state.profiles.lock().unwrap().profiles.get_mut(&id).unwrap().clone();

        match profile {
            Profile::Unitycraft(mut prof) => {
                if name.is_some() {
                    prof.name = name.unwrap();
                }

                if icon.is_some() {
                    prof.icon = icon.unwrap();
                }

                if version_id.is_some() {
                    prof.version_id = version_id.unwrap();
                }

                state.profiles.lock().unwrap().profiles.insert(id, Profile::Unitycraft(prof));
            },
            _ => {}
        }

        ProfileResponse {
            title: None,
            message: None,
            success: true
        }
    } else {
        ProfileResponse {
            title: Some("Failed to update profile".into()),
            message: Some("Profile does not exist".into()),
            success: false
        }
    }
}

#[derive(Serialize)]
pub struct ProfileResponse {
    title: Option<String>,
    message: Option<String>,
    success: bool
}

#[tauri::command]
pub fn duplicate_profile(state: tauri::State<LauncherState>, profile_id: String, duplicate_profile_id: String) -> ProfileResponse {
    if state.profiles.lock().unwrap().profiles.contains_key(&profile_id) {
        let mut profile = state.profiles.lock().unwrap().profiles.get_mut(&profile_id).unwrap().clone();

        profile.reset_time_played();

        state.profiles.lock().unwrap().profiles.insert(duplicate_profile_id, profile);

        ProfileResponse {
            title: None,
            message: None,
            success: true
        }
    } else {
        ProfileResponse {
            title: Some("Failed to duplicate profile".into()),
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
            title: None,
            message: None,
            success: true
        }
    } else {
        ProfileResponse {
            title: Some("Failed to delete profile".into()),
            message: Some("Profile does not exist".into()),
            success: false
        }
    }
}
