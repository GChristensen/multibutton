import {merge} from "./utils.js";

const SETTINGS_KEY = "multibutton-settings";

class Settings {
    constructor() {
        this._default = {
        };

        this._bin = {};
        this._key = SETTINGS_KEY;
    }

    async _load() {
        const object = await browser.storage.local.get(this._key);
        this._bin = merge(object?.[this._key] || {}, this._default);
    }

    async _save() {
        return browser.storage.local.set({[this._key]: this._bin});
    }

    get(target, key, receiver) {
        if (key === "load")
            return v => this._load(); // sic!
        else if (key === "default")
            return this._default;

        return val => {
            let bin = this._bin;

            if (val === undefined)
                return bin[key];

            let deleted;
            if (val === null) {
                deleted = bin[key];
                delete bin[key]
            }
            else
                bin[key] = val;

            let result = key in bin? bin[key]: deleted;
            return this._save().then(() => result);
        }
    }

    has(target, key) {
        return key in this._bin;
    }

    * enumerate() {
        for (let key in this._bin) yield key;
    }
}

export let settings = new Proxy({}, new Settings());

await settings.load();