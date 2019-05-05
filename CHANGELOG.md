# Change Log

All notable changes to the "amiga-debug" extension will be documented in this file.

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
