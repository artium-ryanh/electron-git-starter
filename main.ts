import { app, BrowserWindow } from 'electron';
import path from 'path';
import simpleGit, { SimpleGit, SimpleGitOptions, StatusResult } from 'simple-git';
import { activateListeners } from './main-process/listeners';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;
    static Git: SimpleGit;
    
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
            width: 1440, 
            height: 810,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                // The following lines are unsafe, but I couldn't load the renderer in index.html without them.
                // https://github.com/electron/electron-quick-start/issues/463
                nodeIntegration: true,
                contextIsolation: false
            }
        });
    }

    private static setMainWindow() {
        Main.mainWindow = Main.createWindow();
        Main.mainWindow.loadFile('index.html');
        
        // uncomment to open the console. Shows renderer console logs
        // Main.mainWindow.webContents.openDevTools({
        //     mode: 'detach',
        //     activate: true
        // });

        const gitOptions: Partial<SimpleGitOptions> = {
            baseDir: `${Main.application.getPath("home")}${path.sep}development${path.sep}my-electron-app`,
            binary: "git",
        }
        Main.Git = simpleGit(gitOptions);

        activateListeners();
        
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