# _amiga-debug_ Visual Studio Code Extension

Debug Amiga C programs compiled by gcc in WinUAE.

## Known Issues

* file name lookup from stackTrace (missing normalization)
* restartRequest not implemented
* vscode.debug.activeDebugSession is undefined when program is stopped on entry
* not getting handleThreadSelected(), thread ID now set in class
* sometimes Pause/Resume button doesn't correctly switch to "Pause" icon while amiga program is running
* don't stop on entry
* remove hard-coded paths

