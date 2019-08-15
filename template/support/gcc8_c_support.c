#if __GNUC__ >= 8

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
void* memset(void *dest, unsigned long val, unsigned long len)
{
	unsigned char *ptr = dest;
	while(len-- > 0)
		*ptr++ = val;
	return dest;
}

__attribute__((optimize("no-tree-loop-distribute-patterns"))) 
void* memcpy(void *dest, const void *src, unsigned long len)
{
	char *d = dest;
	const char *s = src;
	while(len--)
		*d++ = *s++;
	return dest;
}

// vbcc
typedef unsigned char *va_list;
#define va_start(ap, lastarg) ((ap)=(va_list)(&lastarg+1)) 

void KPutCharX(int);

__attribute__((noinline)) __attribute__((optimize("O1")))
void KPrintF(const char* fmt, ...)
{
	va_list vl;
	va_start(vl, fmt);
	RawDoFmt(fmt, vl, KPutCharX, 0);
}

int main();

__attribute__((used)) __attribute__((section(".text.unlikely"))) void _start() {
	main();
}

void warpmode(int on) 
{ // bool
	long(*UaeConf)(long mode, int index, const char* param, int param_len, char* outbuf, int outbuf_len);
	UaeConf = (void *)0xf0ff60;
	if(*((ULONG *)UaeConf)) {
		char outbuf;
		UaeConf(82, -1, on ? "warp true" : "warp false", 0, &outbuf, 1);
		UaeConf(82, -1, on ? "blitter_cycle_exact false" : "blitter_cycle_exact true", 0, &outbuf, 1);
	}
}
 
#endif // GNUC >= 8