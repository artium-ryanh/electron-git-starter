import { app, BrowserWindow } from 'electron';
import path from 'path';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;
    
    private static onWindowAllClosed() {
        // if (process.platform !== 'darwin') {
            Main.application.quit();
        // }
    }

    private static onClose() {
        Main.mainWindow = null;
    }

    private static createWindow(): BrowserWindow {
        return new Main.BrowserWindow({ 
            width: 800, 
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        });
    }

    private static setMainWindow() {
        Main.mainWindow = Main.createWindow();
        Main.mainWindow.loadFile('index.html');
        Main.mainWindow.on('closed', Main.onClose);
    }

    private static onActivate() {
        if (BrowserWindow.getAllWindows().length === 0) Main.setMainWindow()
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.setMainWindow);
        Main.application.on('activate', Main.onActivate);
    }
}

Main.main(app, BrowserWindow);