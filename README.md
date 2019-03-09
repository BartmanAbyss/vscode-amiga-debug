# _amiga-debug_ Visual Studio Code Extension

Debug Amiga C programs compiled by gcc in WinUAE.

## Known Issues

* sometimes fail at start: Unable to open 'main.amigaasm': Cannot read property 'customRequest' of undefined.
* sometimes times out trying to connect to gdb
* file name lookup from stackTrace (missing normalization)
* restartRequest not implemented
* vscode.debug.activeDebugSession is undefined when program is stopped on entry
* not getting handleThreadSelected(), thread ID now set in class
* sometimes Pause/Resume button doesn't correctly switch to "Pause" icon while amiga program is running
* don't stop on entry
* remove hard-coded paths

