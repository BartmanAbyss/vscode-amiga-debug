@echo off

rem @file   mkfinal.bat
rem @author David Cañadas Mazo

pushd

set "PROGRAMNAME=%~1"
set "PROGRAMNAME=%PROGRAMNAME:/=\%"
set "LOCALPROGRAMNAME=%~dpn1-compressed%~x1"
set "LOCALPROGRAMNAME=%LOCALPROGRAMNAME:/=\%"

cd "%~dp0"
"%~2\Shrinkler.exe" %~3 "%PROGRAMNAME%" "%LOCALPROGRAMNAME%"
copy /Y "%~dpn1.elf" "%~dpn1-compressed.elf"
popd
goto:eof
