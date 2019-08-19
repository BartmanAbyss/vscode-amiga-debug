#pragma once
void *memcpy (void *, const void *, int);
void *memmove (void *, const void *, int);
void *memset (void *, int, int);
int strlen (const char *);
void warpmode(int on); // bool on/off
void KPrintF(const char* fmt, ...); // output to debugger

#define INCBIN(name, file) \
    __asm__(".pushsection .rodata\n" \
            ".global incbin_" INCBIN_STR(name) "_start\n" \
            ".type incbin_" INCBIN_STR(name) "_start, @object\n" \
            ".balign 2\n" \
            "incbin_" INCBIN_STR(name) "_start:\n" \
            ".incbin \"" file "\"\n" \
            \
            ".global incbin_" INCBIN_STR(name) "_end\n" \
            ".type incbin_" INCBIN_STR(name) "_end, @object\n" \
            ".balign 1\n" \
            "incbin_" INCBIN_STR(name) "_end:\n" \
            ".byte 0\n" \
			".popsection\n" \
    ); \
    extern const __attribute__((aligned(2))) char incbin_ ## name ## _start[1024*1024]; \
	extern const void* incbin_ ## name ## _end;\
    const void* name = &incbin_ ## name ## _start;

inline unsigned int muluw(unsigned short b,unsigned short c) {
    unsigned short a;
    asm("muluw %2,%0":"=d"(a): "0"(c),"d"(b): "cc");
    return a;
}
inline int mulsw(short b,short c) {
    int a;
    asm("mulsw %2,%0":"=d"(a): "0"(c),"d"(b): "cc");
    return a;
}
