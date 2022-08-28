@echo off

rem @file   mkfinal.bat
rem @author David Cañadas Mazo

pushd

set "PROGRAMNAME=%~1"
set "PROGRAMNAME=%PROGRAMNAME:/=\%"
set "LOCALPROGRAMNAME=%~nx1"
set "LOCALPROGRAMNAME=%LOCALPROGRAMNAME:/=\%"

cd "%~dp0"
"%~2\Shrinkler.exe" %~3 "%PROGRAMNAME%" "%PROGRAMNAME%.slow.shrinkled"
del "%PROGRAMNAME%"
ren "%PROGRAMNAME%.slow.shrinkled" "%LOCALPROGRAMNAME%"
popd
goto:eof
