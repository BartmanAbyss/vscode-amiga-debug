@echo lea (0,a6,d0.w),a0 | ..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-as.exe --register-prefix-optional -o disasm.o - 
@rem ..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe -b binary -m m68k -D disasm.bin
..\..\..\..\bin\win32\opt\bin\m68k-amiga-elf-objdump.exe -D disasm.o
@del disasm.o
	