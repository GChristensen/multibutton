import {settings} from "../settings.js";
import {setActionIcon} from "../utils.js";
import {contextMenu} from "./contextmenu.js";

$(initPage);

async function initPage() {
    const butonIconURLText = $("#button-icon-url");
    const buttonIconURL = settings.buttonIconURL();
    butonIconURLText.val(buttonIconURL);
    butonIconURLText.on("input", changeIcon);

    const links = settings.links();

    if (links?.length)
        for (const link of links)
            addLink(link);
    else
        addNewLink();

    const linksTable = $("#links");

    linksTable.on("click", ".link-add", e => {
        addNewLink($(e.target).closest("tr.link"));
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

    $("#no-active-tab").on("change", saveSettings);
    $("#export-settings").on("click", exportSettings);
    $("#import-settings").on("click", importSettings);
    $("#import-settings-file-picker").on("change", readSettingsFile);
}

function changeIcon() {
    const buttonIconURL = $("#button-icon-url").val();
    settings.buttonIconURL(buttonIconURL);
    setActionIcon(buttonIconURL);
}

function addLink(options, sibling) {
    const linkTable = $("#links");

    let linkTemplate = $("#link-row-template").prop("content");
    const linkTR = $("tr.link", linkTemplate).clone();

    if (sibling)
        sibling.after(linkTR);
    else
        linkTR.appendTo(linkTable);

    $(".active-tab-radio", linkTR).prop("checked", options.active)
    $(".enable-check", linkTR).prop("checked", options.enabled)
    $(".title-text", linkTR).val(options.title || "");
    $(".url-text", linkTR).val(options.url || "");
    $(".threshold-text", linkTR).val(options.threshold || "");

    $(".active-tab-radio", linkTR).on("change", saveSettings);
    $(".enable-check", linkTR).on("change", saveSettings);
    $(".title-text", linkTR).on("blur", saveSettings);
    $(".url-text", linkTR).on("blur", saveSettings);
    $(".threshold-text", linkTR).on("blur", saveSettings);
}

function addNewLink(sibling) {
    const newLink = {enabled: true};

    if (sibling)
        addLink(newLink, sibling);
    else
        addLink(newLink);
}

function removeLink(object) {
    const title = $(".title-text", object).val();
    const url = $(".url-text", object).val();
    if (!(title || url) || confirm(`Do you really want to remove ${title? `"${title}"`: "this item"}?`)) {
        object.remove();
        saveSettings();

        if (!$("tr.link").length)
            addNewLink();
    }
}

function getLinkOptions(i, linkTR) {
    linkTR = $(linkTR);

    const link = {
        active: $(".active-tab-radio", linkTR).is(":checked"),
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
        saveSettings();
    }
}

function moveDownLink(object) {
    const next = object.next();

    if (next.length) {
        exchangeLinks(object, next);
        saveSettings();
    }
}

function exchangeLinks(object, other) {
    const [activeTab, checked, title, url, threshold] = [
        $(".active-tab-radio", object).is(":checked"),
        $(".enable-check", object).is(":checked"),
        $(".title-text", object).val(),
        $(".url-text", object).val(),
        $(".threshold-text", object).val()
    ];

    const [otherActiveTab, otherChecked, otherTitle, otherUrl, otherThreshold] = [
        $(".active-tab-radio", other).is(":checked"),
        $(".enable-check", other).is(":checked"),
        $(".title-text", other).val(),
        $(".url-text", other).val(),
        $(".threshold-text", other).val()
    ];

    $(".active-tab-radio", object).prop("checked", otherActiveTab);
    $(".enable-check", object).prop("checked", otherChecked);
    $(".title-text", object).val(otherTitle);
    $(".url-text", object).val(otherUrl);
    $(".threshold-text", object).val(otherThreshold);

    $(".active-tab-radio", other).prop("checked", activeTab);
    $(".enable-check", other).prop("checked", checked);
    $(".title-text", other).val(title);
    $(".url-text", other).val(url);
    $(".threshold-text", other).val(threshold);
}

async function saveSettings() {
    await settings.load();

    await settings.buttonIconURL($("#button-icon-url").val());

    let links = $("tr.link").map(getLinkOptions);
    links = Array.from(links).filter(l => !!l);
    await settings.links(links);

    await contextMenu.create();
}

async function exportSettings(e) {
    e.preventDefault();

    let exported = {};
    exported.addon = "MultiButton";
    exported.version = browser.runtime.getManifest().version;

    exported.settings = await browser.storage.local.get() || {};

    // download link
    let file = new Blob([JSON.stringify(exported, null, 2)], {type: "application/json"});
    let url = URL.createObjectURL(file);
    let filename = "multibutton-settings.json";

    let download = await browser.downloads.download({url: url, filename: filename, saveAs: true});

    let download_listener = delta => {
        if (delta.id === download && delta.state && delta.state.current === "complete") {
            browser.downloads.onChanged.removeListener(download_listener);
            URL.revokeObjectURL(url);
        }
    };
    browser.downloads.onChanged.addListener(download_listener);
}

async function importSettings(e) {
    e.preventDefault();

    $("#import-settings-file-picker").click();
}

async function readSettingsFile(e) {
    let reader = new FileReader();
    reader.onload = async function(re) {
        let imported = JSON.parse(re.target.result);

        if (imported.addon !== "MultiButton") {
            showNotification("Export format is not supported.");
            return;
        }

        await browser.storage.local.set(imported.settings);

        chrome.runtime.reload();
    };
    reader.readAsText(e.target.files[0]);
}