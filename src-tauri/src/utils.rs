use std::{fs::{File, self}, path::PathBuf, process::Command};

#[tauri::command]
pub fn get_launcher_path() -> PathBuf {
    dirs::data_dir().unwrap().join(".minicraft_launcher")
}

pub fn get_cache_path() -> PathBuf {
    get_launcher_path().join("cache")
}

pub fn get_versions_path() -> PathBuf {
    get_launcher_path().join("versions")
}

pub fn get_saves_path() -> PathBuf {
    get_launcher_path().join("saves")
}

pub fn get_libraries_path() -> PathBuf {
    get_launcher_path().join("libraries")
}

pub fn create_launcher_dirs() {
    if !get_launcher_path().exists() {
        fs::create_dir(get_launcher_path()).expect("Could not create launcher directory");
    }
    
    if !get_versions_path().exists() {
        fs::create_dir(get_versions_path()).expect("Could not create versions directory");
    }

    if !get_saves_path().exists() {
        fs::create_dir(get_saves_path()).expect("Could not create saves directory");
    }

    if !get_libraries_path().exists() {
        fs::create_dir(get_libraries_path()).expect("Could not create libraries directory");
    }
}

#[tauri::command]
pub fn open_folder_from_launcher(id: &str) {
    let path = get_launcher_path().join(id);
    
    if fs::metadata(&path).is_ok() {
        open_folder(path)
    }
}

#[tauri::command]
pub async fn get_launcher_patch_notes() -> serde_json::Value {
    let pn_path = get_cache_path().join("launcherPatchNotes");
    let request_url = "https://github.com/KalmeMarq/minicraft-launcher-content/raw/main/patchnotes/launcherPatchNotes.json";
    get_json_cached_file(pn_path, &request_url, 60).await
}

#[tauri::command]
pub async fn get_minicraft_plus_patch_notes() -> serde_json::Value {
    let pn_path = get_cache_path().join("minicraftPlusPatchNotes");
    let request_url = "https://github.com/KalmeMarq/minicraft-launcher-content/raw/main/patchnotes/minicraftPlusPatchNotes.json";

    get_json_cached_file(pn_path, &request_url, 60).await
}

#[tauri::command]
pub async fn get_minicraft_patch_notes() -> serde_json::Value {
    let pn_path = get_cache_path().join("minicraftPatchNotes");
    let request_url = "https://github.com/KalmeMarq/minicraft-launcher-content/raw/main/patchnotes/minicraftPatchNotes.json";
    get_json_cached_file(pn_path, &request_url, 60).await
}

#[tauri::command]
pub async fn get_faq() -> serde_json::Value {
    let pn_path = get_cache_path().join("faq");
    let request_url = "https://github.com/KalmeMarq/minicraft-launcher-content/raw/main/faq.json";
    get_json_cached_file(pn_path, &request_url, 60).await
}

#[tauri::command]
pub async fn get_alert_messaging() -> serde_json::Value {
    let pn_path = get_cache_path().join("alertMessaging");
    let request_url = "https://github.com/KalmeMarq/minicraft-launcher-content/raw/main/alertMessaging.json";
    get_json_cached_file(pn_path, &request_url, 60).await
}

#[tauri::command]
pub async fn get_news() -> serde_json::Value {
    let pn_path = get_cache_path().join("news");
    let request_url = "https://github.com/KalmeMarq/minicraft-launcher-content/raw/main/news.json";
    get_json_cached_file(pn_path, &request_url, 60).await
}

pub async fn get_json_cached_file(file_path: PathBuf, request_url: &str, minutes_to_wait: u64) -> serde_json::Value {
    if file_path.exists() {
        let metadata = std::fs::metadata(&file_path)
            .expect("Could not read metadata for version manifest file");

        let dur = metadata.modified().unwrap().elapsed().unwrap();

        if dur.as_secs() / 60 > minutes_to_wait {
            let json: serde_json::Value = reqwest::get(request_url.to_string())
                .await
                .expect("Could not get file from url")
                .json()
                .await
                .expect("Could not jsonify file");
            serde_json::to_writer_pretty(
                &File::create(&file_path).expect("Could not cache file"),
                &json,
            )
            .expect("Could not save version file");
            json
        } else {
            let data = fs::read_to_string(&file_path).expect("Could not read cached file");
            let json: serde_json::Value =
                serde_json::from_str(&data).expect("Could not jsonify file");
            json
        }
    } else {
        let json: serde_json::Value = reqwest::get(request_url.to_string())
            .await
            .expect("Could not get file from url")
            .json()
            .await
            .expect("Could not jsonify file");
        serde_json::to_writer_pretty(
            &File::create(&file_path).expect("Could not cache file"),
            &json,
        )
        .expect("Could not save version file");
        json
    }
}

pub fn open_folder(path: PathBuf) {
    #[cfg(target_os = "windows")]
    Command::new("explorer").arg("/select,".to_owned() + path.to_str().unwrap()).spawn().unwrap();

    #[cfg(target_os = "macos")]
    Command::new("open").args(["-R", &path.to_str().unwrap()]).spawn().unwrap();

    #[cfg(target_os = "linux")]
    Command::new("xdg-open").arg(&path.to_str().unwrap()).spawn().unwrap(); 
}