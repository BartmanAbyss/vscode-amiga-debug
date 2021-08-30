..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --syms test.elf >test.syms
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --dwarf=frames-interp test.elf >test.frames
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --section-headers test.elf >test.sections

..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --syms --demangle test2.elf >test2.syms
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --dwarf=frames-interp test2.elf >test2.frames
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --section-headers test2.elf >test2.sections

..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --syms test3.elf >test3.syms
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --dwarf=frames-interp test3.elf >test3.frames
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --section-headers test3.elf >test3.sections
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe --reloc --section=.text test3.elf >test3.relocs

