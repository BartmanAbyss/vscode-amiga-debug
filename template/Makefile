# to generate assembler listing with LTO, add to LDFLAGS: -Wa,-adhln=$@.listing,--listing-rhs-width=200
# for better annotations add -dA -dP
# to generate assembler source with LTO, add to LDFLAGS: -save-temps=cwd

SHELL = cmd.exe

forward-to-backward = $(subst /,\,$1)

subdirs := $(wildcard */)
code_subdirs:= $(filter-out out/,$(subdirs))
VPATH = $(subdirs)
cpp_sources := $(wildcard *.cpp) $(wildcard $(addsuffix *.cpp,$(code_subdirs)))
cpp_objects := $(addprefix obj/,$(patsubst %.cpp,%.o,$(notdir $(cpp_sources))))
c_sources := $(wildcard *.c) $(wildcard $(addsuffix *.c,$(code_subdirs)))
c_objects := $(addprefix obj/,$(patsubst %.c,%.o,$(notdir $(c_sources))))
s_sources := $(wildcard *$(gasExtension)) $(wildcard $(addsuffix *$(gasExtension), $(code_subdirs)))
s_sources := support/gcc8_a_support$(gasFileExt) support/depacker_doynax$(gasFileExt)
s_objects := $(addprefix obj/,$(patsubst %$(gasFileExt),%.o,$(notdir $(s_sources))))
vasm_sources := $(wildcard *$(vasmFileExt)) $(wildcard $(addsuffix *$(vasmFileExt), $(code_subdirs)))
vasm_objects := $(addprefix obj/, $(patsubst %$(vasmFileExt),%.o,$(notdir $(vasm_sources))))
objects := $(cpp_objects) $(c_objects) $(s_objects) $(vasm_objects)

# https://stackoverflow.com/questions/4036191/sources-from-subdirectories-in-makefile/4038459
# http://www.microhowto.info/howto/automatically_generate_makefile_dependencies.html

OUT = $(program)
CC = m68k-amiga-elf-gcc
VASM = vasmm68k_mot.exe

CCFLAGS = -g -MP -MMD -m68000 -Ofast -nostdlib -Wextra -Wno-unused-function -Wno-volatile-register-var -fomit-frame-pointer -fno-tree-loop-distribution -flto -fwhole-program -fno-exceptions
CPPFLAGS= $(CCFLAGS) -fno-rtti -fcoroutines -fno-use-cxa-atexit
ASFLAGS = -Wa,-g,--register-prefix-optional,-I$(extensionPath)\opt\m68k-amiga-elf\sys-include,-D
LDFLAGS = -Wl,--emit-relocs,-Ttext=0,-Map=$(OUT).map
VASMFLAGS = -m68000 -Felf -opt-fconst -nowarn=62 -dwarf=2 -I. -I$(extensionPath)\opt\m68k-amiga-elf\sys-include 

all: $(OUT).exe

$(OUT).exe: $(OUT).elf
	$(info Elf2Hunk $(OUT).exe)
	@elf2hunk $(OUT).elf $(OUT).exe -s

$(OUT).elf: $(objects)
	$(info Linking a.mingw.elf)
	@$(CC) $(CCFLAGS) $(LDFLAGS) $(objects) -o $@
	@m68k-amiga-elf-objdump --disassemble --no-show-raw-ins --visualize-jumps -S $@ >$(OUT)$(gasFileExt) 

clean:
	$(info Cleaning...)
	@del /q obj $(OUT).* 2>nul || rmdir obj 2>nul || ver>nul

-include $(objects:.o=.d)

$(cpp_objects) : obj/%.o : %.cpp
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Compiling $<)
	@$(CC) $(CPPFLAGS) -c -o $@ $(CURDIR)/$<

$(c_objects) : obj/%.o : %.c
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Compiling $<)
	@$(CC) $(CCFLAGS) -c -o $@ $(CURDIR)/$<

$(s_objects): obj/%.o : %$(gasFileExt)
	$(info Assembling $<)
	@$(CC) $(CCFLAGS) $(ASFLAGS) -c -o $@ $(CURDIR)/$<

$(vasm_objects): obj/%.o : %$(vasmFileExt)
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Assembling $<)
	@$(VASM) $(VASMFLAGS) -o $@ $(CURDIR)/$<
