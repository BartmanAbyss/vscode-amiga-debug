# to generate assembler sources: -Wa,-ahl=$@.s

forward-to-backward = $(subst /,\,$1)

subdirs := $(wildcard */)
VPATH = $(subdirs)
cpp_sources := $(wildcard *.cpp) $(wildcard $(addsuffix *.cpp,$(subdirs)))
cpp_objects := $(addprefix obj/,$(patsubst %.cpp,%.o,$(notdir $(cpp_sources))))
c_sources := $(wildcard *.c) $(wildcard $(addsuffix *.c,$(subdirs)))
c_objects := $(addprefix obj/,$(patsubst %.c,%.o,$(notdir $(c_sources))))
objects := $(cpp_objects) $(c_objects)

# https://stackoverflow.com/questions/4036191/sources-from-subdirectories-in-makefile/4038459
# http://www.microhowto.info/howto/automatically_generate_makefile_dependencies.html

OUT = a.mingw
CC = m68k-amiga-elf-gcc

CCFLAGS = -g -MP -MMD -m68000 -Ofast -nostdlib -Wall -Wno-unused-function -Wno-volatile-register-var -fomit-frame-pointer -fno-tree-loop-distribution -flto -fwhole-program -fno-exceptions
ASFLAGS = -Wa,-g
LDFLAGS = -Wl,--emit-relocs,-Ttext=0,-Map=$(OUT).map

all: $(OUT).exe

$(OUT).exe: $(OUT).elf
	$(info Elf2Hunk $(OUT).exe)
	@elf2hunk $(OUT).elf $(OUT).exe

$(OUT).elf: $(objects) obj/gcc8_a_support.o
	$(info Linking a.mingw.elf)
	@$(CC) $(CCFLAGS) $(LDFLAGS) $(objects) obj/gcc8_a_support.o -o $@
	@m68k-amiga-elf-objdump --disassemble -S $@ >$(OUT).s 

obj/gcc8_a_support.o: support/gcc8_a_support.s
	$(info Assembling $<)
	@$(CC) $(CCFLAGS) $(ASFLAGS) -xassembler-with-cpp -c -o $@ $(CURDIR)/$<

clean:
	$(info Cleaning...)
	@del /q obj $(OUT).* 2>nul || rmdir obj 2>nul || ver>nul

-include $(objects:.o=.d)

$(cpp_objects) : obj/%.o : %.cpp
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Compiling $<)
	@$(CC) $(CCFLAGS) -c -o $@ $(CURDIR)/$<

$(c_objects) : obj/%.o : %.c
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Compiling $<)
	@$(CC) $(CCFLAGS) -c -o $@ $(CURDIR)/$<
