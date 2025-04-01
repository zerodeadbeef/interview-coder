"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAutoUpdater = initAutoUpdater;
const electron_updater_1 = require("electron-updater");
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
function initAutoUpdater() {
    console.log("Initializing auto-updater...");
    // Skip update checks in development
    if (!electron_1.app.isPackaged) {
        console.log("Skipping auto-updater in development mode");
        return;
    }
    if (!process.env.GH_TOKEN) {
        console.error("GH_TOKEN environment variable is not set");
        return;
    }
    // Configure auto updater
    electron_updater_1.autoUpdater.autoDownload = true;
    electron_updater_1.autoUpdater.autoInstallOnAppQuit = true;
    electron_updater_1.autoUpdater.allowDowngrade = true;
    electron_updater_1.autoUpdater.allowPrerelease = true;
    // Enable more verbose logging
    electron_updater_1.autoUpdater.logger = electron_log_1.default;
    electron_log_1.default.transports.file.level = "debug";
    console.log("Auto-updater logger configured with level:", electron_log_1.default.transports.file.level);
    // Log all update events
    electron_updater_1.autoUpdater.on("checking-for-update", () => {
        console.log("Checking for updates...");
    });
    electron_updater_1.autoUpdater.on("update-available", (info) => {
        console.log("Update available:", info);
        // Notify renderer process about available update
        electron_1.BrowserWindow.getAllWindows().forEach((window) => {
            console.log("Sending update-available to window");
            window.webContents.send("update-available", info);
        });
    });
    electron_updater_1.autoUpdater.on("update-not-available", (info) => {
        console.log("Update not available:", info);
    });
    electron_updater_1.autoUpdater.on("download-progress", (progressObj) => {
        console.log("Download progress:", progressObj);
    });
    electron_updater_1.autoUpdater.on("update-downloaded", (info) => {
        console.log("Update downloaded:", info);
        // Notify renderer process that update is ready to install
        electron_1.BrowserWindow.getAllWindows().forEach((window) => {
            console.log("Sending update-downloaded to window");
            window.webContents.send("update-downloaded", info);
        });
    });
    electron_updater_1.autoUpdater.on("error", (err) => {
        console.error("Auto updater error:", err);
    });
    // Check for updates immediately
    console.log("Checking for updates...");
    electron_updater_1.autoUpdater
        .checkForUpdates()
        .then((result) => {
        console.log("Update check result:", result);
    })
        .catch((err) => {
        console.error("Error checking for updates:", err);
    });
    // Set up update checking interval (every 1 hour)
    setInterval(() => {
        console.log("Checking for updates (interval)...");
        electron_updater_1.autoUpdater
            .checkForUpdates()
            .then((result) => {
            console.log("Update check result (interval):", result);
        })
            .catch((err) => {
            console.error("Error checking for updates (interval):", err);
        });
    }, 60 * 60 * 1000);
    // Handle IPC messages from renderer
    electron_1.ipcMain.handle("start-update", async () => {
        console.log("Start update requested");
        try {
            await electron_updater_1.autoUpdater.downloadUpdate();
            console.log("Update download completed");
            return { success: true };
        }
        catch (error) {
            console.error("Failed to start update:", error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle("install-update", () => {
        console.log("Install update requested");
        electron_updater_1.autoUpdater.quitAndInstall();
    });
}
