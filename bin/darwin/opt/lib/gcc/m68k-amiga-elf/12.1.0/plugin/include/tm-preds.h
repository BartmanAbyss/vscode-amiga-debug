/* Generated automatically by the program 'build/genpreds'
   from the machine description file '../../gcc/gcc/config/m68k/m68k.md'.  */

#ifndef GCC_TM_PREDS_H
#define GCC_TM_PREDS_H

#ifdef HAVE_MACHINE_MODES
extern bool general_operand (rtx, machine_mode);
extern bool address_operand (rtx, machine_mode);
extern bool register_operand (rtx, machine_mode);
extern bool pmode_register_operand (rtx, machine_mode);
extern bool scratch_operand (rtx, machine_mode);
extern bool immediate_operand (rtx, machine_mode);
extern bool const_int_operand (rtx, machine_mode);
extern bool const_double_operand (rtx, machine_mode);
extern bool nonimmediate_operand (rtx, machine_mode);
extern bool nonmemory_operand (rtx, machine_mode);
extern bool push_operand (rtx, machine_mode);
extern bool pop_operand (rtx, machine_mode);
extern bool memory_operand (rtx, machine_mode);
extern bool indirect_operand (rtx, machine_mode);
extern bool ordered_comparison_operator (rtx, machine_mode);
extern bool comparison_operator (rtx, machine_mode);
extern bool general_src_operand (rtx, machine_mode);
extern bool nonimmediate_src_operand (rtx, machine_mode);
extern bool memory_src_operand (rtx, machine_mode);
extern bool not_sp_operand (rtx, machine_mode);
extern bool pcrel_address (rtx, machine_mode);
extern bool const_uint32_operand (rtx, machine_mode);
extern bool const_sint32_operand (rtx, machine_mode);
extern bool m68k_cstore_comparison_operator (rtx, machine_mode);
extern bool extend_operator (rtx, machine_mode);
extern bool symbolic_operand (rtx, machine_mode);
extern bool const_call_operand (rtx, machine_mode);
extern bool call_operand (rtx, machine_mode);
extern bool const_sibcall_operand (rtx, machine_mode);
extern bool sibcall_operand (rtx, machine_mode);
extern bool post_inc_operand (rtx, machine_mode);
extern bool pre_dec_operand (rtx, machine_mode);
extern bool const0_operand (rtx, machine_mode);
extern bool const1_operand (rtx, machine_mode);
extern bool m68k_comparison_operand (rtx, machine_mode);
extern bool movsi_const0_operand (rtx, machine_mode);
extern bool non_symbolic_call_operand (rtx, machine_mode);
extern bool fp_src_operand (rtx, machine_mode);
extern bool addq_subq_operand (rtx, machine_mode);
extern bool equality_comparison_operator (rtx, machine_mode);
extern bool reg_or_pow2_m1_operand (rtx, machine_mode);
extern bool pow2_m1_operand (rtx, machine_mode);
extern bool pc_or_label_operand (rtx, machine_mode);
extern bool swap_peephole_relational_operator (rtx, machine_mode);
extern bool address_reg_operand (rtx, machine_mode);
#endif /* HAVE_MACHINE_MODES */

#define CONSTRAINT_NUM_DEFINED_P 1
enum constraint_num
{
  CONSTRAINT__UNKNOWN = 0,
  CONSTRAINT_r,
  CONSTRAINT_a,
  CONSTRAINT_d,
  CONSTRAINT_f,
  CONSTRAINT_I,
  CONSTRAINT_J,
  CONSTRAINT_K,
  CONSTRAINT_L,
  CONSTRAINT_M,
  CONSTRAINT_N,
  CONSTRAINT_O,
  CONSTRAINT_P,
  CONSTRAINT_m,
  CONSTRAINT_o,
  CONSTRAINT_Q,
  CONSTRAINT_p,
  CONSTRAINT_R,
  CONSTRAINT_G,
  CONSTRAINT_H,
  CONSTRAINT_T,
  CONSTRAINT_W,
  CONSTRAINT_Cs,
  CONSTRAINT_Ci,
  CONSTRAINT_C0,
  CONSTRAINT_Cj,
  CONSTRAINT_Cu,
  CONSTRAINT_CQ,
  CONSTRAINT_CW,
  CONSTRAINT_CZ,
  CONSTRAINT_CS,
  CONSTRAINT_V,
  CONSTRAINT__l,
  CONSTRAINT__g,
  CONSTRAINT_S,
  CONSTRAINT_U,
  CONSTRAINT_Ap,
  CONSTRAINT_i,
  CONSTRAINT_s,
  CONSTRAINT_n,
  CONSTRAINT_E,
  CONSTRAINT_F,
  CONSTRAINT_X,
  CONSTRAINT_Ac,
  CONSTRAINT__LIMIT
};

extern enum constraint_num lookup_constraint_1 (const char *);
extern const unsigned char lookup_constraint_array[];

/* Return the constraint at the beginning of P, or CONSTRAINT__UNKNOWN if it
   isn't recognized.  */

static inline enum constraint_num
lookup_constraint (const char *p)
{
  unsigned int index = lookup_constraint_array[(unsigned char) *p];
  return (index == UCHAR_MAX
          ? lookup_constraint_1 (p)
          : (enum constraint_num) index);
}

extern bool (*constraint_satisfied_p_array[]) (rtx);

/* Return true if X satisfies constraint C.  */

static inline bool
constraint_satisfied_p (rtx x, enum constraint_num c)
{
  int i = (int) c - (int) CONSTRAINT_I;
  return i >= 0 && constraint_satisfied_p_array[i] (x);
}

static inline bool
insn_extra_register_constraint (enum constraint_num c)
{
  return c >= CONSTRAINT_r && c <= CONSTRAINT_f;
}

static inline bool
insn_extra_memory_constraint (enum constraint_num c)
{
  return c >= CONSTRAINT_m && c <= CONSTRAINT_Q;
}

static inline bool
insn_extra_special_memory_constraint (enum constraint_num)
{
  return false;
}

static inline bool
insn_extra_relaxed_memory_constraint (enum constraint_num)
{
  return false;
}

static inline bool
insn_extra_address_constraint (enum constraint_num c)
{
  return c >= CONSTRAINT_p && c <= CONSTRAINT_p;
}

static inline void
insn_extra_constraint_allows_reg_mem (enum constraint_num c,
				      bool *allows_reg, bool *allows_mem)
{
  if (c >= CONSTRAINT_R && c <= CONSTRAINT_CS)
    return;
  if (c >= CONSTRAINT_V && c <= CONSTRAINT_Ap)
    {
      *allows_mem = true;
      return;
    }
  (void) c;
  *allows_reg = true;
  *allows_mem = true;
}

static inline size_t
insn_constraint_len (char fc, const char *str ATTRIBUTE_UNUSED)
{
  switch (fc)
    {
    case 'A': return 2;
    case 'C': return 2;
    default: break;
    }
  return 1;
}

#define CONSTRAINT_LEN(c_,s_) insn_constraint_len (c_,s_)

extern enum reg_class reg_class_for_constraint_1 (enum constraint_num);

static inline enum reg_class
reg_class_for_constraint (enum constraint_num c)
{
  if (insn_extra_register_constraint (c))
    return reg_class_for_constraint_1 (c);
  return NO_REGS;
}

extern bool insn_const_int_ok_for_constraint (HOST_WIDE_INT, enum constraint_num);
#define CONST_OK_FOR_CONSTRAINT_P(v_,c_,s_) \
    insn_const_int_ok_for_constraint (v_, lookup_constraint (s_))

enum constraint_type
{
  CT_REGISTER,
  CT_CONST_INT,
  CT_MEMORY,
  CT_SPECIAL_MEMORY,
  CT_RELAXED_MEMORY,
  CT_ADDRESS,
  CT_FIXED_FORM
};

static inline enum constraint_type
get_constraint_type (enum constraint_num c)
{
  if (c >= CONSTRAINT_p)
    {
      if (c >= CONSTRAINT_R)
        return CT_FIXED_FORM;
      return CT_ADDRESS;
    }
  if (c >= CONSTRAINT_m)
    return CT_MEMORY;
  if (c >= CONSTRAINT_I)
    return CT_CONST_INT;
  return CT_REGISTER;
}
#endif /* tm-preds.h */
