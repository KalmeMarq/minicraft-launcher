use std::{collections::HashMap, fs::File};

use serde::{Serialize, Deserialize};
use time::OffsetDateTime;

use crate::{get_launcher_path};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Profile {
    #[serde(rename = "type")]
    profile_type: String,
    name: String,
    icon: String,
    #[serde(with = "time::serde::rfc3339")]
    created: OffsetDateTime,
    #[serde(rename = "lastUsed", with = "time::serde::rfc3339")]
    last_used: OffsetDateTime,
    #[serde(rename = "lastVersionId")]
    version_id: String,
    #[serde(rename = "totalPlayTime")]
    total_play_time: u32,
    #[serde(rename = "javaArgs")]
    java_args: Option<String>,
    #[serde(rename = "gameDir")]
    game_dir: String
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LauncherProfiles {
    profiles: HashMap<String, Profile>,
}

pub fn load_profiles() -> LauncherProfiles {
    let profiles_path = get_launcher_path().join("launcher_profiles.json");

    let mut profiles: LauncherProfiles = LauncherProfiles {
        profiles: HashMap::new()
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