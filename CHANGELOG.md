# Change Log

All notable changes to the "amiga-debug" extension will be documented in this file.

## 1.1.0
- added custom version of Shrinkler executable cruncher by Blueberry that generates `.shrinklerstats` files that can be opened with VS Code for size profiling
- added blitter timeline to profiler
- graphics debugger in profiler (copper, blitter, bitmaps). Use debug_register_* functions from `gcc8_c_support.h` to tell the graphics debugger about your bitmaps, palettes and copperlists for a better experience
- several DMA request were not displayed in the timeline (bitplanes > 1, sprites > 1, refresh > 1)

## 1.0.0
- added function-level + DMA profiling: during a debugging session, press the `Profile` button on the right of the debug toolbar, and 1 frame will be profiled.
- added ELF file size profiling: right-click an ELF file in the explorer, and select `Amiga: Profile File Size`
- added WinUAE debug overlays. See template project for debug_* function calls for an example
- updated to latest 64-bit WinUAE
- added command `Amiga: Open Terminal`
- fixed disassembly
- improved `INCBIN` macro to correctly report binary size to the size profiler.
- added `INCBIN_CHIP` macro to put binaries directly into chip mem.
- better demo project, shows copper, bitplanes
- support for different Amiga models (A500, A1200, A4000) in `.vscode/launch.json`
- now available in the Visual Studio Code Marketplace

## 0.9.0
- updated to GCC 10.1, binutils 2.34 and GDB 9.1
- elf2hunk now built with Microsoft Visual C++ 2019

## 0.8.1
- fix prototypes in string.h

## 0.8.0
- support C++ (template project updated, just rename main.c to main.cpp)

## 0.7.2
- `INCBIN` macro was broken. Fixed now and added example code to "new project" template.

## 0.7.1
- "Init Amiga Project" now checks if project folder is empty

## 0.7.0
- added command amiga.initProject
- better README
- added template project

## 0.6.0
- instead of passing arguments to WinUAE, they are now written to the default config (default.uae).
You can now change settings in WinUAE and save over default.uae and changes will persist.
- removed WinUAE notification icon

## 0.5.0
- revert back to old way of ending gdb/WinUAE

## 0.4.0
- don't activate Visual Studio Code on break-on-entry
- show Explorer after debugging is finished
- hide GDB output
- support faster debug output via uaelib trap #87

## 0.3.0
- added keyboard mapping <kbd>^</kbd> = single step, <kbd>Page-up</kbd> = warp mode
