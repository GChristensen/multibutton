import {settings} from "../settings.js";

const SETTINGS_URL = "ui/options.html";

const CTX_MENU_TARGET = _MANIFEST_V3? "action": "browser_action";

class ContextMenu {
    constructor() {
    }

    async create() {
        await settings.load();

        this.#clear();

        const links = settings.links();

        if (links?.length) {
            for (const link of links)
                this.#createContextMenuItem(link.title, link.url);

            this.#createSeparator();
        }

        this.#createContextMenuItem("Settings", SETTINGS_URL);
    }

    #createContextMenuItem(title, url) {
        browser.contextMenus.create({id: url, title, contexts: [CTX_MENU_TARGET]});
    }

    #createSeparator() {
        browser.contextMenus.create({id: "separator", type: "separator", contexts: [CTX_MENU_TARGET]});
    }

    #removeContextMenuItem(id) {
        browser.contextMenus.remove(id);
    }

    #clear() {
        browser.contextMenus.removeAll();
    }
}

export const contextMenu = new ContextMenu();

