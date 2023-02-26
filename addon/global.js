window._MANIFEST = browser.runtime.getManifest()

window._MANIFEST_VERSION = window._MANIFEST.manifest_version;

window._MANIFEST_V3 = window._MANIFEST_VERSION === 3;

window._ADDON_NAME = window._MANIFEST.name;

window._log = console.log.bind(console);