const action = _MANIFEST_V3? browser.action: browser.browserAction;

action.onClicked.addListener(actionOnClick);

function actionOnClick() {

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