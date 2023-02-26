PYTHON := $(if $(filter $(OS),Windows_NT),python,python3)

test:
	cd addon; start web-ext run -p "$(FIREFOX_PROFILES)/debug" --keep-profile-changes

test-nightly:
	cd addon; start web-ext run -p "$(FIREFOX_PROFILES)/debug.nightly" --firefox=nightly --keep-profile-changes

.PHONY: sign
sign:
	cd addon; web-ext sign -a ../build -i web-ext-artifacts `cat $(HOME)/.amo/creds`

.PHONY: build
build:
	cd addon; web-ext build -a ../build -i web-ext-artifacts .web-extension-id

#chrome:
#	cd addon; rm -f AddTorrent.zip
#	cd addon; 7za a AddTorrent.zip res/* *.html *.js manifest.json

.PHONY: set-version
set-version:
	echo $(filter-out $@,$(MAKECMDGOALS)) > ./addon/version.txt

.PHONY: get-version
get-version:
	@cat ./addon/version.txt

.PHONY: firefox-mv2
firefox-mv2:
	cd addon; $(PYTHON) ../scripts/mkmanifest.py manifest.json.mv2 manifest.json `cat version.txt` ""

.PHONY: firefox-mv3
firefox-mv3:
	cd addon; $(PYTHON) ../scripts/mkmanifest.py manifest.json.mv3 manifest.json `cat version.txt` ""

.PHONY: firefox-mv3-ii
firefox-mv3-ii:
	cd addon; $(PYTHON) ../scripts/mkmanifest.py manifest.json.mv3 manifest.json `cat version.txt` "ii"

%:
	@: