import {settings} from "./settings.js";

const action = _MANIFEST_V3? browser.action: browser.browserAction;

const buttonIconURL = settings.buttonIconURL();
if (buttonIconURL)
    action.setIcon({path: {16: buttonIconURL, 24: buttonIconURL}});

action.onClicked.addListener(actionOnClick);

async function actionOnClick() {
    await settings.load();

    const links = settings.links();

    if (links)
        for (const link of links)
            if (link.enabled)
                browser.tabs.create({url: link.url, active: false});
}

const contextMenus = {};

function createContextMenuItem(title, handler) {
    const id = `menu-${title}`;

    browser.contextMenus.create({id, title, contexts: ["browser_action"]});

    contextMenus[id] = handler;
}

browser.contextMenus.onClicked.addListener((info, tab) => {
    const handler = contextMenus[info.menuItemId];

    handler && handler(info);
})

createContextMenuItem("Settings", () => {
    browser.tabs.create({url: "ui/options.html", active: true});
});