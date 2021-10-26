// The cornerstone, an `each` implementation, aka `forEach`.
// Handles objects with the built-in `forEach`, arrays, and raw objects.
// Delegates to **ECMAScript 5**'s native `forEach` if available.
var each = function(obj, iterator, context) {
	if (obj == null) return;
	obj.forEach(iterator, context);
};

// Determine if at least one element in the object matches a truth test.
// Delegates to **ECMAScript 5**'s native `some` if available.
// Aliased as `any`.
var any = function(obj, iterator, context) {
	var result = false;
	if (obj == null) return result;
	return obj.some(iterator, context);
};

// Extend a given object with all the properties in passed-in object(s).
var _extend = function(obj) {
  each(Array.prototype.slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};


// from https://github.com/tiagosr/unravel

var Arrow = function(type, dest, read_as) {
	this.type = type;
	this.dest = dest;
	this.read_as = read_as || null;
}

var Insn = function(mnemo, tags, at, size, info, arrows) {
	this.mnemonic = mnemo;
	this.tags = tags;
	this.at = at;
	this.size = size;
	this.info = info;
	this.arrows = arrows || [new Arrow('jump', at + size)];
}  
var TableMatch = function(decoder, op, at, image, table) {
	var match = table.find(function(row) {
		return (op & row.mask) == row.match;
	});
	if (match) {
		return match.fn(decoder, op, at, image, match);
	} else {
		return undefined;
	}
}

var data_regs = [
	{name: 'D0', index:0, type:'data'},
	{name: 'D1', index:1, type:'data'},
	{name: 'D2', index:2, type:'data'},
	{name: 'D3', index:3, type:'data'},
	{name: 'D4', index:4, type:'data'},
	{name: 'D5', index:5, type:'data'},
	{name: 'D6', index:6, type:'data'},
	{name: 'D7', index:7, type:'data'}
]
var addr_regs = [
	{name: 'A0', index:0, type:'address'},
	{name: 'A1', index:1, type:'address'},
	{name: 'A2', index:2, type:'address'},
	{name: 'A3', index:3, type:'address'},
	{name: 'A4', index:4, type:'address'},
	{name: 'A5', index:5, type:'address'},
	{name: 'A6', index:6, type:'address'},
	{name: 'A7', index:7, type:'address', alt:'SP'}
]

var size_table_0 = ['byte', 'word', 'long', 'invalid'];
var size_table_1 = ['invalid', 'byte', 'long', 'word'];

var op_size = [
	{name:'byte', op:'.b', tags:['byte', 'b8'], bytes:1, reader:function(decoder, image, at) {
		return decoder.read16(image, at) & 0xff;
	}, reader_signed: function(decoder, image, at) {
		var r = decoder.read16(image, at) & 0xff;
		if (r>=0x80) {
			return r - 0x100;
		} else return r;
	}},
	{name:'word', op:'.w', tags:['word', 'b16'], bytes:2, reader:function(decoder, image, at) {
		return decoder.read16(image, at);
	}, reader_signed: function(decoder, image, at) {
		return decoder.readS16(image, at);
	}},
	{name:'long', op:'.l', tags:['long', 'b32'], bytes:3, reader:function(decoder, image, at) {
		return decoder.read32(image, at);
	}, reader_signed: function(decoder, image, at) {
		return decoder.readS32(image, at);
	}},
];

var effective_address = function(decoder, op, at, image, op_mode) {
	var mode = (op & 0x38) >> 3;
	var reg = (op & 0x07);
	switch(mode) {
		case 0: return {
			type:"data_reg", source:data_regs[reg], size:0,
		 	format: function(data){
		 		return String.format("%s", data.source.name);
		 	},
		 	tags:['register', 'direct', 'data']
		};
		case 1: return {
			type:"addr_reg", source:addr_regs[reg], size:0,
			format: function(data){
		 		return String.format("%s", data.source.name);
		 	},
			tags:['register', 'direct', 'address']
		};
		case 2: return {
			type:"addr_ind", source:addr_regs[reg], size:0,
			format: function(data){
		 		return String.format("(%s)", data.source.name);
		 	},
			tags:['register', 'indirect', 'address']
		};
		case 3: return {
			type:"addr_ind_postinc", source:addr_regs[reg], size:0,
			format: function(data){
		 		return String.format("(%s)+", data.source.name);
		 	},
			tags:['register', 'indirect', 'address', 'postinc']
		};
		case 4: return {
			type:"addr_ind_predec", source:addr_regs[reg], size:0,
			format: function(data){
		 		return String.format("-(%s)", data.disp, data.source.name);
		 	},
			tags:['register', 'indirect', 'address', 'predec']
		};
		case 5: return {
			type:"addr_disp", source:addr_regs[reg], disp:decoder.read16(image, at+2), size:2,
			format: function(data){
		 		return String.format("$%x(%s)", data.disp, data.source.name);
		 	},
			tags:['register', 'indirect', 'address', 'displacement']
		};
		case 6: {
			var b = decoder.read16(image, at+2);
			var displacement = b & 0xff;
			if(displacement >= 0x80) displacement -= 0x100;
			var index_reg_type = (b & 0x8000) >> 15;
			var index_reg_index = (b & 0x7000) >> 12;
			var index_size = (b & 0x800)?{type:'long', mnemo:'.L'}:{type:'short', mnemo:'.W'};
			var index_reg = index_reg_type?addr_regs[index_reg_index]:data_regs[index_reg_index];

			return {
				type:"addr_ind", source:addr_regs[reg], index: index_reg, index_size:index_size, disp:displacement, size:2,
				format: function(data) {
					return String.format("$%x(%s, %s%s)", data.disp, data.source.name, data.index.name, data.index_size.mnemo);
				},
				tags:['register', 'indirect', index_reg_type?'address':'data', 'index', 'displacement']
			};
		}
		case 7: {
			switch(reg) {
				case 0: {
					var addr = decoder.readS16(image, at+2) >>> 0;
					return {
						type: "abs_short", address:addr, size:2,
						format: function(data) {
							return String.format("$%x.S", data.address);
						},
						tags:['absolute', 'direct', 'short']
					}
				}
				case 1: {
					var addr = decoder.read32(image, at+2);
					return {
						type: "abs_long", address:addr, size:4,
						format: function(data) {
							return String.format("$%x.L", data.address);
						},
						tags:['absolute', 'direct', 'long']
					}
				}
				case 2: {
					var disp = decoder.readS16(image, at+2);
					return {
						type: "pc_relative", source:{name:'PC', type:'program_counter'}, disp:disp, size: 2,
						format: function(data) {
							return String.format("$%x(PC)", data.disp);
						},
						tags:['pc_relative', 'relative', 'direct', 'displacement']
					}
				}
				case 3: {
					var b = decoder.read16(image, at+2);
					var displacement = b & 0xff;
					if(displacement >= 0x80) displacement -= 0x100;
					var index_reg_type = (b & 0x8000) >> 15;
					var index_reg_index = (b & 0x7000) >> 12;
					var index_size = (b & 0x800)?{type:'long', mnemo:'.L'}:{type:'short', mnemo:'.W'};
					var index_reg = index_reg_type?addr_regs[index_reg_index]:data_regs[index_reg_index];

					return {
						type:"pc_ind", source:{name:'PC', type:'program_counter'}, index: index_reg, index_size:index_size, disp:displacement, size:2,
						format: function(data) {
							return String.format("$%x(PC, %s%s)", data.disp, data.source.name, data.index.name, data.index_size.mnemo);
						},
						tags:['pc_relative', 'relative', 'indirect', index_reg_type?'address':'data', 'index', 'displacement']
					};
				}
				case 4: {
					if (op_mode == 'long') {
						var data = decoder.readS32(image, at+2);
						return {
							type: "imm", data: data, size: 2,
							format: function(data) {
								return String.format("#$%x.L",data.data);
							},
							tags:['immediate', 'data', 'long']
						}
					} else if(op_mode == 'word' || op_mode == 'byte') {
						var data = decoder.readS16(image, at+2);
						if(op_mode=='byte') data = data & 0xff;
						return {
							type: "imm", data: data, size: 2,
							format: function(data) {
								return String.format((op_mode=='word')?"#$%x.W":"#$%x.B", data.data);
							},
							tags:['immediate', 'data', op_mode]
						}
					}

				}
			}
		}
	}
	return undefined;
}

var LINK = function(decoder, op, at, image, match) {
	var reg = addr_regs[op & 0x07];
	var disp = decoder.readS16(image, at+2)
	return new Insn(
		match.mnemonic, ['link', 'push', 'stack', 'address', 'displacement', 'indirect'],
		at, 4, {reg:reg, disp:disp}
	)
}

var LEA = function(decoder, op, at, image, match) {
	var reg = addr_regs[op & 0x07];
	var ea = effective_address(decoder, op, at, image)
	return new Insn(
		match.mnemonic, ['load', 'address'],
		at, 2+ea.size, {dest:reg, source:ea}
	)
}

var Type3 = function(decoder, op, at, image, match) {
	var reg = data_regs[(op & 0xe00) >> 9];
	var op_mode = size_table_0[(op & 0x00c0) >> 6];
	var ea = effective_address(decoder, op, at, image, op_mode);
	var dir = (op & 0x100)>>8;
	var source = ea, dest = reg;
	if(dir) {
		source = reg; dest = ea;
	}
	return new Insn(
		match.mnemonic, _extend(match.tags, dir?['ea->d']:['d->ea']),
		at, 2+ea.size,
		{source:source, dest:rest}
	)
}

var Type3A = function(decoder, op, at, image, match) {
	var reg = addr_regs[(op & 0xe00) >> 9];
	var op_mode = ['word', 'long'][(op & 0x0100) >> 8];
	var ea = effective_address(decoder, op, at, image, op_mode);
	return new Insn(
		match.mnemonic, _extend(match.tags, ['ea->a']),
		at, 2+ea.size,
		{source:ea, dest:reg}
	)
}


var Move = function(decoder, op, at, image, match) {
	var op_mode = size_table_1[(op & 0x3000) >> 12];
	var source = effective_address(decoder, op & 0x3f, at, image, op_mode);
	var dest = effective_address(decoder, (op & 0x0fc0) >> 6, at+source.size, image, op_mode); 
	return new Insn(
		match.mnemonic, _extend(match.tags, ['move']),
		at, 2+source.size+dest.size,
		{source:source, dest:dest}
	)
}

var Scc = function(decoder, op, at, image, match) {
	var dest = effective_address(decoder, op & 0x3f, at, image, 0);
	return new Insn(
		match.mnemonic, _extend(match.tags, ['store', 'conditional']),
		at, 2+dest.size,
		{dest:dest}
	)
}

var PEA = function(decoder, op, at, image, match) {
	var dest = effective_address(decoder, op & 0x3f, at, image, 0);
	return new Insn(
		match.mnemonic, _extend(match.tags, ['push', 'stack', 'effective address']),
		at, 2+dest.size,
		{dest:dest}
	)
}

var TAS = function(decoder, op, at, image, match) {
	var dest = effective_address(decoder, op & 0x3f, at, image, 0);
	return new Insn(
		match.mnemonic, _extend(match.tags, ['test-and-set']),
		at, 2+dest.size,
		{dest:dest}
	)
}

var SWAP = function(decoder, op, at, image, match) {
	var dest = effective_address(decoder, op & 0x3f, at, image, 0);
	return new Insn(
		match.mnemonic, _extend(match.tags, ['swap']),
		at, 2+dest.size,
		{dest:dest}
	)
}

var JMP = function(decoder, op, at, image, match) {
	var dest = effective_address(decoder, op & 0x3f, at, image, 0);
	var arrows = [];
	switch(dest.type) {
	case "imm":
	case "abs_short":
	case "abs_long":
		arrows.push(new Arrow('jump', dest.data, 'code'));
		break;
	case "pc_relative":
		arrows.push(new Arrow('jump', dest.data+at, 'code'))
		break;
	}
	return new Insn(
		match.mnemonic, _extend(match.tags, ['jump']),
		at, 2+dest.size,
		{dest:dest}, arrows
	)
}

var Type6 = function(decoder, op, at, image, match) {
	var dest = effective_address(decoder, op & 0x3f, at, image, size_table_0[(op & 0xc0)>>6]);
	var data = op & 0xe0 >> 9;
	if (data == 0) data = 8;
	return new Insn(
		match.mnemonic, _extend(match.tags, ['quick', 'immediate']),
		at, 2+dest.size,
		{dest:dest, data:data}
	)
}

var TST = function(decoder, op, at, image, match) {
	var dest = effective_address(decoder, op & 0x3f, at, image, size_table_0[(op & 0xc0)>>6]);
	return new Insn(
		match.mnemonic, ['test', 'flags'],
		at, 2+dest.size,
		{dest:dest}
	)
}

var Bcc = function(decoder, op, at, image, match) {
	var disp = op & 0xff;
	var size = "";
	var opsize = 2;
	var tags = ['displacement'];
    var dest = at + opsize;
	if (disp == 0) {
		disp = decoder.readS16(image, at+2);
		dest += 2;
		opsize += 2;
		tags.push('word')
	} else {
		size = ".s"
		if (displacement >= 0x80) {
			displacement -= 0x100;
		}
		tags.push('short')
	}
	var arrows = []
	if (match.subroutine) {
		arrows.push(new Arrow('call', dest, 'code'))
	}
	else {
		arrows.push(new Arrow('jump', dest, 'code'));	
	}
	if (!match.alwaystrue) arrows.push(new Arrow('jump', at+opsize, 'code'));
	return new Insn(
		match.mnemonic + size, _extend(match.tags, tags),
		at, opsize,
		{dest: dest}, arrows
	)
}

var UNLK = function(decoder, op, at, image, match) {
	var addr_reg = addr_regs[op & 7];
	return new Insn(
		match.mnemonic, ['unlink'],
		at, 2,
		{dest: addr_reg}
	)
}

var Type10 = function(decoder, op, at, image, match) {
	return new Insn(
		match.mnemonic, match.tags,
		at, 2,
		{}, [] // no arrows - stop current flow
	)
}

var NOP = function(decoder, op, at, image, match) {
	return new Insn(
		match.mnemonic, ['no-op'],
		at, 2, {}
	)
}

var RESET = function(decoder, op, at, image, match) {
	return new Insn(
		match.mnemonic, ['reset'],
		at, 2, {},
		[
			new Arrow('int', image.read32(4), 'code') // get reset vector
		]
	)
}

var TRAPV = function(decoder, op, at, image, match) {
	return new Insn(
		match.mnemonic, ['trap', 'conditional', 'overflow'],
		at, 2, {vector: 7},
		[
			new Arrow('jump', at+2, 'code'),
			new Arrow('int', image.read32(0x1c), 'code') // interrupt vector 7, at 7 * 4
		]
	)
}

var TRAP = function(decoder, op, at, image, match) {
	var vector = op & 0xf;
	return new Insn(
		match.mnemonic, ['trap'],
		at, 2, {vector: vector},
		[
			new Arrow('jump', at+2, 'code'),
			new Arrow('int', image.read32(vector*4 + 0x80), 'code') // call address in interrupt table starting at vector 32
		]
	)
}

var Type11 = function(decoder, op, at, image, match) {
	// rotates, shifts
	var sz = (op & 0xc0) >> 6;
	if (sz < 3) { // register ops
		var tp = op & 0x20;
		var dest_data_reg = data_regs[op & 0x07];
		var count = op & 0xe00 >> 9
		if (tp) {
			count = data_regs[count];
		}
		return new Insn(
			match.mnemonic+op_size[sz].op, _extend(match.tags, tp?['register', 'register-source']:['register'], [op_size[sz].tags]),
			at, 2, {dest: dest_data_reg, count:count, size:op_size[sz].bytes}
		)
	} else { // memory ops
		var ea = effective_address(decoder, op & 0x3f, at, image, size_table_0[(op & 0xc0)>>6]);
		return new Insn(
			match.mnemonic, _extend(match.tags, ['memory']),
			at, 2+ea.size, {dest: ea, count: 1}
		)
	}
}

var EXT = function(decoder, op, at, image, match) {
	var dest = data_regs[op&7];
	var sz = op_size[((op & 0x1c0) >> 6) - 1];
	return new Insn(
		match.mnemonic+sz.op, _extend(['sign-extend'], sz.tags),
		at, 2,
		{dest:dest, size:sz.bytes}
	)
}

var Type13 = function(decoder, op, at, image, match) {
	var dest = data_regs[op&7];
	var sz = op_size[((op & 0x1c0) >> 6) - 1];
	var im_size = Math.max(2, sz.bytes);
	var im = sz.reader_signed(decoder, image, at+2);
	return new Insn(
		match.mnemonic+sz.op, _extend(['immediate'], sz.tags, match.tags),
		at, 2+im_size,
		{dest:dest, size:sz.bytes, immediate:imm}
	)
}

var Type14 = function(decoder, op, at, image, match) {
	var dest_type = op & 8;
	var sz = op_size[(op & 0xc0)>>6];
	if(dest_type) {
		var src = addr_regs[op&7];
		var dest = addr_regs[(op & 0xe00)>>9];
		return new Insn(
			match.mnemonic, _extend(match.tags, ['indirect','address','predec']),
			at, 2,
			{source:src, dest:dest}
		)
	} else {
		var src = data_regs[op&7];
		var dest = data_regs[(op & 0xe00)>>9];
		return new Insn(
			match.mnemonic, _extend(match.tags, ['data']),
			at, 2,
			{source:src, dest:dest}
		)
	}
}

var DBcc = function(decoder, op, at, image, match) {
	var src = data_regs[op & 7];
	var displacement = decoder.readS16(image, at+2);
	return new Insn(
		match.mnemonic, _extend(['decrement-and-branch', 'conditional', 'decrement', 'register', 'data'], match.tags),
		at, 4,
		{register:src, displacement:displacement},
		[
			new Arrow('jump', at+2+displacement, 'code'),
			new Arrow('jump', at+4, 'code')
		]
	)
}

var insn_table = [
	{mnemonic: 'abcd', match: 0xc100, mask: 0xf1f0, fn: Type14},
	{mnemonic: 'adda', match: 0xd0c0, mask: 0xf0c0, fn: Type3A, tags:['add', '+']},
	{mnemonic: 'addx', match: 0xd100, mask: 0xf130, fn: Type14, tags:['add', '+']},
	{mnemonic: 'add',  match: 0xd000, mask: 0xf000, fn: Type3, tags:['add', '+']},	
//	{mnemonic: 'cmpm', match: 0xb108, mask: 0xf138, fn: Type19},
	{mnemonic: 'eor',  match: 0xb100, mask: 0xf100, fn: Type3, tags:['xor', '^']},
	{mnemonic: 'cmp',  match: 0xb000, mask: 0xf100, fn: Type3, tags:['compare']},

	{mnemonic: 'reset',   match: 0x4e70, mask: 0xffff, fn: Type10, tags:['reset']},
	{mnemonic: 'nop',     match: 0x4e71, mask: 0xffff, fn: NOP},
	{mnemonic: 'stop',    match: 0x4e72, mask: 0xffff, fn: Type10, tags:['halt', 'processor-stop']},
	{mnemonic: 'rtd',     match: 0x4e73, mask: 0xffff, fn: Type10, tags:['return', 'subroutine', 'displacement']},
	{mnemonic: 'rts',     match: 0x4e75, mask: 0xffff, fn: Type10, tags:['return', 'subroutine']},
	{mnemonic: 'rtr',     match: 0x4e77, mask: 0xffff, fn: Type10, tags:['return', 'supervisor']},
	{mnemonic: 'trapv',   match: 0x4e76, mask: 0xffff, fn: TRAPV},
	{mnemonic: 'illegal', match: 0x4afc, mask: 0xffff, fn: Type10, tags:['illegal']},
	
	{mnemonic: 'swap', match: 0x4840, mask: 0xfff8, fn: SWAP},
	{mnemonic: 'unlk', match: 0x4e58, mask: 0xfff8, fn: UNLK},
	{mnemonic: 'link', match: 0x4e50, mask: 0xfff8, fn: LINK},

	{mnemonic: 'trap', match: 0x4e40, mask: 0xfff0, fn: TRAP},
	{mnemonic: 'tas',  match: 0x4ac0, mask: 0xffc0, fn: TAS},
	{mnemonic: 'jmp',  match: 0x4ec0, mask: 0xffc0, fn: JMP},
//	{mnemonic: 'jsr',  match: 0x4e80, mask: 0xffc0, fn: JSR},

/*	{mnemonic: 'move {ea}, usp', match: 0x4e60, mask: 0xfff8, fn: Type28, direction:'reg'},
	{mnemonic: 'move usp, {ea}', match: 0x4e68, mask: 0xfff8, fn: Type28, direction:'mem'},

	{mnemonic: 'move ccr, {ea}', match: 0x42c0, mask: 0xffc0, fn: Type26, direction:'mem'},
	{mnemonic: 'move {ea}, ccr', match: 0x44c0, mask: 0xffc0, fn: Type26, direction:'reg'},
	{mnemonic: 'move sr, {ea}',  match: 0x40c0, mask: 0xffc0, fn: Type26, direction:'mem'},
	{mnemonic: 'move {ea}, sr',  match: 0x46c0, mask: 0xffc0, fn: Type26, direction:'reg'},
	
	{mnemonic: 'nbcd', match: 0x4800, mask: 0xffc0, fn: Type15},
*/	{mnemonic: 'pea',  match: 0x4840, mask: 0xffc0, fn: PEA},

	{mnemonic: 'ext',  match: 0x4800, mask: 0xfe30, fn: EXT},

//	{mnemonic: 'movem', match: 0x4880, mask: 0xfb80, fn: Type23},
	
//	{mnemonic: 'chk',  match: 0x4180, mask: 0xf1c0, fn: Type16},
	{mnemonic: 'lea',  match: 0x41c0, mask: 0xf1c0, fn: LEA},

	{mnemonic: 'tst',  match: 0x4a00, mask: 0xff00, fn: TST},
//	{mnemonic: 'clr',  match: 0x4200, mask: 0xff00, fn: Type15},
//	{mnemonic: 'neg',  match: 0x4400, mask: 0xff00, fn: Type15},
//	{mnemonic: 'negx', match: 0x4000, mask: 0xff00, fn: Type15},
//	{mnemonic: 'not',  match: 0x4600, mask: 0xff00, fn: Type15},
	
	{mnemonic: 'dbt',  match: 0x50c8, mask: 0xfff8, fn: DBcc, tags:['true']},
	{mnemonic: 'dbf',  match: 0x51c8, mask: 0xfff8, fn: DBcc, tags:['false']},
	{mnemonic: 'dbhi', match: 0x52c8, mask: 0xfff8, fn: DBcc, tags:['higher']},
	{mnemonic: 'dbls', match: 0x53c8, mask: 0xfff8, fn: DBcc, tags:['lower-same']},
	{mnemonic: 'dbcc', match: 0x54c8, mask: 0xfff8, fn: DBcc, tags:['carry-clear']},
	{mnemonic: 'dbcs', match: 0x55c8, mask: 0xfff8, fn: DBcc, tags:['carry-set']},
	{mnemonic: 'dbne', match: 0x56c8, mask: 0xfff8, fn: DBcc, tags:['not-equal']},
	{mnemonic: 'dbeq', match: 0x57c8, mask: 0xfff8, fn: DBcc, tags:['equal']},
	{mnemonic: 'dbvc', match: 0x58c8, mask: 0xfff8, fn: DBcc, tags:['overflow-clear']},
	{mnemonic: 'dbvs', match: 0x59c8, mask: 0xfff8, fn: DBcc, tags:['overflow-set']},
	{mnemonic: 'dbpl', match: 0x5ac8, mask: 0xfff8, fn: DBcc, tags:['plus']},
	{mnemonic: 'dbmi', match: 0x5bc8, mask: 0xfff8, fn: DBcc, tags:['minus']},
	{mnemonic: 'dbge', match: 0x5cc8, mask: 0xfff8, fn: DBcc, tags:['greater-equal']},
	{mnemonic: 'dblt', match: 0x5dc8, mask: 0xfff8, fn: DBcc, tags:['less-than']},
	{mnemonic: 'dbgt', match: 0x5ec8, mask: 0xfff8, fn: DBcc, tags:['greater']},
	{mnemonic: 'dble', match: 0x5fc8, mask: 0xfff8, fn: DBcc, tags:['less']},
	
	{mnemonic: 'st',   match: 0x50c0, mask: 0xfff8, fn: Scc, tags:['true']},
	{mnemonic: 'sf',   match: 0x51c0, mask: 0xfff8, fn: Scc, tags:['false']},
	{mnemonic: 'shi',  match: 0x52c0, mask: 0xfff8, fn: Scc, tags:['higher']},
	{mnemonic: 'sls',  match: 0x53c0, mask: 0xfff8, fn: Scc, tags:['lower-same']},
	{mnemonic: 'scc',  match: 0x54c0, mask: 0xfff8, fn: Scc, tags:['carry-clear']},
	{mnemonic: 'scs',  match: 0x55c0, mask: 0xfff8, fn: Scc, tags:['carry-set']},
	{mnemonic: 'sne',  match: 0x56c0, mask: 0xfff8, fn: Scc, tags:['not-equal']},
	{mnemonic: 'seq',  match: 0x57c0, mask: 0xfff8, fn: Scc, tags:['equal']},
	{mnemonic: 'svc',  match: 0x58c0, mask: 0xfff8, fn: Scc, tags:['overflow-clear']},
	{mnemonic: 'svs',  match: 0x59c0, mask: 0xfff8, fn: Scc, tags:['overflow-set']},
	{mnemonic: 'spl',  match: 0x5ac0, mask: 0xfff8, fn: Scc, tags:['plus']},
	{mnemonic: 'smi',  match: 0x5bc0, mask: 0xfff8, fn: Scc, tags:['minus']},
	{mnemonic: 'sge',  match: 0x5cc0, mask: 0xfff8, fn: Scc, tags:['greater-equal']},
	{mnemonic: 'slt',  match: 0x5dc0, mask: 0xfff8, fn: Scc, tags:['less-than']},
	{mnemonic: 'sgt',  match: 0x5ec0, mask: 0xfff8, fn: Scc, tags:['greater']},
	{mnemonic: 'sle',  match: 0x5fc0, mask: 0xfff8, fn: Scc, tags:['less']},

	{mnemonic: 'bra',  match: 0x6000, mask: 0xff00, fn: Bcc, tags:['branch', 'jump'], alwaystrue:true},
	{mnemonic: 'bsr',  match: 0x6100, mask: 0xff00, fn: Bcc, tags:['branch', 'subroutine'], subroutine:true},
	{mnemonic: 'bhi',  match: 0x6200, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'higher']},
	{mnemonic: 'bls',  match: 0x6300, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'lower-same']},
	{mnemonic: 'bcc',  match: 0x6400, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'carry-clear']},
	{mnemonic: 'bcs',  match: 0x6500, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'carry-set']},
	{mnemonic: 'bne',  match: 0x6600, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'not-equal']},
	{mnemonic: 'beq',  match: 0x6700, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'equal']},
	{mnemonic: 'bvc',  match: 0x6800, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'overflow-clear']},
	{mnemonic: 'bvs',  match: 0x6900, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'overflow-set']},
	{mnemonic: 'bpl',  match: 0x6a00, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'plus']},
	{mnemonic: 'bmi',  match: 0x6b00, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'minus']},
	{mnemonic: 'bge',  match: 0x6c00, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'greater-equal']},
	{mnemonic: 'blt',  match: 0x6d00, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'less']},
	{mnemonic: 'bgt',  match: 0x6e00, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'greater']},
	{mnemonic: 'ble',  match: 0x6f00, mask: 0xff00, fn: Bcc, tags:['branch', 'jump', 'less-equal']},
	

	{mnemonic: 'addq', match: 0x5000, mask: 0xf100, fn: Type6, tags:['add', '+']},
//	{mnemonic: 'muls', match: 0xc1c0, mask: 0xf1c0, fn: Type16},
//	{mnemonic: 'mulu', match: 0xc0c0, mask: 0xf1c0, fn: Type16},
//	{mnemonic: 'divs', match: 0x81c0, mask: 0xf1c0, fn: Type16},
//	{mnemonic: 'divu', match: 0x80c0, mask: 0xf1c0, fn: Type16},


//	{mnemonic: 'exg',  match: 0xc100, mask: 0xf130, fn: Type18},
	

	{mnemonic: 'rol',  match: 0xe7c0, mask: 0xffc0, fn: Type11, tags:['rotate', 'left']},
	{mnemonic: 'roxl', match: 0xe5c0, mask: 0xffc0, fn: Type11, tags:['rotate', 'left', 'x']},
	{mnemonic: 'lsl',  match: 0xe3c0, mask: 0xffc0, fn: Type11, tags:['shift', 'logic', 'left']},
	{mnemonic: 'asl',  match: 0xe100, mask: 0xf118, fn: Type11, tags:['shift', 'arithmetic', 'left']},
	{mnemonic: 'asl',  match: 0xe1c0, mask: 0xf1c0, fn: Type11, tags:['shift', 'arithmetic', 'left']},

	{mnemonic: 'ror',  match: 0xe6c0, mask: 0xffc0, fn: Type11, tags:['rotate', 'right']},
	{mnemonic: 'roxr', match: 0xe4c0, mask: 0xffc0, fn: Type11, tags:['rotate', 'right', 'x']},
	{mnemonic: 'lsr',  match: 0xe2c0, mask: 0xffc0, fn: Type11, tags:['shift', 'logic', 'right']},
	{mnemonic: 'asr',  match: 0xe000, mask: 0xf118, fn: Type11, tags:['shift', 'arithmetic', 'right']},
	{mnemonic: 'asr',  match: 0xe0c0, mask: 0xf1c0, fn: Type11, tags:['shift', 'arithmetic', 'right']},

	{mnemonic: 'rol',  match: 0xe118, mask: 0xf118, fn: Type11, tags:['rotate', 'left']},
	{mnemonic: 'ror',  match: 0xe018, mask: 0xf118, fn: Type11, tags:['rotate', 'right']},
	{mnemonic: 'roxl', match: 0xe110, mask: 0xf118, fn: Type11, tags:['rotate', 'left', 'x']},
	{mnemonic: 'roxr', match: 0xe010, mask: 0xf118, fn: Type11, tags:['rotate', 'right', 'x']},

	{mnemonic: 'move.b', match: 0x1000, mask: 0xf000, fn: Move, tags: ['byte']},
	{mnemonic: 'move.l', match: 0x2000, mask: 0xf000, fn: Move, tags: ['long']},
	{mnemonic: 'move.w', match: 0x3000, mask: 0xf000, fn: Move, tags: ['word']},

//	{mnemonic: 'moveq', match: 0x7000, mask: 0xf100, fn: Type22},

	{mnemonic: 'sbcd', match: 0x8100, mask: 0xf1f0, fn: Type14},
	{mnemonic: 'or',   match: 0x8000, mask: 0xf000, fn: Type3, tags:['or', '|']},

//	{mnemonic: 'ori #{value}, ccr',  match: 0x003c, mask: 0xffff, fn: Type27},
//	{mnemonic: 'ori #{value}, sr',   match: 0x007c, mask: 0xffff, fn: Type27},
//	{mnemonic: 'ori #{value}, sr',   match: 0x007c, mask: 0xffff, fn: Type27},
//	{mnemonic: 'eori #{value}, ccr', match: 0x0a3c, mask: 0xffff, fn: Type27},
//	{mnemonic: 'eori #{value}, sr',  match: 0x0a7c, mask: 0xffff, fn: Type27},
//	{mnemonic: 'andi #{value}, ccr', match: 0x023c, mask: 0xffff, fn: Type27},
//	{mnemonic: 'andi #{value}, sr',  match: 0x027c, mask: 0xffff, fn: Type27},

//	{mnemonic: 'movep.w {disp}({addr}), {data}', match: 0x0108, mask: 0xf1f8, fn: MOVEP, size: 2, direction:'mem'},
//	{mnemonic: 'movep.w {data}, {disp}({addr})', match: 0x0188, mask: 0xf1f8, fn: MOVEP, size: 2, direction:'reg'},
//	{mnemonic: 'movep.l {disp}({addr}), {data}', match: 0x0148, mask: 0xf1f8, fn: MOVEP, size: 4, direction:'mem'},
//	{mnemonic: 'movep.l {data}, {disp}({addr})', match: 0x01c8, mask: 0xf1f8, fn: MOVEP, size: 4, direction:'reg'},
	
//	{mnemonic: 'btst', match: 0x0800, mask: 0xffc0, fn: Type20},
//	{mnemonic: 'bchg', match: 0x0840, mask: 0xffc0, fn: Type20},
//	{mnemonic: 'bclr', match: 0x0880, mask: 0xffc0, fn: Type20},
//	{mnemonic: 'bset', match: 0x08c0, mask: 0xffc0, fn: Type20},

	{mnemonic: 'ori',  match: 0x0000, mask: 0xff00, fn: Type13, tags:['or', '|']},
	{mnemonic: 'addi', match: 0x0600, mask: 0xff00, fn: Type13, tags:['add', '+']},
	{mnemonic: 'andi', match: 0x0200, mask: 0xff00, fn: Type13, tags:['and', '&']},
	{mnemonic: 'subi', match: 0x0400, mask: 0xff00, fn: Type13, tags:['subtract', '-']},
	{mnemonic: 'eori', match: 0x0a00, mask: 0xff00, fn: Type13, tags:['xor', '^']},
	{mnemonic: 'cmpi', match: 0x0c00, mask: 0xff00, fn: Type13, tags:['compare', 'subtract', '-']},
	
//	{mnemonic: 'btst', match: 0x0100, mask: 0xf1c0, fn: Type21},
//	{mnemonic: 'bchg', match: 0x0140, mask: 0xf1c0, fn: Type21},
//	{mnemonic: 'bclr', match: 0x0180, mask: 0xf1c0, fn: Type21},
//	{mnemonic: 'bset', match: 0x01c0, mask: 0xf1c0, fn: Type21},
	
	{mnemonic: 'subq', match: 0x5100, mask: 0xf100, fn: Type6, tags: ['subtract', '-']},
	{mnemonic: 'suba', match: 0x9000, mask: 0xf0c0, fn: Type3A, tags:['subtract', '-']},
	{mnemonic: 'subx', match: 0x9100, mask: 0xf130, fn: Type14, tags:['subtract', '-']},
	{mnemonic: 'sub',  match: 0x9000, mask: 0xf000, fn: Type3, tags:['subtract', '-']},
	

//	{mnemonic: 'unknown', match: 0, mask: 0, fn: Invalid}
]

ArchBigEndian = function() {}
ArchBigEndian.prototype.read8 = function(image, at) {
	return image[at];
}
ArchBigEndian.prototype.read16 = function(image, at) {
	return this.read8(image, at)*256 + this.read8(image, at+1);
}
ArchBigEndian.prototype.read32 = function(image, at) {
	return this.read16(image, at)*65536 + this.read16(image, at+2);
}
ArchBigEndian.prototype.decode = function(image, at) {
	return InvalidInsn(at);
}

var unravel_m68k = function(image, at) {
	var arch = new ArchBigEndian()
	return TableMatch(arch, arch.read16(image, at), at, image, insn_table);
}

module.exports = unravel_m68k;
