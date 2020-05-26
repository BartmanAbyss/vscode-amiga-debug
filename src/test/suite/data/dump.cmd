..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --syms test.elf >test.syms
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --dwarf=frames-interp test.elf >test.frames
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --section-headers test.elf >test.sections

..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --syms test2.elf >test2.syms
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --dwarf=frames-interp test2.elf >test2.frames
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --section-headers test2.elf >test2.sections
