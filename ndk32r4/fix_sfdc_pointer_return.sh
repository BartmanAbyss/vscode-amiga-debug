#!/bin/bash
# fix_sfdc_pointer_return.sh
#
# Fixes sfdc-generated inline headers where pointer return type '*' is
# incorrectly attached to the function name inside LP macros:
#
#   WRONG: LP2(0x228, struct Library, *OpenLibrary , ...)
#   RIGHT: LP2(0x228, struct Library *, OpenLibrary , ...)

for f in ~/AMIGA_GCC/NDK_3.2_elf/sys-include/inline/*.h; do
    sed -i 's/\(LP[0-9A-Z]*(0x[0-9a-f]*, [^,]*\), \*\([A-Za-z_][A-Za-z0-9_]* \)/\1 *, \2/g' "$f"
done

echo "Fixed. Checking exec.h for OpenLibrary..."
grep "OpenLibrary" ~/AMIGA_GCC/NDK_3.2_elf/sys-include/inline/exec.h
