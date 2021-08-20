window.addEventListener('DOMContentLoaded', () => {
    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

function replaceText(selector: string, text: string) {
    const element: HTMLElement = document.getElementById(selector);
    if (element) {
        element.innerText = text;
    }
}