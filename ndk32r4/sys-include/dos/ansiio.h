#ifndef DOS_ANSIIO_H
#define DOS_ANSIIO_H
/*
**
**      $VER: ansiio.h 47.1 (29.7.2019)
**
**      Macros to emulate some ANSI I/O functions
**      through the dos.library. These macros
**      replace functions in amiga.lib.
**
**      Copyright (C) 2019 Hyperion Entertainment CVBA.
**          Developed under license.
**
*/

#define fgetc(stream)           FGetC(stream)
#define getchar()               FGetC(Input())
#define fgets(s,l,stream)       FGets(stream,s,l)
#define ungetc(c,stream)        UnGetC(stream,c)
#define fputc(c,stream)         FPutC(stream,c)
#define fputs(s,stream)         FPuts(stream,s)
#define puts(s)                 PutStr(s)
#define putchar(c)              FPutC(Output(),c)
#define fread(buf,s,n,fh)       FRead(fh,buf,s,n)
#define fwrite(buf,s,n,fh)      FWrite(fh,buf,s,n)
#define fflush(stream)          Flush(stream)
#define fclose(stream)          Close(stream)
#define vfprintf(fh,fmt,args)   VFPrintf(fh,fmt,args)
#define fprintf                 FPrintf
#define vprintf(fmt,args)       VPrintf(fmt,args)
#define printf                  Printf
#define perror(s)               PrintFault(IoErr(),s)

#endif  /* DOS_ANSIIO_H */
