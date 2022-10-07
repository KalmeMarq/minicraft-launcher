use std::{collections::HashMap, fs::File};

use serde::{Serialize, Deserialize};
use time::OffsetDateTime;

use crate::utils::get_launcher_path;

#[derive(Debug, Serialize, Deserialize, Clone)]
enum ProfileType {
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

pub fn load_profiles() -> LauncherProfiles {
    let profiles_path = get_launcher_path().join("launcher_profiles.json");

    let mut profiles: LauncherProfiles = LauncherProfiles {
        profiles: HashMap::new(),
        groups: HashMap::new()
    };

    if profiles_path.exists() {
        let data = std::fs::read_to_string(profiles_path).expect("Could not read launcher profiles file");
        profiles = serde_json::from_str(&data).expect("Could not load launcher profiles");
    } else {
        serde_json::to_writer_pretty(&File::create(profiles_path).expect("Could not create launcher profiles file"),
            &profiles,
        )
        .expect("Could not save profiles");
    }

    profiles
}