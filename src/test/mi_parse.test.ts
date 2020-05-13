import * as assert from 'assert';
import { parseMI, MINode } from '../src/backend/mi_parse';

suite("MI Parse", () => {
	test("Simple out of band record", () => {
		let parsed = parseMI(`4=thread-exited,id="3",group-id="i1"`);
		assert.ok(parsed);
		assert.equal(parsed.token, 4);
		assert.equal(parsed.outOfBandRecord.length, 1);
		assert.equal(parsed.outOfBandRecord[0].isStream, false);
		assert.equal(parsed.outOfBandRecord[0].asyncClass, "thread-exited");
		assert.equal(parsed.outOfBandRecord[0].output.length, 2);
		assert.deepEqual(parsed.outOfBandRecord[0].output[0], ["id", "3"]);
		assert.deepEqual(parsed.outOfBandRecord[0].output[1], ["group-id", "i1"]);
		assert.equal(parsed.resultRecords, undefined);
	});
	test("Console stream output with new line", () => {
		let parsed = parseMI(`~"[Thread 0x7fffe993a700 (LWP 11002) exited]\\n"`);
		assert.ok(parsed);
		assert.equal(parsed.token, undefined);
		assert.equal(parsed.outOfBandRecord.length, 1);
		assert.equal(parsed.outOfBandRecord[0].isStream, true);
		assert.equal(parsed.outOfBandRecord[0].content, "[Thread 0x7fffe993a700 (LWP 11002) exited]\n");
		assert.equal(parsed.resultRecords, undefined);
	});
	test("Unicode", () => {
		let parsed = parseMI(`~"[Depuraci\\303\\263n de hilo usando libthread_db enabled]\\n"`);
		assert.ok(parsed);
		assert.equal(parsed.token, undefined);
		assert.equal(parsed.outOfBandRecord.length, 1);
		assert.equal(parsed.outOfBandRecord[0].isStream, true);
		assert.equal(parsed.outOfBandRecord[0].content, "[Depuración de hilo usando libthread_db enabled]\n");
		assert.equal(parsed.resultRecords, undefined);
		parsed = parseMI(`~"4\\t  std::cout << \\"\\345\\245\\275\\345\\245\\275\\345\\255\\246\\344\\271\\240\\357\\274\\214\\345\\244\\251\\345\\244\\251\\345\\220\\221\\344\\270\\212\\" << std::endl;\\n"`);
		assert.ok(parsed);
		assert.equal(parsed.token, undefined);
		assert.equal(parsed.outOfBandRecord.length, 1);
		assert.equal(parsed.outOfBandRecord[0].isStream, true);
		assert.equal(parsed.outOfBandRecord[0].content, `4\t  std::cout << "好好学习，天天向上" << std::endl;\n`);
		assert.equal(parsed.resultRecords, undefined);
	});
	test("Empty line", () => {
		let parsed = parseMI(``);
		assert.ok(parsed);
		assert.equal(parsed.token, undefined);
		assert.equal(parsed.outOfBandRecord.length, 0);
		assert.equal(parsed.resultRecords, undefined);
	});
	test("'(gdb)' line", () => {
		let parsed = parseMI(`(gdb)`);
		assert.ok(parsed);
		assert.equal(parsed.token, undefined);
		assert.equal(parsed.outOfBandRecord.length, 0);
		assert.equal(parsed.resultRecords, undefined);
	});
	test("Simple result record", () => {
		let parsed = parseMI(`1^running`);
		assert.ok(parsed);
		assert.equal(parsed.token, 1);
		assert.equal(parsed.outOfBandRecord.length, 0);
		assert.notEqual(parsed.resultRecords, undefined);
		assert.equal(parsed.resultRecords.resultClass, "running");
		assert.equal(parsed.resultRecords.results.length, 0);
	});
	test("Advanced out of band record (Breakpoint hit)", () => {
		let parsed = parseMI(`*stopped,reason="breakpoint-hit",disp="keep",bkptno="1",frame={addr="0x00000000004e807f",func="D main",args=[{name="args",value="..."}],file="source/app.d",fullname="/path/to/source/app.d",line="157"},thread-id="1",stopped-threads="all",core="0"`);
		assert.ok(parsed);
		assert.equal(parsed.token, undefined);
		assert.equal(parsed.outOfBandRecord.length, 1);
		assert.equal(parsed.outOfBandRecord[0].isStream, false);
		assert.equal(parsed.outOfBandRecord[0].asyncClass, "stopped");
		assert.equal(parsed.outOfBandRecord[0].output.length, 7);
		assert.deepEqual(parsed.outOfBandRecord[0].output[0], ["reason", "breakpoint-hit"]);
		assert.deepEqual(parsed.outOfBandRecord[0].output[1], ["disp", "keep"]);
		assert.deepEqual(parsed.outOfBandRecord[0].output[2], ["bkptno", "1"]);
		let frame = [
			["addr", "0x00000000004e807f"],
			["func", "D main"],
			["args", [[["name", "args"], ["value", "..."]]]],
			["file", "source/app.d"],
			["fullname", "/path/to/source/app.d"],
			["line", "157"]
		];
		assert.deepEqual(parsed.outOfBandRecord[0].output[3], ["frame", frame]);
		assert.deepEqual(parsed.outOfBandRecord[0].output[4], ["thread-id", "1"]);
		assert.deepEqual(parsed.outOfBandRecord[0].output[5], ["stopped-threads", "all"]);
		assert.deepEqual(parsed.outOfBandRecord[0].output[6], ["core", "0"]);
		assert.equal(parsed.resultRecords, undefined);
	});
	test("Advanced result record", () => {
		let parsed = parseMI(`2^done,asm_insns=[src_and_asm_line={line="134",file="source/app.d",fullname="/path/to/source/app.d",line_asm_insn=[{address="0x00000000004e7da4",func-name="_Dmain",offset="0",inst="push   %rbp"},{address="0x00000000004e7da5",func-name="_Dmain",offset="1",inst="mov    %rsp,%rbp"}]}]`);
		assert.ok(parsed);
		assert.equal(parsed.token, 2);
		assert.equal(parsed.outOfBandRecord.length, 0);
		assert.notEqual(parsed.resultRecords, undefined);
		assert.equal(parsed.resultRecords.resultClass, "done");
		assert.equal(parsed.resultRecords.results.length, 1);
		let asm_insns = [
			"asm_insns",
			[
				[
					"src_and_asm_line",
					[
						["line", "134"],
						["file", "source/app.d"],
						["fullname", "/path/to/source/app.d"],
						[
							"line_asm_insn",
							[
								[
									["address", "0x00000000004e7da4"],
									["func-name", "_Dmain"],
									["offset", "0"],
									["inst", "push   %rbp"]
								],
								[
									["address", "0x00000000004e7da5"],
									["func-name", "_Dmain"],
									["offset", "1"],
									["inst", "mov    %rsp,%rbp"]
								]
							]
						]
					]
				]
			]
		];
		assert.deepEqual(parsed.resultRecords.results[0], asm_insns);
		assert.equal(parsed.result("asm_insns.src_and_asm_line.line_asm_insn[1].address"), "0x00000000004e7da5");
	});
	test("Result record with empty list", () => {
		let parsed = parseMI(`22^done,asm_insns=[src_and_asm_line={line="52",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e3a",func-name="interruptHandler",offset="0",opcodes="48 e7 c0 c0",inst="moveml %d0-%d1/%a0-%a1,%sp@-"}]},src_and_asm_line={line="53",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e3e",func-name="interruptHandler",offset="4",opcodes="20 79 00 c1 4f 9c",inst="moveal 0xc14f9c <part+12>,%a0"},{address="0x00c08e44",func-name="interruptHandler",offset="10",opcodes="b0 fc 00 00",inst="cmpaw #0,%a0"},{address="0x00c08e48",func-name="interruptHandler",offset="14",opcodes="67 02",inst="beqs 0xc08e4c <interruptHandler+18>"}]},src_and_asm_line={line="54",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e4a",func-name="interruptHandler",offset="16",opcodes="4e 90",inst="jsr %a0@"}]},src_and_asm_line={line="55",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[]},src_and_asm_line={line="56",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e4c",func-name="interruptHandler",offset="18",opcodes="20 79 00 c1 4f b0",inst="moveal 0xc14fb0 <hw>,%a0"},{address="0x00c08e52",func-name="interruptHandler",offset="24",opcodes="30 28 00 1e",inst="movew %a0@(30),%d0"},{address="0x00c08e56",func-name="interruptHandler",offset="28",opcodes="08 00 00 05",inst="btst #5,%d0"},{address="0x00c08e5a",func-name="interruptHandler",offset="32",opcodes="67 2e",inst="beqs 0xc08e8a <interruptHandler+80>"}]},src_and_asm_line={line="57",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[]},src_and_asm_line={line="58",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e5c",func-name="interruptHandler",offset="34",opcodes="31 7c 00 20 00 9c",inst="movew #32,%a0@(156)"}]},src_and_asm_line={line="59",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e62",func-name="interruptHandler",offset="40",opcodes="31 7c 00 20 00 9c",inst="movew #32,%a0@(156)"}]},src_and_asm_line={line="60",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[]},src_and_asm_line={line="61",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e68",func-name="interruptHandler",offset="46",opcodes="20 79 00 c1 4f a4",inst="moveal 0xc14fa4 <part+20>,%a0"},{address="0x00c08e6e",func-name="interruptHandler",offset="52",opcodes="b0 fc 00 00",inst="cmpaw #0,%a0"},{address="0x00c08e72",func-name="interruptHandler",offset="56",opcodes="67 02",inst="beqs 0xc08e76 <interruptHandler+60>"}]},src_and_asm_line={line="62",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e74",func-name="interruptHandler",offset="58",opcodes="4e 90",inst="jsr %a0@"}]},src_and_asm_line={line="63",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[]},src_and_asm_line={line="64",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[]},src_and_asm_line={line="65",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[]},src_and_asm_line={line="66",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[]},src_and_asm_line={line="67",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e76",func-name="interruptHandler",offset="60",opcodes="20 79 00 c1 4f a0",inst="moveal 0xc14fa0 <part+16>,%a0"},{address="0x00c08e7c",func-name="interruptHandler",offset="66",opcodes="b0 fc 00 00",inst="cmpaw #0,%a0"},{address="0x00c08e80",func-name="interruptHandler",offset="70",opcodes="67 02",inst="beqs 0xc08e84 <interruptHandler+74>"}]},src_and_asm_line={line="68",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e82",func-name="interruptHandler",offset="72",opcodes="4e 90",inst="jsr %a0@"}]},src_and_asm_line={line="69",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[]},src_and_asm_line={line="70",file="/cygdrive/c/amiga-dev/projects/clouds/main.c",fullname="/cygdrive/c/amiga-dev/projects/clouds/main.c",line_asm_insn=[{address="0x00c08e84",func-name="interruptHandler",offset="74",opcodes="52 79 00 c1 4f ac",inst="addqw #1,0xc14fac <part+28>"},{address="0x00c08e8a",func-name="interruptHandler",offset="80",opcodes="4c df 03 03",inst="moveml %sp@+,%d0-%d1/%a0-%a1"},{address="0x00c08e8e",func-name="interruptHandler",offset="84",opcodes="4e 73",inst="rte"}]}]`);
		assert.equal(parsed.resultRecords.results[0][1].length, 19);
	});
	test("valueof children", () => {
		let obj = [
			[
				"frame",
				[
					["level", "0"],
					["addr", "0x0000000000435f70"],
					["func", "D main"],
					["file", "source/app.d"],
					["fullname", "/path/to/source/app.d"],
					["line", "5"]
				]
			],
			[
				"frame",
				[
					["level", "1"],
					["addr", "0x00000000004372d3"],
					["func", "rt.dmain2._d_run_main()"]
				]
			],
			[
				"frame",
				[
					["level", "2"],
					["addr", "0x0000000000437229"],
					["func", "rt.dmain2._d_run_main()"]
				]
			]
		];
		
		assert.equal(MINode.valueOf(obj[0], "@frame.level"), "0");
		assert.equal(MINode.valueOf(obj[0], "@frame.addr"), "0x0000000000435f70");
		assert.equal(MINode.valueOf(obj[0], "@frame.func"), "D main");
		assert.equal(MINode.valueOf(obj[0], "@frame.file"), "source/app.d");
		assert.equal(MINode.valueOf(obj[0], "@frame.fullname"), "/path/to/source/app.d");
		assert.equal(MINode.valueOf(obj[0], "@frame.line"), "5");
		
		assert.equal(MINode.valueOf(obj[1], "@frame.level"), "1");
		assert.equal(MINode.valueOf(obj[1], "@frame.addr"), "0x00000000004372d3");
		assert.equal(MINode.valueOf(obj[1], "@frame.func"), "rt.dmain2._d_run_main()");
		assert.equal(MINode.valueOf(obj[1], "@frame.file"), undefined);
		assert.equal(MINode.valueOf(obj[1], "@frame.fullname"), undefined);
		assert.equal(MINode.valueOf(obj[1], "@frame.line"), undefined);
	});
});