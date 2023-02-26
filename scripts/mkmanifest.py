import sys

ADDON_NAME = "MultiButton"

template = sys.argv[1]
output = sys.argv[2]
version = sys.argv[3]
replica = sys.argv[4] or ""

public = False
if len(sys.argv) > 5 and sys.argv[5] == "--public":
    public = True

with open(template, "r") as manifest_in:
    manifest_text = manifest_in.read()
    manifest_text = manifest_text.replace("$VERSION$", version)

    if replica:
        replica_suffix = "-" + replica
        name = ADDON_NAME + " " + replica.upper()
    else:
        replica_suffix = ""
        name = ADDON_NAME

    manifest_text = manifest_text.replace("$ADDON_NAME$", name)
    manifest_text = manifest_text.replace("$REPLICA$", replica_suffix)

    id_suffix = "-we" if public else ""
    manifest_text = manifest_text.replace("$ID_SUFFIX$", id_suffix)

    with open(output, "w") as manifest_out:
        manifest_out.write(manifest_text)
