# Building the m68k-amiga-elf Toolchain on Linux with Register Parameter Support

This document describes how to build the [BartmanAbyss/vscode-amiga-debug](https://github.com/BartmanAbyss/vscode-amiga-debug) GCC toolchain from source on Linux (tested on Linux Mint 22), applying the additional `gcc-regparm.patch` that adds `asm("reg")` register parameter support.

The result is a standalone `m68k-amiga-elf-gcc` cross-compiler that can be used independently of the VS Code extension.

---

## Prerequisites

```bash
sudo apt install -y \
  build-essential flex bison \
  libgmp-dev libmpfr-dev libmpc-dev \
  texinfo wget lhasa autoconf \
  rsync libreadline-dev git
```

---

## 1. Create a working directory

```bash
mkdir ~/AMIGA_GCC
cd ~/AMIGA_GCC
```

---

## 2. Clone your fork

```bash
git clone https://github.com/jbilander/vscode-amiga-debug.git
```

---

## 3. Download and patch GCC 15.1.0

```bash
wget https://ftp.gwdg.de/pub/misc/gcc/releases/gcc-15.1.0/gcc-15.1.0.tar.xz
tar -xf gcc-15.1.0.tar.xz
cd gcc-15.1.0

# Apply Bartman's patch first
patch -p1 < ../vscode-amiga-debug/gcc-barto.patch

# Apply the register parameter patch
patch -p1 < ../vscode-amiga-debug/gcc-regparm.patch

# Download GCC prerequisites (gmp, mpfr, mpc, isl)
bash ./contrib/download_prerequisites

cd ..
```

---

## 4. Set the install prefix

```bash
export PREFIX=/opt/amiga-elf
sudo mkdir -p $PREFIX
sudo chown $USER $PREFIX
```

---

## 5. Build binutils

```bash
git clone https://github.com/BartmanAbyss/binutils-gdb.git
mkdir build-binutils && cd build-binutils

../binutils-gdb/configure \
  --prefix=$PREFIX \
  --target=m68k-amiga-elf \
  --disable-werror \
  --disable-shared \
  --disable-interprocess-agent \
  --disable-nls

make -j$(nproc)
make install
cd ..
```

---

## 6. Build GCC

```bash
mkdir build-gcc && cd build-gcc

../gcc-15.1.0/configure \
  --prefix=$PREFIX \
  --target=m68k-amiga-elf \
  --disable-clocale \
  --disable-gcov \
  --disable-libada \
  --disable-libgomp \
  --disable-libsanitizer \
  --disable-libssp \
  --disable-libvtv \
  --disable-multilib \
  --disable-threads \
  --disable-nls \
  --enable-languages=c,c++ \
  --enable-lto

make all-gcc -j$(nproc)
make install-gcc
cd ..
```

---

## 7. Add to PATH

```bash
echo 'export PATH=/opt/amiga-elf/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

Verify:

```bash
m68k-amiga-elf-gcc --version
# m68k-amiga-elf-gcc (GCC) 15.1.0
```

---

## 8. Build elf2hunk

```bash
git clone https://github.com/BartmanAbyss/elf2hunk.git
cd elf2hunk
sudo apt install -y libiberty-dev
gcc -o elf2hunk elf2hunk.c -liberty
sudo cp elf2hunk /usr/local/bin/
cd ..
```

---

## 9. Test the register parameter patch

Clone the test program and build it:

```bash
git clone https://github.com/jbilander/amiga-regparm-test.git
cd amiga-regparm-test
make
```

Inspect the disassembly to confirm register parameters produce correct code:

```bash
cat test_regparm.s | grep -A3 "add_regs\|ptr_deref"
```

You should see:

```asm
add_regs:
    add.l d1,d0    ; a in d0, b in d1 — no stack at all
    rts

ptr_deref:
    move.l (a0),d0 ; pointer arrived in a0
    rts
```

Copy `test_regparm` to your Amiga or WinUAE and run it from the shell:

```
test_regparm
```

Expected output:

```
Register parameter test PASSED!
  add_regs(21, 21) = 42  OK
  ptr_deref(&val)  = 99  OK
```

---

## Notes

### NDK headers and library calls

When writing programs for this toolchain without a C runtime, the NDK 3.2 `proto/` inline stubs do not generate correct library call code with GCC 15.x. Use direct `inline asm` wrappers instead:

```c
static void *my_OpenLibrary(const char *name, unsigned long ver)
{
    register void         *result __asm("d0");
    register struct ExecBase *sb  __asm("a6") = SysBase;
    register const char   *n      __asm("a1") = name;
    register unsigned long v      __asm("d0") = ver;
    __asm volatile ("jsr -552(%%a6)"
        : "=r"(result)
        : "r"(sb), "r"(n), "r"(v)
        : "a0", "d1", "cc", "memory");
    return result;
}
```

### Using asm() vs `__asm__()`

Both syntaxes are supported by the patch:

```c
// vbcc/SAS-C style
void foo(int x asm("d0"), int y asm("d1"));

// Always-portable GCC style  
void foo(int x __asm__("d0"), int y __asm__("d1"));
```

### Generating the combined patch

If you make further changes to the GCC source and need to regenerate `gcc-regparm.patch`:

```bash
cd ~/AMIGA_GCC
bash vscode-amiga-debug/generate_regparm_patch.sh
cp gcc-regparm.patch vscode-amiga-debug/gcc-regparm.patch
```
