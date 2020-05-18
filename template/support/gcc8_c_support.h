#pragma once

#ifdef __cplusplus
	extern "C" {
#endif

void *memcpy (void *, const void *, unsigned long);
void *memset (void *, int, unsigned long);
unsigned long strlen (const char *);
void warpmode(int on); // bool on/off
void KPrintF(const char* fmt, ...); // output to debugger

#define INCBIN(name, file) \
    __asm__(".pushsection .rodata\n" \
            ".global incbin_" #name "_start\n" \
            ".type incbin_" #name "_start, @object\n" \
            ".balign 2\n" \
            "incbin_" #name "_start:\n" \
            ".incbin \"" file "\"\n" \
            \
            ".global incbin_" #name "_end\n" \
            ".type incbin_" #name "_end, @object\n" \
            ".balign 1\n" \
            "incbin_" #name "_end:\n" \
            ".byte 0\n" \
			".popsection\n" \
    ); \
    extern const __attribute__((aligned(2))) char incbin_ ## name ## _start[1024*1024]; \
	extern const void* incbin_ ## name ## _end;\
    const void* name = &incbin_ ## name ## _start;

inline unsigned int muluw(unsigned short a, unsigned short b) {
    asm("muluw %1,%0":"+d"(a): "mid"(b): "cc");
    return a;
}
inline int mulsw(short a, short b) {
    asm("mulsw %1,%0":"+d"(a): "mid"(b): "cc");
    return a;
}
inline unsigned int divuw(unsigned short a, unsigned short b) {
    asm("divuw %1,%0":"+d"(a): "mid"(b): "cc");
    return a;
}
inline int divsw(short a, short b) {
    asm("divsw %1,%0":"+d"(a): "mid"(b): "cc");
    return a;
}

#ifdef __cplusplus
	} // extern "C"
#endif
