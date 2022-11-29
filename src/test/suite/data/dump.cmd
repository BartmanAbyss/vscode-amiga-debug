..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --syms test.elf >test.syms
..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --dwarf=frames-interp test.elf >test.frames
..\..\..\..\bin\win32\opt\m68k-amiga-elf\bin\readelf.exe --debug=frames test.elf >test.frames2
..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --section-headers test.elf >test.sections

..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --syms --demangle test2.elf >test2.syms
..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --dwarf=frames-interp test2.elf >test2.frames
..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --section-headers test2.elf >test2.sections

..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --syms test3.elf >test3.syms
..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --dwarf=frames-interp test3.elf >test3.frames
..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --section-headers test3.elf >test3.sections
..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe --reloc --section=.text test3.elf >test3.relocs

