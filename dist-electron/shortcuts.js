"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortcutsHelper = void 0;
const electron_1 = require("electron");
class ShortcutsHelper {
    constructor(deps) {
        this.deps = deps;
    }
    registerGlobalShortcuts() {
        electron_1.globalShortcut.register("CommandOrControl+H", async () => {
            const mainWindow = this.deps.getMainWindow();
            if (mainWindow) {
                console.log("Taking screenshot...");
                try {
                    const screenshotPath = await this.deps.takeScreenshot();
                    const preview = await this.deps.getImagePreview(screenshotPath);
                    mainWindow.webContents.send("screenshot-taken", {
                        path: screenshotPath,
                        preview
                    });
                }
                catch (error) {
                    console.error("Error capturing screenshot:", error);
                }
            }
        });
        electron_1.globalShortcut.register("CommandOrControl+Enter", async () => {
            await this.deps.processingHelper?.processScreenshots();
        });
        electron_1.globalShortcut.register("CommandOrControl+R", () => {
            console.log("Command + R pressed. Canceling requests and resetting queues...");
            // Cancel ongoing API requests
            this.deps.processingHelper?.cancelOngoingRequests();
            // Clear both screenshot queues
            this.deps.clearQueues();
            console.log("Cleared queues.");
            // Update the view state to 'queue'
            this.deps.setView("queue");
            // Notify renderer process to switch view to 'queue'
            const mainWindow = this.deps.getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send("reset-view");
                mainWindow.webContents.send("reset");
            }
        });
        // New shortcuts for moving the window
        electron_1.globalShortcut.register("CommandOrControl+Left", () => {
            console.log("Command/Ctrl + Left pressed. Moving window left.");
            this.deps.moveWindowLeft();
        });
        electron_1.globalShortcut.register("CommandOrControl+Right", () => {
            console.log("Command/Ctrl + Right pressed. Moving window right.");
            this.deps.moveWindowRight();
        });
        electron_1.globalShortcut.register("CommandOrControl+Down", () => {
            console.log("Command/Ctrl + down pressed. Moving window down.");
            this.deps.moveWindowDown();
        });
        electron_1.globalShortcut.register("CommandOrControl+Up", () => {
            console.log("Command/Ctrl + Up pressed. Moving window Up.");
            this.deps.moveWindowUp();
        });
        electron_1.globalShortcut.register("CommandOrControl+B", () => {
            this.deps.toggleMainWindow();
        });
        // Unregister shortcuts when quitting
        electron_1.app.on("will-quit", () => {
            electron_1.globalShortcut.unregisterAll();
        });
    }
}
exports.ShortcutsHelper = ShortcutsHelper;
