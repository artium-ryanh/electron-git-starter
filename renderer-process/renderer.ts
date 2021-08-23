import { ipcRenderer } from "electron";
import { IpcRendererEvent } from "electron/main";
import { StatusResult } from "simple-git";

document.getElementById('status-button').addEventListener('click', () => {
    console.log("Getting status");
    document.getElementById('status').innerText = "Loading...";
    ipcRenderer.send('git-status');
});

ipcRenderer.on('git-status', (event: IpcRendererEvent, status: StatusResult) => {
    console.log('Received Status from Main:', JSON.stringify(status));
    document.getElementById('status').innerText = "";

    // For each label, check if there are files that fit, add them to the list, and unhide.
    ['modified', 'not_added', 'conflicted', 'created', 'deleted', 'staged'].forEach(listName => {
        showLabelAndConstructList(listName, status);
    });
});

function showLabelAndConstructList(listName: string, gitStatus: StatusResult) {
    const label: HTMLLIElement = document.getElementById(`${listName}-label`) as HTMLLIElement;
    label.setAttribute("hidden", "");
    if (gitStatus[listName].length > 0) label.removeAttribute("hidden");
    const list: HTMLUListElement = document.getElementById(`${listName}`) as HTMLUListElement;
    while(list.firstChild) list.removeChild(list.firstChild);
    gitStatus[listName].forEach(addListItemTo(list));
}

function addListItemTo(list) {
    return (filePath: string) => {
        const listItem = document.createElement("li");
        listItem.innerText = filePath;
        list.appendChild(listItem);
    };
}