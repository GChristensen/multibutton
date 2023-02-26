export function merge(to, from) {
    for (const [k, v] of Object.entries(from)) {
        if (!to.hasOwnProperty(k))
            to[k] = v;
    }
    return to;
}

export function setActionIcon(icon) {
    const action = _MANIFEST_V3? browser.action: browser.browserAction;

    if (icon)
        action.setIcon({path: icon});
    else
        action.setIcon({path: "/ui/icons/logo.svg"});
}

export function setActionTitle(title) {
    const action = _MANIFEST_V3? browser.action: browser.browserAction;

    if (title)
        action.setTitle({title});
    else
        action.setTitle({title: _ADDON_NAME});

}