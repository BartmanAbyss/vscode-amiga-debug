#include <proto/exec.h>
extern struct ExecBase* SysBase;

unsigned long strlen(const char* s)
{
	unsigned long t=0;
	while(*s++)
		t++;
	return t;
}

__attribute__((optimize("no-tree-loop-distribute-patterns"))) 
	void* memset(void *dest, int val, unsigned long len)
{
	unsigned char *ptr = (unsigned char *)dest;
	while(len-- > 0)
		*ptr++ = val;
	return dest;
}

__attribute__((optimize("no-tree-loop-distribute-patterns"))) 
void* memcpy(void *dest, const void *src, unsigned long len)
{
	char *d = (char *)dest;
	const char *s = (const char *)src;
	while(len--)
		*d++ = *s++;
	return dest;
}

__attribute__((optimize("no-tree-loop-distribute-patterns"))) 
void* memmove(void *dest, const void *src, unsigned long len)
{
	char *d = dest;
	const char *s = src;
	if (d < s) {
		while (len--)
			*d++ = *s++;
	} else {
		const char *lasts = s + (len - 1);
		char *lastd = d + (len - 1);
		while (len--)
			*lastd-- = *lasts--;
	}
	return dest;
}

// vbcc
typedef unsigned char *va_list;
#define va_start(ap, lastarg) ((ap)=(va_list)(&lastarg+1)) 

void KPutCharX();
void PutChar();

__attribute__((noinline)) __attribute__((optimize("O1")))
void KPrintF(const char* fmt, ...)
{
	va_list vl;
	va_start(vl, fmt);
    long(*UaeDbgLog)(long mode, const char* string) = (long(*)(long, const char*))0xf0ff60;
    if(*((UWORD *)UaeDbgLog) == 0x4eb9 || *((UWORD *)UaeDbgLog) == 0xa00e) {
		char temp[128];
		RawDoFmt((CONST_STRPTR)fmt, vl, PutChar, temp);
		UaeDbgLog(86, temp);
    } else {
		RawDoFmt((CONST_STRPTR)fmt, vl, KPutCharX, 0);
	}
}

int main();

extern void (*__preinit_array_start[])() __attribute__((weak));
extern void (*__preinit_array_end[])() __attribute__((weak));
extern void (*__init_array_start[])() __attribute__((weak));
extern void (*__init_array_end[])() __attribute__((weak));
extern void (*__fini_array_start[])() __attribute__((weak));
extern void (*__fini_array_end[])() __attribute__((weak));

__attribute__((used)) __attribute__((section(".text.unlikely"))) void _start() {
	// initialize globals, ctors etc.
	unsigned long count;
	unsigned long i;

	count = __preinit_array_end - __preinit_array_start;
	for (i = 0; i < count; i++)
		__preinit_array_start[i]();

	count = __init_array_end - __init_array_start;
	for (i = 0; i < count; i++)
		__init_array_start[i]();

	main();

	// call dtors
	count = __fini_array_end - __fini_array_start;
	for (i = count; i > 0; i--)
		__fini_array_start[i - 1]();
}

void warpmode(int on) // bool
{
	long(*UaeConf)(long mode, int index, const char* param, int param_len, char* outbuf, int outbuf_len);
	UaeConf = (long(*)(long, int, const char*, int, char*, int))0xf0ff60;
    if(*((UWORD *)UaeConf) == 0x4eb9 || *((UWORD *)UaeConf) == 0xa00e) {
		char outbuf;
		UaeConf(82, -1, on ? "warp true" : "warp false", 0, &outbuf, 1);
		UaeConf(82, -1, on ? "blitter_cycle_exact false" : "blitter_cycle_exact true", 0, &outbuf, 1);
	}
}

static void debug_cmd(unsigned int arg1, unsigned int arg2, unsigned int arg3, unsigned int arg4)
{
	long(*UaeLib)(unsigned int arg0, unsigned int arg1, unsigned int arg2, unsigned int arg3, unsigned int arg4);
	UaeLib = (long(*)(unsigned int, unsigned int, unsigned int, unsigned int, unsigned int))0xf0ff60;
    if(*((UWORD *)UaeLib) == 0x4eb9 || *((UWORD *)UaeLib) == 0xa00e) {
		UaeLib(88, arg1, arg2, arg3, arg4);
	}
}

enum barto_cmd {
	barto_cmd_clear,
	barto_cmd_rect,
	barto_cmd_filled_rect,
	barto_cmd_text,
};

void debug_clear()
{
	debug_cmd(barto_cmd_clear, 0, 0, 0);
}

void debug_rect(short left, short top, short right, short bottom, unsigned int color)
{
	debug_cmd(barto_cmd_rect, (((unsigned int)left) << 16) | ((unsigned int)top), (((unsigned int)right) << 16) | ((unsigned int)bottom), color);
}

void debug_filled_rect(short left, short top, short right, short bottom, unsigned int color)
{
	debug_cmd(barto_cmd_filled_rect, (((unsigned int)left) << 16) | ((unsigned int)top), (((unsigned int)right) << 16) | ((unsigned int)bottom), color);
}

void debug_text(short left, short top, const char* text, unsigned int color)
{
	debug_cmd(barto_cmd_text, (((unsigned int)left) << 16) | ((unsigned int)top), (unsigned int)text, color);
}
