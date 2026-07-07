cd ~/AMIGA_GCC

# Fix all inline headers - move the * from macro name into the LP macro's return type
for f in NDK_3.2_elf/sys-include/inline/*.h; do
    # Replace "#define *FuncName(" with "#define FuncName("
    # The * belongs in the return type inside the LP macro, not the macro name
    sed -i 's/#define \*\([A-Za-z_][A-Za-z0-9_]*\)(/#define \1(/g' "$f"
done

echo "Fixed. Checking exec.h for remaining issues..."
grep "define \*" NDK_3.2_elf/sys-include/inline/exec.h | head -5
grep "OpenLibrary" NDK_3.2_elf/sys-include/inline/exec.h | head -3
