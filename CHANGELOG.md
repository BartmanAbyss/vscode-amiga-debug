# Change Log

All notable changes to the "amiga-debug" extension will be documented in this file.

## 1.0.0
- added function-level + DMA profiling: during a debugging session, press the "Profile" button on the right of the debug toolbar, and 1 frame will be profiled.
- added WinUAE debug overlays. See template project for debug_* function calls for an example
- updated to latest 64-bit WinUAE
- added command `Amiga: Open Terminal`

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
