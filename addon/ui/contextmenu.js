import {settings} from "../settings.js";

const SETTINGS_URL = "ui/options.html";

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
        browser.contextMenus.create({id: url, title, contexts: ["browser_action"]});
    }

    #createSeparator() {
        browser.contextMenus.create({id: "separator", type: "separator", contexts: ["browser_action"]});
    }

    #removeContextMenuItem(id) {
        browser.contextMenus.remove(id);
    }

    #clear() {
        browser.contextMenus.removeAll();
    }
}

export const contextMenu = new ContextMenu();

