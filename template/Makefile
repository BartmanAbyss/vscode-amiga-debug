# to generate assembler listing with LTO, add to LDFLAGS: -Wa,-adhln=$@.listing,--listing-rhs-width=200
# for better annotations add -dA -dP
# to generate assembler source with LTO, add to LDFLAGS: -save-temps=cwd

SHELL = cmd.exe
programFolder = out
targetName = Final

forward-to-backward = $(subst /,\,$1)

subdirs := $(wildcard */)
code_subdirs:= $(filter-out resources/, $(filter-out $(programFolder)/,$(subdirs)))
VPATH = $(subdirs)
cpp_sources := $(wildcard *.cpp) $(wildcard $(addsuffix *.cpp,$(code_subdirs)))
cpp_objects := $(addprefix obj/$(targetName)/,$(patsubst %.cpp,%.o,$(notdir $(cpp_sources))))
c_sources := $(wildcard *.c) $(wildcard $(addsuffix *.c,$(code_subdirs)))
c_objects := $(addprefix obj/$(targetName)/,$(patsubst %.c,%.o,$(notdir $(c_sources))))
s_sources := $(wildcard *.s) $(wildcard $(addsuffix *.s, $(code_subdirs)))
s_objects := $(addprefix obj/$(targetName)/,$(patsubst %.s,%.o,$(notdir $(s_sources))))
vasm_sources := $(wildcard *.asm) $(wildcard $(addsuffix *.asm, $(subdirs)))
vasm_objects := $(addprefix obj/$(targetName)/, $(patsubst %.asm,%.o,$(notdir $(vasm_sources))))
objects := $(cpp_objects) $(c_objects) $(s_objects) $(vasm_objects)

# https://stackoverflow.com/questions/4036191/sources-from-subdirectories-in-makefile/4038459
# http://www.microhowto.info/howto/automatically_generate_makefile_dependencies.html

program = $(programFolder)/a
ccExtraOptions = -Ofast -DNDEBUG
vasmExtraOptions = -DNDEBUG

OUT = $(call forward-to-backward,$(program))
CC = m68k-amiga-elf-gcc
VASM = vasmm68k_mot_win32.exe
SDKDIR = $(call forward-to-backward,$(abspath $(dir $(shell where $(CC)))..\m68k-amiga-elf\sys-include))

CCFLAGS = $(ccExtraOptions) -MP -MMD -m68000 -nostdlib -Wextra -Wno-unused-function -Wno-volatile-register-var -fomit-frame-pointer -fno-tree-loop-distribution -flto -fwhole-program -fno-exceptions
CPPFLAGS= $(CCFLAGS) -fno-rtti -fcoroutines -fno-use-cxa-atexit
ASFLAGS = -Wa,-g,--register-prefix-optional,-I$(SDKDIR),-D
LDFLAGS = -Wl,--emit-relocs,-Ttext=0,-Map=$(OUT).map
VASMFLAGS = $(vasmExtraOptions) -m68000 -Felf -opt-fconst -nowarn=62 -quiet -x -I. -I$(SDKDIR) 

all: $(OUT).exe

$(OUT).exe: $(OUT).elf
	$(info Elf2Hunk $(program).exe)
	@elf2hunk $(OUT).elf $(OUT).exe -s

$(OUT).elf: $(objects)
	$(info Linking $(program).elf)
	@$(CC) $(CCFLAGS) $(LDFLAGS) $(objects) -o $@
	@m68k-amiga-elf-objdump --disassemble --no-show-raw-ins --visualize-jumps -S $@ >$(OUT).s 

clean:
	$(info Cleaning...)
	@del /q obj/$(targetName)/ $(OUT).* 2>nul || rmdir obj/$(targetName)/ 2>nul || ver>nul

-include $(objects:.o=.d)

$(cpp_objects) : obj/$(targetName)/%.o : %.cpp
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Compiling $<)
	@$(CC) $(CPPFLAGS) -c -o $@ $(CURDIR)/$<

$(c_objects) : obj/$(targetName)/%.o : %.c
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Compiling $<)
	@$(CC) $(CCFLAGS) -c -o $@ $(CURDIR)/$<

$(s_objects): obj/$(targetName)/%.o : %.s
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Assembling $<)
	@$(CC) $(CCFLAGS) $(ASFLAGS) -c -o $@ $(CURDIR)/$<

$(vasm_objects): obj/$(targetName)/%.o : %.asm
	@if not exist "$(call forward-to-backward,$(dir $@))" mkdir $(call forward-to-backward,$(dir $@))
	$(info Assembling $<)
	@$(VASM) $(VASMFLAGS) -o $@ $(CURDIR)/$<
