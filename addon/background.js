import {settings} from "./settings.js";
import {setActionIcon} from "./utils.js";
import {contextMenu} from "./ui/contextmenu.js";
import {Threshold} from "./threshold.js";

const action = _MANIFEST_V3? browser.action: browser.browserAction;

const buttonIconURL = settings.buttonIconURL();
setActionIcon(buttonIconURL);

action.onClicked.addListener(actionOnClick);

async function actionOnClick() {
    await settings.load();

    const links = settings.links();

    if (links?.length) {
        for (const link of links)
            if (link.enabled) {
                if (!link.threshold || new Threshold(link.threshold).satisfies())
                    browser.tabs.create({url: link.url, active: false});
            }
    }
    else
        showOptions();
}

function showOptions() {
    browser.tabs.create({url: "ui/options.html", active: true});
}

contextMenu.create();

browser.contextMenus.onClicked.addListener(menuInfo => {
    browser.tabs.create({url: menuInfo.menuItemId, active: true});
});