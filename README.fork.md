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
    * Modified VASM: https://github.com/davidcanadas/vasm-m68k-mot-win32.

## Additional credits

- Code by [merry/Architect](https://github.com/davidcanadas).
- Architect logo by [Ozan/TEK](https://www.pouet.net/user.php?who=99100).

VASM is Copyright (C) 2002-2022 by Volker Barthelmann.
