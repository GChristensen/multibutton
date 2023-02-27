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

export function showNotification(args) {
    if (typeof arguments[0] === "string")
        args = {message: arguments[0]};

    const iconUrl = _BACKGROUND_PAGE
        ? "/icons/scrapyard.svg"
        : "/icons/logo128.png";

    return browser.notifications.create(`sbi-notification-${args.type}`, {
        type: args.type ? args.type : "basic",
        title: args.title ? args.title : "Scrapyard",
        message: args.message,
        iconUrl
    });
}
