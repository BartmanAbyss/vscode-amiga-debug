/*
	Copyright � 1995-2017, The AROS Development Team. All rights reserved.
	Modified 2018-20, Bartman/Abyss
	$Id$
*/

#define PROTOTYPES
#define HAVE_STDARG_H

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdint.h>
#include <assert.h>
#include <ctype.h>
#include <errno.h>
#ifndef _MSC_VER
	#include <unistd.h>
	#include <dirent.h>
#endif
#include <fcntl.h>
#include <limits.h>

#include <sys/types.h>
#include <sys/stat.h>

#define F_VERBOSE       (1 << 0)
#define F_NOCONVERT     (1 << 1)
#define F_PCREL         (1 << 2)
#define F_BINARY        (1 << 3)
#define F_STRIP         (1 << 4)

#if defined(_MSC_VER) || defined(WIN32)
	#include <winsock2.h>
	#pragma comment(lib, "ws2_32.lib")
	#define mkdir(path, mode) mkdir(path)
#else
	#include <arpa/inet.h>
	typedef uint32_t ULONG;
	typedef int      BOOL;
#endif
typedef uint8_t  UBYTE;
typedef uint16_t UWORD;
typedef uint32_t IPTR;
typedef int32_t  SIPTR;
typedef char *   STRPTR;

#if !defined(FALSE)&&!defined(TRUE)
#define FALSE 0
#define TRUE (!FALSE)
#endif

/* Memory allocation flags */
#define MEMF_ANY           0L
#define MEMF_PUBLIC        (1L<<0)
#define MEMF_CHIP          (1L<<1)
#define MEMF_FAST          (1L<<2)
#define MEMF_EXECUTABLE    (1L<<4)  /* AmigaOS v4 compatible */
#define MEMF_LOCAL         (1L<<8)
#define MEMF_24BITDMA      (1L<<9)
#define MEMF_KICK          (1L<<10)
#define MEMF_31BIT         (1L<<12) /* Low address space (<2GB). Effective only on 64 bit machines. */
#define MEMF_CLEAR         (1L<<16) /* Explicitly clear memory after allocation */
#define MEMF_LARGEST       (1L<<17)
#define MEMF_REVERSE       (1L<<18)
#define MEMF_TOTAL         (1L<<19)
#define MEMF_HWALIGNED     (1L<<20) /* For AllocMem() - align address and size to physical page boundary */
#define MEMF_SEM_PROTECTED (1L<<20) /* For CreatePool() - add semaphore protection to the pool */
#define MEMF_NO_EXPUNGE    (1L<<31)

#define HUNKF_ADVISORY     (1L<<29)
#define HUNKF_CHIP         (1L<<30)
#define HUNKF_FAST         (1L<<31)
#define HUNKF_MEMFLAGS     (HUNKF_CHIP | HUNKF_FAST)


#define HUNK_CODE	1001
#define HUNK_DATA	1002
#define HUNK_BSS	1003
#define HUNK_RELOC32	1004
#define HUNK_SYMBOL	1008
#define HUNK_END	1010
#define HUNK_HEADER	1011

#define SHT_PROGBITS    1
#define SHT_SYMTAB      2
#define SHT_STRTAB      3
#define SHT_RELA        4
#define SHT_NOBITS      8
#define SHT_REL         9
#define SHT_SYMTAB_SHNDX 18

#define ET_REL          1
#define ET_EXEC		2
#define ET_DYN          3

#define EM_386          3
#define EM_68K          4
#define EM_PPC         20
#define EM_ARM         40
#define EM_X86_64       62      /* AMD x86-64 */

#define R_386_NONE      0
#define R_386_32        1
#define R_386_PC32      2

/* AMD x86-64 relocations.  */
#define R_X86_64_NONE   0       /* No reloc */
#define R_X86_64_64     1       /* Direct 64 bit  */
#define R_X86_64_PC32   2       /* PC relative 32 bit signed */
#define R_X86_64_32     10
#define R_X86_64_32S    11

#define R_68k_NONE      0
#define R_68K_32        1
#define R_68K_PC32      4
#define R_68K_PC16      5

#define R_PPC_NONE      0
#define R_PPC_ADDR32    1
#define R_PPC_ADDR16_LO 4
#define R_PPC_ADDR16_HA 6
#define R_PPC_REL24     10
#define R_PPC_REL32	26
#define R_PPC_REL16_LO  250
#define R_PPC_REL16_HA  252

#define R_ARM_NONE        0
#define R_ARM_PC24        1
#define R_ARM_ABS32       2
#define R_ARM_CALL	  28
#define R_ARM_JUMP24	  29
#define R_ARM_V4BX	  40
#define R_ARM_PREL31	  42
#define R_ARM_MOVW_ABS_NC 43
#define R_ARM_MOVT_ABS	  44

#define STT_NOTYPE	0
#define STT_OBJECT      1
#define STT_FUNC        2
#define STT_SECTION	3
#define STT_FILE	4
#define STT_LOPROC	13
#define STT_HIPROC	15

#define SHN_UNDEF       0
#define SHN_LORESERVE   0xff00
#define SHN_ABS         0xfff1
#define SHN_COMMON      0xfff2
#define SHN_XINDEX      0xffff
#define SHN_HIRESERVE   0xffff

#define SHF_WRITE   	(1 << 0)
#define SHF_ALLOC       (1 << 1)
#define SHF_EXECINSTR   (1 << 2)

#define ELF_ST_TYPE(i)    ((i) & 0x0F)

#define EI_VERSION      6
#define EV_CURRENT      1

#define EI_DATA         5
#define ELFDATA2LSB     1
#define ELFDATA2MSB     2

#define EI_CLASS        4
#define ELFCLASS32      1
#define ELFCLASS64      2               /* 64-bit objects */

#define EI_OSABI        7
#define EI_ABIVERSION   8

#define ELFOSABI_AROS   15

#define PF_X            (1 << 0)

#pragma pack(push)
struct elfheader
{
	UBYTE ident[16];
	UWORD type;
	UWORD machine;
	ULONG version;
	IPTR  entry;
	IPTR  phoff;
	IPTR  shoff;
	ULONG flags;
	UWORD ehsize;
	UWORD phentsize;
	UWORD phnum;
	UWORD shentsize;
	UWORD shnum;
	UWORD shstrndx;
};

struct sheader
{
	ULONG name;
	ULONG type;
	IPTR  flags;
	IPTR  addr;
	IPTR  offset;
	IPTR  size;
	ULONG link;
	ULONG info;
	IPTR  addralign;
	IPTR  entsize;
};

#define PT_LOAD 1

struct pheader
{
	ULONG type;
	ULONG offset;
	IPTR  vaddr;
	IPTR  paddr;
	ULONG filesz;
	ULONG memsz;
	ULONG flags;
	ULONG align;
};

struct symbol
{
	ULONG name;     /* Offset of the name string in the string table */
	IPTR  value;    /* Varies; eg. the offset of the symbol in its hunk */
	IPTR  size;     /* How much memory does the symbol occupy */
	UBYTE info;     /* What kind of symbol is this ? (global, variable, etc) */
	UBYTE other;    /* undefined */
	UWORD shindex;  /* In which section is the symbol defined ? */
};
#pragma pack(pop)

#define ELF_R_SYM(val)        ((val) >> 8)
#define ELF_R_TYPE(val)       ((val) & 0xff)
#define ELF_R_INFO(sym, type) (((sym) << 8) + ((type) & 0xff))

struct relo
{
	IPTR  offset;   /* Address of the relocation relative to the section it refers to */
	IPTR  info;     /* Type of the relocation */
	SIPTR addend;   /* Constant addend used to compute value */
};

/* Note: the conversion below is not in line with ELF specification and is fixed in GNU binutils since 2008
 * See: https://sourceware.org/bugzilla/show_bug.cgi?id=5900
 */
 /* convert section header number to array index */
 /*#define SHINDEX(n) \
	 ((n) < SHN_LORESERVE ? (n) : ((n) <= SHN_HIRESERVE ? 0 : (n) - (SHN_HIRESERVE + 1 - SHN_LORESERVE)))*/

	 /* convert section header array index to section number */
	 /*#define SHNUM(i) \
		 ((i) < SHN_LORESERVE ? (i) : (i) + (SHN_HIRESERVE + 1 - SHN_LORESERVE))*/

/* m68k Machine's native values */
#define AROS_ELF_CLASS ELFCLASS32
#define AROS_ELF_DATA ELFDATA2MSB
#define AROS_ELF_MACHINE EM_68K
#define AROS_ELF_REL     SHT_RELA


#if defined(HAVE_STDARG_H) && defined(__STDC__) && __STDC__
#   include <stdarg.h>
#   define VA_START(args, lastarg) va_start(args, lastarg)
#else
#   include <varargs.h>
#   define VA_START(args, lastarg) va_start(args)
#endif

#ifdef PROTOTYPES
#   define PARAMS(x) x
#else
#   define PARAMS(x) ()
#endif /* PROTOTYPES */

static void set_error(int err)
{
	errno = err;
}

#if (defined(DEBUG) && DEBUG) || defined(_DEBUG)
#define D(x)	x
#define DB2(x)	x
#else
#define D(x)
#define DB2(x)
#endif
#ifdef _MSC_VER
	#define bug(fmt,...)	fprintf(stderr, fmt ,__VA_ARGS__ )
#else
	#define bug(fmt,args...)	fprintf(stderr, fmt ,##args )
#endif

static int must_swap = -1;

static void eh_fixup(struct elfheader *eh)
{
	/* Endian swaps */
	if(eh->type >= 256) {
		must_swap = 1;
		eh->type = ntohs(eh->type);
		eh->machine = ntohs(eh->machine);
		eh->version = ntohl(eh->version);
		eh->entry = ntohl(eh->entry);
		eh->phoff = ntohl(eh->phoff);
		eh->shoff = ntohl(eh->shoff);
		eh->flags = ntohl(eh->flags);
		eh->ehsize = ntohs(eh->ehsize);
		eh->phentsize = ntohs(eh->phentsize);
		eh->phnum = ntohs(eh->phnum);
		eh->shentsize = ntohs(eh->shentsize);
		eh->shnum = ntohs(eh->shnum);
		eh->shstrndx = ntohs(eh->shstrndx);
	} else {
		must_swap = 0;
	}
}

static void sh_fixup(struct sheader *sh, int n)
{
	if(must_swap == 0)
		return;

	for(; n > 0; n--, sh++) {
		sh->name = ntohl(sh->name);
		sh->type = ntohl(sh->type);
		sh->flags = ntohl(sh->flags);
		sh->addr = ntohl(sh->addr);
		sh->offset = ntohl(sh->offset);
		sh->size = ntohl(sh->size);
		sh->link = ntohl(sh->link);
		sh->info = ntohl(sh->info);
		sh->addralign = ntohl(sh->addralign);
		sh->entsize = ntohl(sh->entsize);
	}
}

static void rel_fixup(struct relo *rel)
{
	if(must_swap == 0)
		return;

	rel->offset = ntohl(rel->offset);
	rel->info = ntohl(rel->info);
	rel->addend = ntohl(rel->addend);
}

void sym_fixup(struct symbol *sym)
{
	if(must_swap == 0)
		return;

	sym->name = ntohl(sym->name);
	sym->value = ntohl(sym->value);
	sym->size = ntohl(sym->size);
	sym->shindex = ntohs(sym->shindex);
}

static void *load_block(int file, ULONG offset, ULONG size)
{
	ULONG lsize = (size + sizeof(ULONG) - 1) / sizeof(ULONG);
	D(bug("[ELF2HUNK] Load Block (size=%d)\n", (int)size));
	void *block = malloc(lsize * sizeof(ULONG));
	if(block) {
		lseek(file, offset, SEEK_SET);
		if(read(file, block, size) == size) {
			return block;
		}

		free(block);
		set_error(EIO);
	} else
		set_error(ENOMEM);

	return NULL;
}

static ULONG read_shnum(int file, struct elfheader *eh)
{
	ULONG shnum = eh->shnum;

	/* the ELF header only uses 16 bits to store the count of section headers,
	 * so it can't handle more than 65535 headers. if the count is 0, and an
	 * offset is defined, then the real count can be found in the first
	 * section header (which always exists).
	 *
	 * similarly, if the string table index is SHN_XINDEX, then the actual
	 * index is found in the first section header also.
	 *
	 * see the System V ABI 2001-04-24 draft for more details.
	 */
	if(eh->shnum == 0)
	{
		struct sheader sh;

		if(eh->shoff == 0) {
			set_error(ENOEXEC);
			return 0;
		}

		lseek(file, eh->shoff, SEEK_SET);
		if(read(file, &sh, sizeof(sh)) != sizeof(sh))
			return 0;

		sh_fixup(&sh, 1);

		/* wider section header count is in the size field */
		shnum = sh.size;

		/* sanity, if they're still invalid then this isn't elf */
		if(shnum == 0)
			set_error(ENOEXEC);
	}

	return shnum;
}

static int load_header(int file, struct elfheader *eh)
{
	lseek(file, 0, SEEK_SET);
	if(read(file, eh, sizeof(struct elfheader)) != sizeof(struct elfheader)) {
		D(bug("[ELF2HUNK] Can't read the %d byte ELF header\n", (int)sizeof(struct elfheader)));
		return 0;
	}

	eh_fixup(eh);

	if(eh->ident[0] != 0x7f || eh->ident[1] != 'E' ||
		eh->ident[2] != 'L' || eh->ident[3] != 'F') {
		D(bug("[ELF2HUNK] Not an ELF object\n"));
		return 0;
	}
	D(bug("[ELF2HUNK] ELF object\n"));

	/* WANT_CLASS should be defined for your target */
	if(eh->ident[EI_CLASS] != AROS_ELF_CLASS ||
		eh->ident[EI_VERSION] != EV_CURRENT ||
		(eh->type != ET_REL && eh->type != ET_EXEC && eh->type != ET_DYN) ||
		eh->ident[EI_DATA] != AROS_ELF_DATA ||
		eh->machine != AROS_ELF_MACHINE)
	{
		D(bug("[ELF2HUNK] Object is of wrong type\n"));
		D(bug("[ELF2HUNK] EI_CLASS   is %d - should be %d\n", eh->ident[EI_CLASS], AROS_ELF_CLASS));
		D(bug("[ELF2HUNK] EI_VERSION is %d - should be %d\n", eh->ident[EI_VERSION], EV_CURRENT));
		D(bug("[ELF2HUNK] type       is %d - should be %d or %d or %d\n", eh->type, ET_REL, ET_EXEC, ET_DYN));
		D(bug("[ELF2HUNK] EI_DATA    is %d - should be %d\n", eh->ident[EI_DATA], AROS_ELF_DATA));
		D(bug("[ELF2HUNK] machine    is %d - should be %d\n", eh->machine, AROS_ELF_MACHINE));

		set_error(ENOEXEC);
		return 0;
	}

	return 1;
}

struct hunkheader {
	ULONG type;
	ULONG memflags; /* Memory flags */
	ULONG size;	/* Size in ULONGs */
	void *data;
	ULONG relocs;
	int   hunk;	/* Allocatable hunk ID */
	struct hunkreloc {
		ULONG shid;	/* ELF hunk base to add to... */
		ULONG offset;	/* offset in this hunk. */
		const char *symbol;
	} *reloc;
};

static int relocate
(
	struct elfheader  *eh,
	struct sheader    *sh,
	ULONG              shrel_idx,
	int                symtab_shndx,
	struct relo       *rel,
	struct hunkheader **hh
)
{
	struct sheader *shrel = &sh[shrel_idx];
	struct sheader *shsymtab = &sh[shrel->link];
	struct sheader *toreloc = &sh[shrel->info];

	struct symbol *symtab = (struct symbol *)hh[shrel->link]->data;
	struct hunkheader *h = hh[shrel->info];

	/*
	 * Ignore relocs if the target section has no allocation. that can happen
	 * eg. with a .debug PROGBITS and a .rel.debug section
	 */
	D(bug("[ELF2HUNK] relocate(): sh[%d].flags = 0x%x, .size = %d\n", (int)(shrel->info), (int)toreloc->flags, (int)toreloc->size));
	if(!(toreloc->flags & SHF_ALLOC))
		return 1;

	ULONG numrel = shrel->size / shrel->entsize;
	ULONG i;
	ULONG hrels;

	hrels = h->relocs;
	h->relocs += numrel;
	h->reloc = realloc(h->reloc, h->relocs * sizeof(struct hunkreloc));
	struct hunkreloc *hrel = &h->reloc[hrels];

	for(i = 0; i < numrel; i++, rel++)
	{
		struct symbol sym;
		ULONG offset;
		ULONG shindex;
		ULONG shid = 0;
		ULONG value = 0;
		const char *symname;

		rel_fixup(rel);

#ifdef __arm__
		/*
		 * R_ARM_V4BX are actually special marks for the linker.
		 * They even never have a target (shindex == SHN_UNDEF),
		 * so we simply ignore them before doing any checks.
		 */
		if(ELF_R_TYPE(rel->info) == R_ARM_V4BX)
			continue;
#endif

		sym = symtab[ELF_R_SYM(rel->info)];
		sym_fixup(&sym);
		offset = rel->offset;
		symname = (const char *)((uintptr_t)hh[shsymtab->link]->data + sym.name);

		if(sym.shindex != SHN_XINDEX)
			shindex = sym.shindex;

		else {
			if(symtab_shndx < 0) {
				bug("[ELF2HUNK] got symbol with shndx 0xfff, but there's no symtab shndx table\n");
				set_error(EINVAL);
				return 0;
			}
			shindex = ntohl(((ULONG *)hh[symtab_shndx]->data)[ELF_R_SYM(rel->info)]);
		}

		if(eh->type == ET_EXEC) {
			D(bug("sh[%d].base=%x offset %x -= %x => %x\n", shrel->info, sh[shrel->info].addr, offset, sh[shrel->info].addr, offset - sh[shrel->info].addr));
			offset -= sh[shrel->info].addr;
		}

		D(bug("[ELF2HUNK] Processing section %d symbol '%s' value %x add %x\n", (int)shindex, symname, sym.value, rel->addend));

		switch(shindex)
		{
		case SHN_UNDEF:
			if(ELF_R_TYPE(rel->info) != 0) {
				bug("[ELF2HUNK] SHN_UNDEF symbol '%s', type %d unsupported\n", symname, (int)ELF_R_TYPE(rel->info));
				set_error(EINVAL);
				return 0;
			}
			break;

		case SHN_COMMON:
			bug("[ELF2HUNK] SHN_COMMON symbol '%s' unsupported\n", symname);
			set_error(EINVAL);
			return 0;

		case SHN_ABS:
			shid = ~0; value = sym.value;
			break;

		default:
			shid = shindex;
			value = sym.value;
			break;
		}

		switch(ELF_R_TYPE(rel->info))
		{
		case R_68K_32:
			value += rel->addend;
			break;

		case R_68K_PC32:
			value += rel->addend - offset;
			break;

		case R_68K_PC16:
			bug("[ELF2HUNK] Unsupported relocation type R_68K_PC16,\n");
			bug("[ELF2HUNK]    for symbol '%s'\n", symname);
			set_error(EINVAL);
			return 0;
			break;

		case R_68k_NONE:
			shid = ~0;
			break;

		default:
			bug("[ELF2HUNK] Unrecognized relocation type %d %d,\n", (int)i, (int)ELF_R_TYPE(rel->info));
			bug("[ELF2HUNK]    for symbol '%s'\n", symname);
			set_error(EINVAL);
			return 0;
		}

		// skip relocations to empty sections
		if(shid != ~0 && !hh[shid]) {
			*(ULONG*)((uintptr_t)h->data + offset) = ~0;
			h->relocs--;
			continue;
		}

		if(eh->type == ET_EXEC) {
			value -= sh[shindex].addr;
			D(bug("ET_EXEC %x -= %x => %x\n", ntohl(*(ULONG *)((uintptr_t)h->data + offset)), sh[shindex].addr, value));
			*(ULONG *)((uintptr_t)h->data + offset) = 0;
		}
		D(bug("[ELF2HUNK]   shid %d, offset 0x%x: base 0x%x\n", (int)shid, (int)offset, (int)value));
		*(ULONG *)((uintptr_t)h->data + offset) = htonl(value + ntohl(*(ULONG *)((uintptr_t)h->data + offset)));
		// SHN_ABS don't need relocation, we already modified it inplace
		if(shid == ~0) {
			h->relocs--;
			continue;
		}
		hrel->shid = shid;
		hrel->offset = offset;
		hrel->symbol = symname;
		hrel++;
	}

	return 1;
}

int reloc_cmp(const void *a, const void *b)
{
	const struct hunkreloc *ha = a, *hb = b;

	if(ha->shid != hb->shid)
		return hb->shid - ha->shid;
	return hb->offset - ha->offset;
}

static int wlong(int fd, ULONG val)
{
	val = htonl(val);
	return write(fd, &val, sizeof(val));
}

int sym_dump(int hunk_fd, struct elfheader* eh, struct sheader *sh, struct hunkheader **hh, int shid, int symtabndx, int flags)
{
	if(flags & F_STRIP)
		return 1;

	int i, err, syms;
	struct symbol *sym = hh[symtabndx]->data;
	struct sheader *symtab = &sh[symtabndx];

	syms = symtab->size / sizeof(struct symbol);

	if(syms == 0)
		return 1;

	wlong(hunk_fd, HUNK_SYMBOL);
	//    wlong(hunk_fd, syms);

	/* Dump symbols for this hunk */
	for(i = 0; i < syms; i++) {
		struct symbol s;
		const char *name;
		int lsize;

		s = sym[i];
		sym_fixup(&s);

		if(s.shindex != shid)
			continue;

		if(eh->type == ET_EXEC)
			s.value -= sh[shid].addr;

		name = (const char *)((uintptr_t)hh[symtab->link]->data + s.name);
		if(name[0] == '\0')
			continue;
		char name2[512];
		snprintf(name2, sizeof(name2), "%s@%x", name, s.size);
		if(flags & F_VERBOSE)
			printf("\t0x%08x: %s\n", (int)s.value, name2);
		lsize = (strlen(name2) + 4) / 4;
		wlong(hunk_fd, lsize);
		err = write(hunk_fd, name2, lsize * 4);
		if(err < 0)
			return 0;
		wlong(hunk_fd, s.value);
	}
	wlong(hunk_fd, 0);

	return 1;
}

static void reloc_dump(int hunk_fd, struct hunkheader **hh, int h)
{
	int i;

	if(hh[h]->relocs == 0)
		return;

	/* Sort the relocations by reference hunk id */
	qsort(hh[h]->reloc, hh[h]->relocs, sizeof(hh[h]->reloc[0]), reloc_cmp);

	wlong(hunk_fd, HUNK_RELOC32);
	D(bug("\tHUNK_RELOC32: %d relocations\n", (int)hh[h]->relocs));

	for(i = 0; i < hh[h]->relocs; ) {
		int count;
		int shid = hh[h]->reloc[i].shid;
		for(count = i; count < hh[h]->relocs; count++)
			if(hh[h]->reloc[count].shid != shid)
				break;
		count -= i;
		wlong(hunk_fd, count);
		D(bug("\t  %d relocations relative to Hunk %d\n", count, hh[shid]->hunk));
		/* Convert from ELF hunk ID to AOS hunk ID */
		wlong(hunk_fd, hh[shid]->hunk);
		for(; count > 0; i++, count--) {
			D(bug("\t\t%d: 0x%08x %s\n", i, (int)hh[h]->reloc[i].offset, hh[h]->reloc[i].symbol));
			wlong(hunk_fd, hh[h]->reloc[i].offset);
		}
	}
	wlong(hunk_fd, 0);
}

static int copy_to(int in, int out)
{
	static char buff[64 * 1024];
	int len, err = 0;

	do {
		len = read(in, buff, sizeof(buff));
		if(len < 0) {
			perror("Can't read from input file\n");
			err = len;
		}
		if(len == 0)
			break;
	} while((err = write(out, buff, len)) == len);

	if(err < 0) {
		perror("Can't write to output file\n");
		return -errno;
	}

	return 0;
}

int elf2hunk(int file, int hunk_fd, const char *libname, int flags)
{
	const char *names[3] = { "CODE", "DATA", "BSS" };
	struct hunkheader **hh;
	struct elfheader  eh;
	struct sheader   *sh;
	char **strtab = NULL;
	int symtab_shndx = -1;
	int err;
	ULONG  i;
	BOOL   exec_hunk_seen = FALSE;
	ULONG  int_shnum;
	int hunks = 0;

	/* load and validate ELF header */
	D(bug("Load header\n"));
	if((flags & F_NOCONVERT) || !load_header(file, &eh)) {
		/* If it's not an ELF, just copy it.
		 *
		 * This simplifies a number of makefiles
		 * for the m68k-amiga boot and ISO creation
		 */
		lseek(file, 0, SEEK_SET);
		return (copy_to(file, hunk_fd) == 0) ? EXIT_SUCCESS : EXIT_FAILURE;
	}

	D(bug("Read SHNum\n"));
	int_shnum = read_shnum(file, &eh);
	if(!int_shnum)
		return EXIT_FAILURE;

	/* load section headers */
	D(bug("Load %d Section Headers @0x%08x\n", int_shnum, (int)eh.shoff));
	if(!(sh = load_block(file, eh.shoff, int_shnum * eh.shentsize)))
		return EXIT_FAILURE;

	sh_fixup(sh, int_shnum);

	/* Looks like we have a valid executable. Generate a
	 * HUNK header set. Not all may be filled in.
	 */
	hh = calloc(sizeof(*hh), int_shnum);
	strtab = calloc(sizeof(*strtab), int_shnum);

	/* Look for the string table */
	D(bug("Look for string tables\n"));
	for(i = 0; i < int_shnum; i++) {
		if(sh[i].type == SHT_STRTAB) {
			strtab[i] = load_block(file, sh[i].offset, sh[i].size);
			D(bug("> [%d] offset=%d size=%d\n", i, sh[i].offset, sh[i].size));
		}
	}

	/* Iterate over the section headers in order to do some stuff... */
	D(bug("Look for symbol tables\n"));
	for(i = 0; i < int_shnum; i++)
	{
		/*
		   Load the symbol and string table(s).

		   NOTICE: the ELF standard, at the moment (Nov 2002) explicitly states
				   that only one symbol table per file is allowed. However, it
				   also states that this may change in future... we already handle it.
		*/
		if(flags & F_VERBOSE)
			printf("sh[%2d].type = 0x%08x, .offset = 0x%08x, .size = 0x%08x, .name = '%s'\n",
			(int)i, (int)sh[i].type, (int)sh[i].offset, (int)sh[i].size, strtab[eh.shstrndx] ? (strtab[eh.shstrndx] + sh[i].name) : "");
		if(sh[i].type == SHT_SYMTAB || sh[i].type == SHT_STRTAB || sh[i].type == SHT_SYMTAB_SHNDX) {
			hh[i] = calloc(sizeof(struct hunkheader), 1);
			hh[i]->type = (sh[i].type == SHT_SYMTAB) ? HUNK_SYMBOL : 0;
			hh[i]->memflags = 0;
			hh[i]->hunk = -1;
			hh[i]->data = load_block(file, sh[i].offset, sh[i].size);
			if(!hh[i]->data)
				goto error;

			if(sh[i].type == SHT_SYMTAB_SHNDX) {
				if(symtab_shndx == -1)
					symtab_shndx = i;
				else
					printf("[ELF2HUNK] file contains multiple symtab shndx tables. only using the first one\n");
			}
		} else {
			/* Load the section in memory if needed, and make an hunk out of it */
			if((sh[i].flags & SHF_ALLOC) && sh[i].size > 0) {
				hh[i] = calloc(sizeof(struct hunkheader), 1);
				hh[i]->size = sh[i].size;
				hh[i]->hunk = hunks++;

				if(sh[i].type == SHT_NOBITS) {
					/* BSS area */
					hh[i]->type = HUNK_BSS;
					hh[i]->memflags = 0;
					hh[i]->data = NULL;
				} else {
					if(sh[i].flags & SHF_EXECINSTR) {
						hh[i]->type = HUNK_CODE;
						exec_hunk_seen = TRUE;
					} else {
						hh[i]->type = HUNK_DATA;
					}
					hh[i]->data = load_block(file, sh[i].offset, sh[i].size);
				}

				if(strtab[eh.shstrndx]) {
					const char* nameext;

					//D(bug("section %d '%s'\n", sh[i].name, strtab[eh.shstrndx] + sh[i].name));
					nameext = strrchr(strtab[eh.shstrndx] + sh[i].name, '.');
					if(nameext) {
						if(strcmp(nameext, ".MEMF_CHIP") == 0) {
							hh[i]->memflags |= MEMF_CHIP;
						} else if(strcmp(nameext, ".MEMF_LOCAL") == 0) {
							hh[i]->memflags |= MEMF_LOCAL;
						} else if(strcmp(nameext, ".MEMF_KICK") == 0) {
							hh[i]->memflags |= MEMF_KICK;
						} else if(strcmp(nameext, ".MEMF_FAST") == 0) {
							hh[i]->memflags |= MEMF_FAST;
						}
					}
				}
			}
		}
	}

	if(flags & F_PCREL) {
		// calc total size
		ULONG total_size = 0;
		for(i = 0; i < int_shnum; i++) {
			if(hh[i] == NULL || hh[i]->hunk < 0)
				continue;

			ULONG end_of_section = sh[i].addr + sh[i].size;
			if(end_of_section > total_size)
				total_size = end_of_section;
		}

		total_size = (total_size + 3) & ~3; // round up to longword
		if(flags & F_VERBOSE)
			printf("Total size: $%08x\n", total_size);

		// create combined data
		char* total_data = calloc(1, total_size);

		for(i = 0; i < int_shnum; i++) {
			if(hh[i] == NULL || hh[i]->hunk < 0)
				continue;

			if(flags & F_VERBOSE)
				printf("HUNK_%d: addr = $%08x, size = $%08x\n", hh[i]->type, sh[i].addr, hh[i]->size);

			if(!hh[i]->data)
				continue;

			memcpy(total_data + sh[i].addr, hh[i]->data, hh[i]->size);
		}

		if(flags & F_BINARY) {
			// write combined data
			err = write(hunk_fd, total_data, total_size);
			if(err < 0)
				return EXIT_FAILURE;
		} else {
			wlong(hunk_fd, HUNK_HEADER);
			wlong(hunk_fd, 0); // No name
			wlong(hunk_fd, 1);
			wlong(hunk_fd, 0); // First hunk is #0
			wlong(hunk_fd, 0); // Last hunk is #0 

			wlong(hunk_fd, total_size / 4); // hunk size #0 in long words

			wlong(hunk_fd, HUNK_CODE);
			wlong(hunk_fd, total_size / 4);

			// write combined data
			err = write(hunk_fd, total_data, total_size);
			if(err < 0)
				return EXIT_FAILURE;
			wlong(hunk_fd, HUNK_END);
		}

		free(total_data);
	} else {
		/* Relocate the sections */
		D(bug("Convert relocation tables\n"));
		for(i = 0; i < int_shnum; i++)
		{
			/* Does this relocation section refer to a hunk? If so, addr must be != 0 */
			if((sh[i].type == AROS_ELF_REL) && hh[sh[i].info] && hh[sh[i].info]->data)
			{
				void *reloc = load_block(file, sh[i].offset, sh[i].size);

				if(!relocate(&eh, sh, i, symtab_shndx, reloc, hh))
					return EXIT_FAILURE;

				free(reloc);
			}
		}

		if(flags & F_VERBOSE)
			printf("HUNK_HEADER: '%s', hunks=%d, first=%d, last=%d\n", libname, hunks, 0, hunks - 1);

		wlong(hunk_fd, HUNK_HEADER);
		if(libname == NULL) {
			wlong(hunk_fd, 0);	/* No name */
		} else {
			int lsize = (strlen(libname) + 4) / 4;
			wlong(hunk_fd, lsize);
			err = write(hunk_fd, libname, lsize * 4);
			if(err < 0)
				return EXIT_FAILURE;
		}
		wlong(hunk_fd, hunks);
		wlong(hunk_fd, 0);	/* First hunk is #0 */
		wlong(hunk_fd, hunks - 1); /* Last hunk is hunks-1 */

		/* Write all allocatable hunk sizes */
		for(i = 0; i < int_shnum; i++) {
			ULONG count;

			if(hh[i] == NULL || hh[i]->hunk < 0)
				continue;

			count = (hh[i]->size + 4) / 4;
			switch(hh[i]->memflags) {
			case MEMF_CHIP:
				count |= HUNKF_CHIP;
				break;
			case MEMF_FAST:
				count |= HUNKF_FAST;
				break;
			case 0:
				break;
			default:
				count |= HUNKF_MEMFLAGS;
				break;
			}

			if(flags & F_VERBOSE)
				printf("\tHunk #%d (ELF section #%d '%s'), %s, lsize=%d%s%s\n", hh[i]->hunk, i, strtab[eh.shstrndx] ? (strtab[eh.shstrndx] + sh[i].name) : "", names[hh[i]->type - HUNK_CODE], (int)(hh[i]->size + 4) / 4, (count & HUNKF_CHIP) ? ", HUNKF_CHIP " : "", (count & HUNKF_FAST) ? ", HUNKF_FAST" : "");
			wlong(hunk_fd, count);

			if((count & HUNKF_MEMFLAGS) == HUNKF_MEMFLAGS)
				wlong(hunk_fd, hh[i]->memflags | MEMF_PUBLIC | MEMF_CLEAR);
		}

		/* Write all hunks */
		for(i = hunks = 0; i < int_shnum; i++) {
			int s;

			if(hh[i] == NULL || hh[i]->hunk < 0)
				continue;

			wlong(hunk_fd, hh[i]->type);
			wlong(hunk_fd, (hh[i]->size + 4) / 4);

			switch(hh[i]->type) {
			case HUNK_BSS:
				if(flags & F_VERBOSE)
					printf("#%d HUNK_BSS: %d longs\n", hh[i]->hunk, (int)((hh[i]->size + 4) / 4));
				for(s = 0; s < int_shnum; s++) {
					if(hh[s] && hh[s]->type == HUNK_SYMBOL)
						sym_dump(hunk_fd, &eh, sh, hh, i, s, flags);
				}

				wlong(hunk_fd, HUNK_END);
				hunks++;
				break;
			case HUNK_CODE:
			case HUNK_DATA:
				if(flags & F_VERBOSE)
					printf("#%d HUNK_%s: %d longs\n", hh[i]->hunk, hh[i]->type == HUNK_CODE ? "CODE" : "DATA", (int)((hh[i]->size + 4) / 4));
				err = write(hunk_fd, hh[i]->data, ((hh[i]->size + 4) / 4) * 4);

				if(err < 0)
					return EXIT_FAILURE;
				for(s = 0; s < int_shnum; s++) {
					if(hh[s] && hh[s]->type == HUNK_SYMBOL)
						sym_dump(hunk_fd, &eh, sh, hh, i, s, flags);
				}
				reloc_dump(hunk_fd, hh, i);
				wlong(hunk_fd, HUNK_END);
				if(flags & F_VERBOSE)
					printf("\tHUNK_END\n");
				break;
			default:
				printf("Unsupported allocatable hunk type %d\n", (int)hh[i]->type);
				return EXIT_FAILURE;
			}
		}
	} // F_PCREL

	/* Free all blocks */
	for(i = 0; i < int_shnum; i++) {
		if(hh[i]) {
			if(hh[i]->data)
				free(hh[i]->data);
			if(hh[i]->reloc)
				free(hh[i]->reloc);
			free(hh[i]);
		}
		if(strtab[i])
			free(strtab[i]);
	}
	free(hh);
	free(sh);
	free(strtab);

	D(bug("All good, all done.\n"));
	return EXIT_SUCCESS;

error:
	return EXIT_FAILURE;
}

static int copy(const char *src, const char *dst, int flags);

static BOOL valid_dir(const char *dir)
{
	/* Don't convert anything in a Developer directory */
	if(strcasecmp(dir, "Developer") == 0)
		return FALSE;
	return TRUE;
}

#ifndef _MSC_VER
static int copy_dir(const char *src, const char *dst, int flags)
{
	DIR *sdir;
	struct dirent *de;
	char spath[PATH_MAX], dpath[PATH_MAX];
	char *sp, *dp;
	int sleft, dleft;
	int err = EXIT_SUCCESS;

	sdir = opendir(src);
	if(sdir == NULL) {
		perror(src);
		return EXIT_FAILURE;
	}

	snprintf(spath, sizeof(spath), "%s/", src);
	spath[sizeof(spath) - 1] = 0;
	sp = &spath[strlen(spath)];
	sleft = &spath[sizeof(spath) - 1] - sp;

	snprintf(dpath, sizeof(dpath), "%s/", dst);
	dpath[sizeof(dpath) - 1] = 0;
	dp = &dpath[strlen(dpath)];
	dleft = &dpath[sizeof(dpath) - 1] - dp;

	while((de = readdir(sdir)) != NULL) {
		int eflags = 0;

		if((strcmp(de->d_name, ".") == 0) ||
			(strcmp(de->d_name, "..") == 0))
			continue;

		/* Don't convert anything if its an invalid directory */
		if(!valid_dir(de->d_name))
			eflags |= F_NOCONVERT;

		strncpy(sp, de->d_name, sleft);
		sp[sleft - 1] = 0;
		strncpy(dp, de->d_name, dleft);
		dp[dleft - 1] = 0;
		err = copy(spath, dpath, flags | eflags);
		if(err != EXIT_SUCCESS)
			break;
	}

	closedir(sdir);

	return err;
}
#endif

static int copy(const char *src, const char *dst, int flags)
{
	int src_fd, hunk_fd;
	struct stat st;
	int mode, ret;

	if(flags & F_VERBOSE)
		printf("%s -> %s\n", src, dst);

	if(stat(src, &st) >= 0) {
		mode = st.st_mode;
	} else {
		mode = 0755;
	}

#ifndef _MSC_VER
	if(S_ISDIR(mode)) {
		unlink(dst);
		mkdir(dst, mode);
		return copy_dir(src, dst, flags);
	}
#endif

	src_fd = open(src, O_RDONLY | O_BINARY);
	if(src_fd < 0) {
		perror(src);
		return EXIT_FAILURE;
	}

	if(strcmp(dst, "-") == 0)
		hunk_fd = 1; /* stdout */
	else {
		_unlink(dst);
		hunk_fd = open(dst, O_RDWR | O_CREAT | O_TRUNC | O_BINARY, mode);
	}
	if(hunk_fd < 0) {
		perror(dst);
		return EXIT_FAILURE;
	}

	ret = elf2hunk(src_fd, hunk_fd, NULL, flags);
	if(ret != 0)
		perror(src);

	close(src_fd);
	if(hunk_fd != 1)
		close(hunk_fd);

	return ret;
}

int main(int argc, char **argv)
{
	int flags = 0;

	int i;
	for(i = 3; i < argc; i++) {
		if(strcmp(argv[i], "-v") == 0)
			flags |= F_VERBOSE;
		if(strcmp(argv[i], "-pcrel") == 0)
			flags |= F_PCREL;
		if(strcmp(argv[i], "-bin") == 0)
			flags |= F_BINARY;
		if(strcmp(argv[i], "-s") == 0)
			flags |= F_STRIP;
	}

	if(argc < 3) {
		fprintf(stderr, "Copyright (c) 1995-2017, The AROS Development Team. All rights reserved.\nModified 2018-2020, Bartman/Abyss\n\n");
		fprintf(stderr, "Usage:\n%s file.elf file.hunk [-v] [-pcrel] [-bin] [-s]\n", argv[0]);
		#ifndef _MSC_VER
			fprintf(stderr, "%s src-dir dest-dir\n", argv[0]);
		#endif
		fprintf(stderr, "\t-v: verbose\n");
		fprintf(stderr, "\t-pcrel: PC-Relative: merge all sections\n");
		fprintf(stderr, "\t-bin: PC-Relative: output binary instead of hunk (use with -pcrel)\n");
		fprintf(stderr, "\t-s: strip symbols\n");
		return EXIT_FAILURE;
	}

	return copy(argv[1], argv[2], flags);
}
