# _amiga-debug_ Visual Studio Code Extension

Debug Amiga C programs compiled by gcc in WinUAE.

## Known Issues

* store assembly breakpoints in one "virtual" file in breakpointMap (how?!)
* when stepping out of IRQ handler, stack frames are corrupt until next step
* disassemble address always creates new disassembly even if just stepping. check title of current disassembly window if current PC is in range.
* sometimes fail at start: Unable to open 'main.amigaasm': Cannot read property 'customRequest' of undefined.
* restartRequest not implemented
* vscode.debug.activeDebugSession is undefined when program is stopped on entry
* not getting handleThreadSelected(), thread ID now set in class
* sometimes Pause/Resume button doesn't correctly switch to "Pause" icon while amiga program is running
* remove hard-coded paths
* step out of kickstart: set fake breakpoint at 0xfffffff, WinUAE should enter TRACE_RANGE_PC mode (TODO: tighten range around loaded program), but keeps breaking later

