import {settings} from "../settings.js";

$(initPage);

async function initPage() {
    const butonIconURLText = $("#button-icon-url");
    const buttonIconURL = settings.buttonIconURL();
    butonIconURLText.val(buttonIconURL);
    butonIconURLText.on("input", changeIcon);

    const links = settings.links();

    if (links)
        for (const link of links)
            addLink(link);
    else
        addLink({enabled: true});

    const linksTable = $("#links");

    linksTable.on("click", ".link-add", e => {
        addLink({enabled: true}, $(e.target).closest("tr.link"));
    });

    linksTable.on("click", ".link-remove", e => {
        removeLink($(e.target).closest("tr.link"));
    });

    linksTable.on("click", ".link-move-up", e => {
        moveUpLink($(e.target).closest("tr.link"));
    });

    linksTable.on("click", ".link-move-down", e => {
        moveDownLink($(e.target).closest("tr.link"));
    });
}

function changeIcon() {
    const action = _MANIFEST_V3? browser.action: browser.browserAction;
    const buttonIconURL = $("#button-icon-url").val();

    if (buttonIconURL)
        action.setIcon({path: {16: buttonIconURL, 24: buttonIconURL}});
    else
        action.setIcon({path: "/ui/icons/logo.svg"});

    settings.buttonIconURL(buttonIconURL);
}

function addLink(options, sibling) {
    const linkTable = $("#links");

    let linkTemplate = $("#link-row-template").prop("content");
    const linkTR = $("tr.link", linkTemplate).clone();

    if (sibling)
        sibling.after(linkTR);
    else
        linkTR.appendTo(linkTable);

    $(".enable-check", linkTR).prop("checked", options.enabled)
    $(".title-text", linkTR).val(options.title || "");
    $(".url-text", linkTR).val(options.url || "");
    $(".threshold-text", linkTR).val(options.threshold || "");

    $(".enable-check", linkTR).on("change", saveOptions);
    $(".title-text", linkTR).on("blur", saveOptions);
    $(".url-text", linkTR).on("blur", saveOptions);
    $(".threshold-text", linkTR).on("blur", saveOptions);
}

function removeLink(object) {
    const title = $(".title-text", object).val();
    if (confirm(`Do you really want to remove "${title}"`)) {
        object.remove();
        saveOptions();
    }
}

function getLinkOptions(i, linkTR) {
    linkTR = $(linkTR);

    const link = {
        enabled: $(".enable-check", linkTR).is(":checked"),
        title: $(".title-text", linkTR).val(),
        url: $(".url-text", linkTR).val(),
        threshold: $(".threshold-text", linkTR).val()
    };

    if (link.title && link.url)
        return link;
}

function moveUpLink(object) {
    const prev = object.prev();
    
    if (prev.length) {
        exchangeLinks(object, prev);
        saveOptions();
    }
}

function moveDownLink(object) {
    const next = object.next();

    if (next.length) {
        exchangeLinks(object, next);
        saveOptions();
    }
}

function exchangeLinks(object, other) {
    const [checked, title, url, threshold] = [
        $(".enable-check", object).is(":checked"),
        $(".title-text", object).val(),
        $(".url-text", object).val(),
        $(".threshold-text", object).val()
    ];

    const [otherChecked, otherTitle, otherUrl, otherThreshold] = [
        $(".enable-check", other).is(":checked"),
        $(".title-text", other).val(),
        $(".url-text", other).val(),
        $(".threshold-text", other).val()
    ];

    $(".enable-check", object).prop("checked", otherChecked);
    $(".title-text", object).val(otherTitle);
    $(".url-text", object).val(otherUrl);
    $(".threshold-text", object).val(otherThreshold);

    $(".enable-check", other).prop("checked", checked);
    $(".title-text", other).val(title);
    $(".url-text", other).val(url);
    $(".threshold-text", other).val(threshold);
}

async function saveOptions() {
    await settings.load();

    await settings.buttonIconURL($("#button-icon-url").val());

    let links = $("tr.link").map(getLinkOptions);
    links = Array.from(links).filter(l => !!l);
    await settings.links(links);
}