# Change Log

All notable changes to the "amiga-debug" extension will be documented in this file.

## 1.5.4
- NEW: profiler: improve blitter tooltip for line mode
- NEW: profiler: show blitter mode (`Blit`, `Line`, `Fill`) in blitter timeline

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
