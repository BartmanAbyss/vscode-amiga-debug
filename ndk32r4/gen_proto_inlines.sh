cd ~/AMIGA_GCC

# Create the directory structure
mkdir -p NDK_3.2_elf/sys-include/inline
mkdir -p NDK_3.2_elf/sys-include/proto
mkdir -p NDK_3.2_elf/sys-include/clib

# Copy Bartman's macros.h and stubs.h (copy from your Windows machine or extract from vsix)
# For now copy the versions you uploaded earlier if you saved them, or we'll come back to this

# Generate all inline headers from NDK 3.2R4 SFD files
for sfd in NDK_3.2/SFD/*_lib.sfd; do
    base=$(basename $sfd _lib.sfd)
    echo "Generating inline/$base.h ..."
    ./sfdc/sfdc --target=m68k-amigaos --mode=macros \
                --output=NDK_3.2_elf/sys-include/inline/${base}.h \
                $sfd
done

# Generate all proto headers
for sfd in NDK_3.2/SFD/*_lib.sfd; do
    base=$(basename $sfd _lib.sfd)
    echo "Generating proto/$base.h ..."
    ./sfdc/sfdc --target=m68k-amigaos --mode=proto \
                --output=NDK_3.2_elf/sys-include/proto/${base}.h \
                $sfd
done

# Generate all clib headers
for sfd in NDK_3.2/SFD/*_lib.sfd; do
    base=$(basename $sfd _lib.sfd)
    echo "Generating clib/${base}_protos.h ..."
    ./sfdc/sfdc --target=m68k-amigaos --mode=clib \
                --output=NDK_3.2_elf/sys-include/clib/${base}_protos.h \
                $sfd
done

echo "Done! Checking output..."
ls NDK_3.2_elf/sys-include/inline/ | head -20
ls NDK_3.2_elf/sys-include/proto/ | head -20
