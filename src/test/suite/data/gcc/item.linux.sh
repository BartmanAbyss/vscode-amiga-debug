mkdir out/linux
rm out/linux/*
~/binutils-gdb-gcc-linux/bin/m68k-amiga-elf-gcc -dumpspecs >out/linux/specs
~/binutils-gdb-gcc-linux/bin/m68k-amiga-elf-gcc -dP -dD -dA -mcpu=68000 -g -Og -Wall -Wno-strict-aliasing -Wno-pointer-sign -Wno-unused-function -Wno-volatile-register-var -Wno-switch -Werror=incompatible-pointer-types -Werror=return-type -fomit-frame-pointer -fno-tree-loop-distribution -fdata-sections -ffunction-sections -fno-exceptions -fdump-rtl-dwarf2 -fdwarf2-cfi-asm -c item.c -o out/linux/item.o -Wa,-ahl=out/linux/item.dump
~/binutils-gdb-gcc-linux/bin/m68k-amiga-elf-gcc -dP -dD -dA -mcpu=68000 -g -Og -Wall -Wno-strict-aliasing -Wno-pointer-sign -Wno-unused-function -Wno-volatile-register-var -Wno-switch -Werror=incompatible-pointer-types -Werror=return-type -fomit-frame-pointer -fno-tree-loop-distribution -fdata-sections -ffunction-sections -fno-exceptions -fdump-rtl-dwarf2 -fdwarf2-cfi-asm -c item.c -S -o out/linux/item.s
~/binutils-gdb-gcc-linux/bin/m68k-amiga-elf-objdump --dwarf=frames-interp out/linux/item.o >out/linux/item.frames.objdump
~/binutils-gdb-gcc-linux/m68k-amiga-elf/bin/readelf --debug=frames out/linux/item.o >out/linux/item.frames.readelf