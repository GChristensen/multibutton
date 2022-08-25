test:
	cd addon; start web-ext run -p "${HOME}/../firefox/debug" --keep-profile-changes

test-nightly:
	cd addon; start web-ext run -p "$(HOME)/../firefox/debug.nightly" --firefox=nightly --keep-profile-changes

.PHONY: sign
sign:
	cd addon; web-ext sign -a ../build -i web-ext-artifacts `cat $(HOME)/.amo/creds`

.PHONY: build
build:
	cd addon; web-ext build -a ../build -i web-ext-artifacts .web-extension-id

#chrome:
#	cd addon; rm -f AddTorrent.zip
#	cd addon; 7za a AddTorrent.zip res/* *.html *.js manifest.json
