# Change Log

All notable changes to the "amiga-debug" extension will be documented in this file.
See PR links for more information.

## 1.7.6
- NEW: modified template project to include `-ffunction-sections`, `-fdata-sections`, `--gc-sections` flags and changed assembly files to use unique sections so linker can better strip unused code/data
- NEW: updated `type_traits` include

## 1.7.5
- FIX: fixed missing `obj` and `out` directories in template project
- FIX: `__attribute__((always_inline))` in `gcc8_c_support.h` for `-Ofast`

## 1.7.4
- FIX: 1.7.3 was broken for Linux/MacOS

## 1.7.3
- NEW: update gcc to 13.2.0

## 1.7.2
- NEW: update gcc to 13.1.0, binutils, GNU gdb (GDB) 14.0.50.20230511-git
- CHG: replaced MicroKnight debug font with Topaz [#227](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/227)

## 1.7.1
- FIX: 1.7.0 would not start debugging if launch.json was missing `emuargs` [#211](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/211)

## 1.7.0
- CHG: update to [latest WinUAE (41010)](https://github.com/tonioni/WinUAE/commit/239062dc7c49838b41ac54e5901522eeb78f0ef0)
- FIX: Only write m68k settings for Amiga projects [PR#208](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/208)
- NEW: Emulator config improvements [PR#209](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/209)
- NEW: profiler: get AGA colors from WinUAE
- NEW: launch.json: new configuration attribute "stack" to override the default stack size (in bytes)

## 1.6.9
- FIX: debugger: fixed crash on launch when using encrypted Kickstart [#199](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/199)
- FIX: screen: don't overwrite OCS colors with AGA colors from different banks
- NEW: screen: support AGA colors, show BPLCON3 (TODO: get AGA colors from .profile file)
- FIX: Builds using MacOS 11 for better compatibility; Includes updated binaries for GCC, binutils and FS-UAE [PR#197](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/197)

## 1.6.8
- NEW: update gcc to 12.2.0, binutils, GNU gdb (GDB) 13.0.50.20221127-git
- FIX: WinUAE/FS-UAE: don't enable "Full stack frame tracking" (caused WinUAE to crash due to stack overflow in certain situations) [PR#183](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/183)
- NEW: assembly: View memory for symbols in assembly [PR#174](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/174)
- NEW: assembly: Support other Motorola assembly language providers [PR#175](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/175)
- FIX: assembly: Cycle count was missing on last line of source [PR#176](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/176)
- NEW: assembly: Cycle decoration improvements [PR#184](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/184)
- FIX: assembly: Async parsing [PR#180](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/180)
- CHG: disassembly: New CPU cycle count implementation with improved accuracy [PR#179](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/179)
- NEW: disassembly: Tooltip improvements [PR#190](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/190)
- NEW: debugger: Disassembled memory view [PR#185](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/185)
- NEW: debugger: Add symbol offset labels to registers [PR#189](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/189)

## 1.6.7
- NEW: profiler: Toggle right panel [PR#167](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/167)
- NEW: debugger: New panel for custom registers [PR#166](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/166)
- FIX: profiler: Fix mac rendering bug [PR#169](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/169)
- FIX: profiler: Mac keyboard shortcuts [PR#170](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/170)
- NEW: vasm: memory type suffix in section names [PR#171](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/171)
- FIX: assembly: Check cycle counts are for current file [PR#173](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/173)
- NEW: profiler: Track source from profile disassembly view [PR#168](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/168)

## 1.6.6
- FIX: Make cpptools a recommendation, not dependency
- FIX: profiler: Fix section regex to handle multiple digits
- FIX: profiler: Parse frames-interp output by whitespace
- FIX: Path env var needs to be uppercase on Mac/Linux
- FIX: Update libSDL2, libSDL2_ttf dylib version
- FIX: disassembly: Source links broken for non-windows

## 1.6.5
- FIX: Vasm fixes [PR#148](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/148)
- CHG: Better stack unwinding for assembly code [PR#145](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/154)
- FIX: GDB Mac exe without libintl dylib dependency [PR#155](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/155)

## 1.6.4
- FIX: libintl issue in ARM-based Macs [#145](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/145)
- FIX: 'Profile File Size' broken since last version

## 1.6.3
- FIX: Linux, MacOS executables lost file permissions

## 1.6.2
- NEW: Linux, MacOS is now supported thanks to [Peter Mackay](https://github.com/petmac) and [Graham Bates](https://github.com/grahambates).
       Please do report any problems here: https://github.com/BartmanAbyss/vscode-amiga-debug/issues

## 1.6.1
- FIX: screen: freeze frame memory was wrong
- FIX: resource: possibly very slow performance when using `Copper Palette`

## 1.6.0
- NEW: icons for `.uss`, `.amigaprofile`, `.shrinklerstats`, `.objdump`
- FIX: fix memory content for multi-frame captures (was wrong after frame 1)
- FIX: screen: center reference screenshot (probably still wrong)
- CHG: screen: zoom panel size, clipping
- NEW: screen: show bitplane pointers
- CHG: screen: improve performance by 40%
- NEW: screen: mouse click&drag to set time
- NEW: screen: `Freeze frame` to visualize drawing (+ Memory overlay)
- CHG: profiler: improve loading performance by >1000%
- CHG: profiler: multi-frame captures are now loaded in the background for faster startup time
- CHG: savestate: show progress bar during profiling
- NEW: `Amiga: Clean Temp Files` to delete `.amigaprofile` files from your temp path.
- FIX: the terminal didn't re-open once closed
- FIX: disassembly: fix divul, divsl, FPU, fmoveml (see `68k-dis.ts`)
- FIX: [#128 Can't use the image converter link](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/128)
- FIX: [#129 Screen and Resources tabs have no scroll bars so I can't see the bottom of a tall image](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/129)
- FIX: improved behavior of jumping from assembly to source (still sometimes the source window disappears)
- NEW: update to [latest WinUAE](https://github.com/tonioni/WinUAE/tree/e95402d9aa8a95d6164d65d210b4d8ec52ac037d)

## 1.5.5
- NEW: VASM assembler with debugging support ([PR#123 by merry^Architect](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/123))
  - GAS keeps the `.s` extension; VASM uses the `.asm` extension.
  - VASM has been modified to provide valid DWARF section names to make the extension debugger to work (although you can debug using the official version prefixing code section names with `.text`).
  - The assembly language provider has been updated to validate assembly sources against either GAS or VASM depending on the source code file extension.
  - Syntax highlighting, symbol search and error squiggles support.
- NEW: `DMA Control` shows `BltPri`
- NEW: assembly: hover over custom register name to get documentation
- NEW: assembly: hover over status register bits to get more info
- FIX: assembly: Find <kbd>Ctrl+F</kbd> now case-insensitive
- FIX: screen: fix sprites over HAM
- FIX: copper: improve performance
- NEW: copper: Find <kbd>Ctrl+F</kbd>

## 1.5.4
- NEW: profiler: improve blitter tooltip for line mode, show simplified formulas of minterms
- NEW: profiler: show blitter mode (`Blit`, `Line`, `Fill`, `Clear`) in blitter timeline
- NEW: new commands in the command palette <kbd>Ctrl+Shift+P</kbd>: ([PR#124 by merry^Architect](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/124))
  - `Open Gradient Master`: opens the Deadliner's The Amiga Gradient Master tool to assist you creating color gradients for Copperlists).
  - `Open Image Tool` opens the Deadliner's Image Tool to assist you converting images to different Amiga formats.
  - `Open Color Reducer` opens the Deadliner's Color Reducer tool to assist you reducing the number of colors in images in a smart manner.
  - `Open BLTCON Cheat Sheet`: opens the Deadliner's BLTCON Cheat Sheet tool that helps you designing Blitter operations.
  - `Open Amiga Hardware Reference Manual`: opens the Amiga Hardware Reference Manual TOC hosted at amigadev.elowar.com.
- NEW: you can set your Kickstart paths in settings <kbd>Ctrl+,</kbd> under `Extensions` > `Amiga C/C++ Compile, Debug & Profile` > `Rom-paths: A500, A1200, A4000` ([PR#117 by merry^Architect](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/117))
- NEW: template project's output now in `out/a.elf`, `out/a.exe`. Can be changed in settings `amiga.program` ([PR#119 by merry^Architect](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/119))
- NEW: new command `Convert EXE to ADF` (right-click Amiga EXE files in the explorer) ([PR#122 by merry^Architect](https://github.com/BartmanAbyss/vscode-amiga-debug/pull/122))
- NEW: assembly registers now also show `SR` (status register)

## 1.5.3
- FIX: fix missing cycle timings in assembly view (was broken since 1.4.7)
- NEW: memory: switch between byte `.B`, word `.W` and longword `.L` display
- NEW: smooth scrolling for custom register/CPU opcode tooltip windows
- FIX: assembly: handle 0-cycle trace instructions
- FIX: kickstart symbols now include mathieeesingbas.library
- NEW: disassembler: support FPU (68881/68882/68040/68060)
- NEW: profiler: blitter-tooltip: show BLT*DAT if DMA for channel is disabled but is used in minterm
- CHG: `BPL1MOD`, `BPL2MOD` as decimals

## 1.5.2
- FIX: copper: don't crash when hovering over `NO-OP` instruction
- NEW: display `BPL1MOD`, `BPL2MOD` as signed values
- NEW: screen: support `FMODE` (AGA) for bitplanes
- NEW: profiler now shows 32 and 64 bit wide DMA transfers
- NEW: resources: support `FMODE` (AGA)

## 1.5.1
- FIX: profiler: Custom registers at start of frame 
- FIX: screen: display window when not set during frame
- FIX: DMA: ignore fake copper DMA after COPJMP

## 1.5.0
- FIX: fixed WinUAE-crash in savestate profiler for non-68000 CPUs, and non-bogomem memory configs
- FIX: savestate controls improved, debug output
- FIX: screen/resource zoom window now clips to document

## 1.4.9
- NEW: fixed template project's `TakeSystem`/`FreeSystem` to be compatible with AROS
- NEW: Use AROS if no Kickstart ROM is configured
- CHG: update AROS ROM in WinUAE

## 1.4.8
- FIX: fix 2 seconds delay when starting WinUAE
- NEW: new debug functions `debug_load`, `debug_save` in `gcc8_c_support.h`

## 1.4.7
- NEW: show CPU registers in assembly view (fixes [[#78](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/78))

## 1.4.6
- NEW: memory viewer: track CPU data
- NEW: screen: show time, enable/disable display window, more pixel sources, DMACON, BPLCON

## 1.4.5
- FIX: scrolling in copperlist no longer shifts whole profiler up
- FIX: dragging time in profiler flame-graph no longer stops working once reaching the outside of the profiler
- NEW: memory heatmap
- CHG: update WinUAE

## 1.4.4
- custom registers view: tooltip help for registers
- Denise emulator ("Screen (Beta)" tab), enable/disable specific bitplanes, sprites, with DMA overlay; click in screen to set time
- blitter tooltips show blit duration, minterm
- Profiler saves screenshots even for single-frame profiles (PNG, better quality)
- Fix screenshot delay (screenshots were always one frame too old)
- updated to latest WinUAE. fixes sprite DMA not showing SPRxDATA, SPRxDATB
- removed `avail` in startup-sequence (commited by mistake)

## 1.4.3
- savestate profiler: enable "cycle exact" before launching .uss file

## 1.4.2
- fixes missing shrinkler terminal output
- Shrinkler: fixed progress output (only went to 10% instead of 100%)

## 1.4.1
- fixed DMA display for blitter (Channel D was missing, Channel B and C incorrectly had Line & Fill attribution) (fixes [#104](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/104))
- added more DMA events (CPU Blitter Steal, CPU Blitter Stolen, Copper Skip)
- fix Makefile for users with `git sh` in their path (fixes [#103](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/103))

## 1.4.0
- symbols for Kickstart 1.2, 1.3, 2.04, 2.05, 3.0, 3.1 (no FPU support) working for debugging (e.g. you can set a breakpoint to 'WaitBlit' or 'AllocMem') and profiling

## 1.3.9
- fix debugger not working when kickstart symbols not found (broken since 1.3.8)

## 1.3.8
- symbols for Kickstart 1.3 [exec 34.2] (GDB only, dos.library missing)

## 1.3.7
- fixed crash in assembly view #97

## 1.3.6
- use VSCode built-in memory viewer for `Amiga: View Memory` 

## 1.3.5
- use VSCode built-in memory viewer (click the binary icon beside a variable in the debug view)
- fix crash in WinUAE when requesting a memory dump

## 1.3.4
- updated to GCC 12.1.0, binutils, GNU gdb (GDB) 13.0.50.20220509-git
- fixed missing error message during launching a debug session when .elf file was not found

## 1.3.3
- fix some 68k cycle timings
- support breakpoints in .s files
- Assembly: show theoretical 68000 cycles as decoration
- Assembly: fix F12 on local labels
- Assembly: Autocomplete for opcodes, labels
- Disassembly: Hover over CPU instructions to view documentation
- Diassembly: fix loop cycle display in some cases

## 1.3.2
- updated to WinUAE 4.9.0 beta 42
- fixed debug overlay redraw issue (broken since 1.2.0)

## 1.3.1
- (internal) use webpack for both extension and webview
- fix "Disassemble ELF file" (broken since 1.3.0)

## 1.3.0
- savestate gfx-debugging/profiling (.uss files created by any WinUAE)
- resource viewer supports hires
- resource viewer shows copper screens of every profiled frame

## 1.2.4
- fixed AbleICR, SetICR, AddICRVector, RemICRVector in resources/cia.h [tehKaiN] #80
- Configurable ram size [tehKaiN] #79

## 1.2.3
- fix incorrect blitter size (broken since 1.2.1) #85
- fix palette/copper colors (broken since a while) #71
- Updated to WinUAE 4.9.0 beta 38 (2021.10.23) #84

## 1.2.2
- fix multi-frame profile screenshot thumbnails (broken since 1.2.1 for 32-bit machine models)
- fix multi-frame profile error message "Unable to start profiling: RangeError: start offset of Uint16Array should be a multiple of 2" (broken since 1.2.1)

## 1.2.1
- Updated to WinUAE 4.9.0 beta 37 (2021.10.14)

## 1.2.0
- Updated to GCC 11.2.0 and GDB 12.0.50.20211014-git

## 1.1.0
- Disassembly now demangles C++ names
- Bitmap visualizer now supports HAM5, HAM6 and EHB modes (see `debug_resource_bitmap_ham`)
- Blitter visualizer now uses number of bitplanes from registered bitmap resources (channel D)
- WinUAE now handles debugging commands when emulation is paused
- Better handling of closing WinUAE during debugging
- Fixed WinUAE to reset debug resources on restart
- `Profile File Size` working again, now demangles C++ names
- bump IntelliSense to gnu11, g++20
- moved elf2hunk to a seperate repository, limit symbol length, C++ name demangling
- elf2hunk now suports `-s` to strip symbols (long symbol names can cause AmigaDOS to not load the exe file)
- fix crash in Shrinkler for empty symbol hunks
- better C++ support (added -fno-rtti -fcoroutines to CCFLAGS). Added <type_traits>, <coroutines> header files. support for global destructors (now using -fno-use-cxa-atexit)
- support for more Amiga models in `.vscode/launch.json` (these are all WinUAE quickstart configs):
  - `A1200-FAST`: A1200 with 4MB fast memory
  - `A1200-030`: A1200 with Blizzard 1230-IV and 32MB board memory. Requires the absolute path to the Blizzard ROM in `cpuboard`.
  - `A3000`: A3000 (no profiler support)
- new option `endcli` in `.vscode/launch.json` (default: false) If enabled, uses `run` and `EndCLI` in `startup-sequence` so you cann call `CloseWorkBench()` from your program.
- new option `uaelog` in `.vscode/launch.json` (default: true): If disabled, don't show WinUAE log output in debug console
- NDK: updated to latest version from bebbo's package
- GCC: prevent `sccp` pass from generating `__mulsi3` calls
- Fixed WinUAE not booting correctly after overwriting the default configuration
- debugger: now breaks at 'TRAP #7' opcode (generated by GCC when undefined behavior is encountered)
- debugger: now breaks at Address Error (68000 unaligned memory access)
- debugger: now breaks at Illegal Instruction (illegal opcode)
- debugger: support restart
- debugger: faster stop when debugging hasn't started yet
- Debug Console now shows all output from WinUAE as well (exceptions, etc.)
- GDB output can now be found in the `Output` pane under `Amiga`
- support IntelliSense for assembly sources (currently working: `Go to Symbol`, `Go to Definition`, semantic highlighting)
- support relocation for an arbitrary number of sections/hunks (fixes [#11](https://github.com/BartmanAbyss/vscode-amiga-debug/issues/11))
- support data breakpoints/watchpoints (during debugging, right-click on a variable and select `Break when value changes`)
- support for a custom version of Shrinkler executable cruncher by Blueberry that generates `.shrinklerstats` files that can be opened with VS Code for size profiling. Right-click an EXE file in the explorer, and select `Amiga: Shrinkle File`, then select a Shrinkler configurations. See `.vscode/amiga.json` in the template project for examples of how to specify shrinkler configurations.
- added blitter timeline to profiler
- better scolling/zooming in profiler
- fixed CPU profiling (callstacks got merged)
- GCC: fixed unwind information generated in epilogues
- disassemble ELF file: Right-click on ELF file in the explorer, and select `Amiga: Disassemble ELF File`. Navigate with cursor keys. Automatically opens C sources and relates C source code to assembly. cursor right to follow jump, cursor left to backtrack. Navigate in C sources to automatically show corresponding assembly instructions. Disassembly is automatically updated when you rebuild your project.
- profiler: new `Assembly` tab shows assembly execution trace with timings and jumps
- profiler now has symbol table and can resolve addresses
- profiler now synchronized to DMA
- profiler now supports multiple frames with screenshots
- profiler: optimized loading of big profile files
- fixed blitter crash after setting a breakpoint in interrupt or profiling
- graphics debugger in profiler (copper, blitter, bitmaps, custom registers). Use debug_register_*/debug_unregister functions from `gcc8_c_support.h` to tell the graphics debugger about your bitmaps, palettes and copperlists for a better experience. Move the time slider in the flame-graph to replay the captured frame and see your graphics change in real-time. Use 'Overlay' to visualize blitter rects or overdraw.
- WinUAE debug overlay: debug_text now supports newlines
- several DMA request were not displayed in the timeline (bitplanes > 1, sprites > 1, refresh > 1)
- template project: added ThePlayer61 module replayer. To convert your own modules, use [p61con](https://www.pouet.net/prod.php?which=19922)
- increased buffer size for addr2line.exe (profiling could fail on "big" executables)
- `gcc8_c_support.c`: improved `warpmode`
- IntelliSense: previous versions would write `"compilerPath"` to every `.vscode/c_cpp_properties.json`, even if it wasn't an Amiga project. Now, the whole process has been simplified. Please use the following `.vscode/c_cpp_properties.json` file:
```json
{
    "configurations": [
        {
            "name": "Amiga",
            "configurationProvider": "BartmanAbyss.amiga-debug"
        }
    ],
    "version": 4
}
```
and move the existing `"defines"`, `"includePath"` settings to `.vscode/amiga.json` like this:
```json
{
	"includePath": [ 
		"${workspaceFolder}/**",
		"${workspaceFolder}/../shared/"
	],
	"defines": [ "DEBUG" ]
}
```
`"defines" : [ "__GNUC__=8", "_NO_INLINE" ]` is no longer needed.

**Important:** You must have a `.vscode/amiga.json` file in your workspace, even if it's empty. IntelliSense will not work if this file is not present.

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
