# _amiga-debug_ Visual Studio Code Extension (Windows only) (Architect fork)

This document is a companion of the original vscode-amiga-debug [README.md](README.md) file that gives additional information regarding this fork.


## Additional features

* Paths to the Kickstart ROMs can be configured from the VSCode settings.
* Program name can be configured from the VSCode settings.
* VASM assembler with debugging support:
    * GAS keeps the `.s` extension; VASM uses the `.asm` extension.
    * VASM has been modified to provide valid DWARF section names to make the extension debugger to work.
    * The assembly launchage provider has been updated to validate assembly sources against either GAS or VASM depending on the source code file extensions.
    * VASM official site: http://sun.hasenbraten.de/vasm/.
    * Modified VASM: https://github.com/davidcanadas/vasm-m68k-mot-win32. Version 1.9.
* exe2adf support:
    * Just right-click on the EXE file then select `Amiga: Shrinkle File`. Version 0.3e.
* New commands `Amiga: Open...` to open the following resources in Visual Studio Code:
    * Deadliner's "The Amiga Gradient Master" tool to assist you creating amazing color gradients for your Copperlists.
    * Deadliner's "Image Tool" to help you importing and converting between different image formats well suited for the Amiga hardware.
    * Deadliner's "Color Reducer" tool to reduce the number of colors used by your images using different algorithms.
    * Deadliner's brand new "BLTCON Cheat Sheet" tool to help you designing Blitter operations.
    * The Amiga Hardware Reference Manual (HRM) hosted by Elowar.

## Additional credits

- Code by [merry/Architect](https://github.com/davidcanadas).
- Architect logo by [Ozan/TEK](https://www.pouet.net/user.php?who=99100).

VASM is Copyright (C) 2002-2022 by Volker Barthelmann.
exe2adf is Copyright (C) 2015-2022 Bonefish/Reality.
