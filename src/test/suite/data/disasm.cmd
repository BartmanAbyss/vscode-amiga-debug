@echo divul.l d0,d1,d2 | ..\..\..\..\bin\opt\bin\m68k-amiga-elf-as.exe --register-prefix-optional -o disasm.o - 
@rem ..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe -b binary -m m68k -D disasm.bin
..\..\..\..\bin\opt\bin\m68k-amiga-elf-objdump.exe -D disasm.o
@del disasm.o
