import { ipcMain } from "electron";
import { IpcMainEvent } from "electron/main";
import { StatusResult } from "simple-git";
import Main from "../main";

export function activateListeners() {
    ipcMain.on('git-status', (event: IpcMainEvent, args: any[]) => {
        Main.Git.status().then((status: StatusResult) => {
            event.reply('git-status', status);
        })
    });
}