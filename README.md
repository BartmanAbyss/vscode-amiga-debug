# _amiga-debug_ Visual Studio Code Extension (Windows only)

**One-stop Visual Code Extention to compile and debug Amiga C/C++ programs compiled by the bundled gcc 10.1 in WinUAE.**

## Overview
This extension will help you to quickly develop demos, intros, games, etc. for the Amiga 500. It supports C and C++, however no standard library is available.

## Quick-start
0. [Grab the latest release](https://github.com/BartmanAbyss/vscode-amiga-debug/releases) and follow installation instructions
1. Create a new empty project folder with `File > Open Folder...`
2. From the command palette <kbd>Ctrl+Shift+P</kbd> select `Amiga: Init Project`
3. Open `.vscode/launch.json` and point `"kickstart"` to your *Kickstart 1.3* ROM
3. Hit <kbd>F5</kbd> to build and run a minimal sample project

## Features
- No additional tools required. Everything is included (except Kickstart ROM 😒). Ready to go make your next Amiga 500 production!
- State-of-the-art code generation by GCC with Link-Time-Optimizations (LTO) for increased performance and smaller code size
- IntelliSense
- Full source-level and assembly-level debugging with callstack, breakpoints, watches, registers, memory view with GDB-enabled WinUAE
- Fully AmigaOS compatible via included .h files
- `INCBIN` support
- Output to debug console from WinUAE
- WinUAE warp-launch (turbo-boot)
- WinUAE warp-mode control from your Amiga project

## How-to-use
- `Amiga: View Memory`, `Amiga: Set Force Disassembly`, `Amiga: View Disassembly (Function)` are available from the command palette <kbd>Ctrl+Shift+P</kbd>
- Use the command `Amiga: Open Terminal` to open a shell with the environment set to use the included tools like `elf2hunk`, `gcc`, `gnumake` etc. (e.g. `gnumake clean`)
- WinUAE: 
  - <kbd>^</kbd> = single step, <kbd>Pause</kbd> = pause/resume <kbd>Page-up</kbd> = warp mode
  - all necessary options are already configured for Amiga 500, Kickstart 1.3 (for debugging), if you want to change some things (resolution, window size, etc.) just go into the `Configurations` tab, select `default`, and hit `Save`

## Credits
Code by [Bartman/Abyss](https://github.com/BartmanAbyss)

## Acknowledgements
This extension is based in part on Marcel Ball's [Cortex-Debug](https://github.com/Marus/cortex-debug) extension.

Some modifications of GCC are based on work by [Stefan "Bebbo" Franke](https://github.com/bebbo).

Amiga system-includes (NDK 3.9) copied from an installation of Bebbo's [amiga-gcc](https://github.com/bebbo/amiga-gcc/blob/master/Makefile) and modified to work with GCC 8+. Originally downloaded from http://www.haage-partner.de/download/AmigaOS/NDK39.lha

This extension contains binaries of:
- modified [GCC 10.1.0](https://github.com/BartmanAbyss/gcc)
  - Copyright (C) 2020 Free Software Foundation, Inc.
  - This is free software; see the source for copying conditions.  There is NO warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
- modified [GNU Binutils 2.34.50.20200508](https://github.com/BartmanAbyss/binutils-gdb)
  - Copyright (C) 2020 Free Software Foundation, Inc.
  - License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
  - This is free software: you are free to change and redistribute it. There is NO WARRANTY, to the extent permitted by law.
- modified [GNU gdb (GDB) 10.0.50.20200508-git](https://github.com/BartmanAbyss/binutils-gdb)
  - Copyright (C) 2020 Free Software Foundation, Inc.
  - This program is free software; you may redistribute it under the terms of the GNU General Public License version 3 or (at your option) any later version.
- modified [WinUAE 4.2.0](https://github.com/BartmanAbyss/WinUAE)
- modified elf2hunk (source included)
  - Copyright (c) 1995-2017, The AROS Development Team. All rights reserved.
  - Modified 2018-2020, Bartman/Abyss
- GNU Make 4.2.1
  - Copyright (C) 1988-2016 Free Software Foundation, Inc.
  - License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
  - This is free software: you are free to change and redistribute it. There is NO WARRANTY, to the extent permitted by law.

## Caveats
- sometimes when you're multiplying 2 WORDs together, `gcc` tries to use a (slow) 32-bit multiply. So if you have performance-critical multiplications, consider using the `muluw` and `mulsw` functions from `gcc8_c_support.h`

## Porting
Currently this extension only works on Windows due to the included Windows-only binaries of gcc, gdb, elf2hunk and WinUAE.
Compilation of gcc, gdb and elf2hunk on Linux should be trivial, as gcc and gdb only contain about 10 lines of code modifications. elf2hunk should work on Linux out-of-the-box. However, porting the GDB-server contained in WinUAE to FS-UAE could be a bit more work. 99% of WinUAE changes are contained in `od-win32/barto_gdbserver.cpp|h`.

Here are the command-lines used to compile the external tools:

### MinGW on WSL (Ubuntu 18.04)
```
apt install build-essential flex bison expect dejagnu texinfo mingw-w64
```

### Binutils
```
mkdir -p build-binutils-2.34
cd build-binutils-2.34
LDFLAGS="-static -static-libgcc -static-libstdc++" ../binutils-2.34/configure --disable-multilib --disable-nls --enable-lto --prefix=/opt/amiga/10.1.0 --target=m68k-amiga-elf --host=x86_64-w64-mingw32
make -j6
sudo make install
```

### GDB
```
mkdir build-binutils-gdb
cd build-binutils-gdb
LDFLAGS="-static -static-libgcc -static-libstdc++" ../binutils-gdb/configure --prefix=/opt/amiga/10.1.0 --target=m68k-amiga-elf --disable-werror -enable-static --disable-shared --disable-interprocess-agent --disable-libcc --host=x86_64-w64-mingw32
make -j6
sudo make install
sudo strip /opt/amiga/10.1.0/bin/*.exe
sudo strip /opt/amiga/10.1.0/m68k-amiga-elf/bin/*.exe
```

### GCC
```
cd gcc
./contrib/download_prerequisites
cd ..
mkdir -p build-gcc-10.1.0
cd build-gcc-10.1.0
LDFLAGS="-static -static-libgcc -static-libstdc++" ../gcc/configure \
  --target=m68k-amiga-elf \
  --disable-nls \
  --enable-languages=c,c++ \
  --enable-lto \
  --prefix=/opt/amiga/10.1.0 \
  --disable-libssp \
  --disable-gcov \
  --disable-multilib \
  --disable-threads \
  --with-cpu=68000 \
  --disable-libsanitizer \
  --disable-libada \
  --disable-libgomp \
  --disable-libvtv \
  --disable-nls \
  --disable-clocale \
  --host=x86_64-w64-mingw32 \
  --enable-static
make all-gcc -j6
sed 's/selftest # srcextra/# selftest srcextra/' gcc/Makefile >gcc/Makefile.tmp
mv gcc/Makefile.tmp gcc/Makefile
gcc/gcc-cross.exe -dumpspecs >gcc/specs
make all-gcc -j6
sudo make install-gcc
sudo strip /opt/amiga/10.1.0/bin/*.exe
sudo strip /opt/amiga/10.1.0/m68k-amiga-elf/bin/*.exe
sudo strip /opt/amiga/10.1.0/libexec/gcc/m68k-amiga-elf/10.1.0/*.exe
```

### elf2hunk
```
LDFLAGS="-static -static-libgcc -static-libstdc++" x86_64-w64-mingw32-gcc -o elf2hunk -DDEBUG=0 elf2hunk.c -lws2_32
```

## Known Issues
* finish package.json fertigmachen. Configs, settings, ...
* store assembly breakpoints in one "virtual" file in breakpointMap (how?!)
* when stepping out of IRQ handler, stack frames are corrupt until next step
* disassemble address always creates new disassembly even if just stepping. check title of current disassembly window if current PC is in range.
* sometimes fail at start: Unable to open 'main.amigaasm': Cannot read property 'customRequest' of undefined.
* restartRequest not implemented
* vscode.debug.activeDebugSession is undefined when program is stopped on entry
* not getting handleThreadSelected(), thread ID now set in class
* sometimes Pause/Resume button doesn't correctly switch to "Pause" icon while amiga program is running
* step out of kickstart: set fake breakpoint at 0xfffffff, WinUAE should enter TRACE_RANGE_PC mode (TODO: tighten range around loaded program), but keeps breaking later
