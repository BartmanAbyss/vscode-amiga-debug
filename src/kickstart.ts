import * as fs from 'fs';
import * as path from 'path';

// https://5e7b2c0d467b5.site123.me/
// https://wandel.ca/homepage/execdis/exec_disassembly.txt
// https://github.com/jotd666/amiga68ktools/blob/master/tools/LVOs.i

interface LibraryFunction {
	lvo: number;
	name: string;
	minVersion: number;
}

export class FD {
	public functions: LibraryFunction[] = [];

	constructor(private path: string) {
		const data = fs.readFileSync(path).toString().replace(/\r/g, '').split('\n');
		let bias = 0;
		let minVersion = 0;
		let isPublic = true;
		for(const line of data) {
			if(line.startsWith('##')) {
				const cmd = line.substring(2);
				if(cmd.startsWith('bias'))
					bias = parseInt(cmd.substring(5));
				else if(cmd === 'public')
					isPublic = true;
				else if(cmd === 'private')
					isPublic = false;
				else if(cmd === 'end')
					break;
			} else if(line.startsWith('*')) {
				const match = line.match(/functions in V([0-9]+) or higher/);
				if(match)
					minVersion = parseInt(match[1]);
			} else {
				if(isPublic) {
					const func = line.split('(', 1)[0] || line;
					this.functions.push({ lvo: bias, name: func, minVersion });
				}
				bias += 6;
			}
		}
	}
}

const RTC_MATCHWORD = 0x4AFC; // from exec/resident.h
const RTF_AUTOINIT = 1<<7; // rt_Init points to data structure
const RTF_AFTERDOS = 1<<2;
const RTF_SINGLETASK = 1<<1;
const RTF_COLDSTART = 1<<0;
const NT_LIBRARY = 9; // from exec/nodes.h

// TODO: dos.library needs special handling to get to the vectors

const libraryVectors: { [x: string]: number[] } = {
	// Kickstart v1.3 r34.5 (1987)(Commodore)(A500-A1000-A2000-CDTV)[!].rom
	'exec 34.2 (28 Oct 1987)': [ 0xFC1A7C, -1 ],
	'graphics 34.1 (18 Aug 1987)': [ 0xFCB05A, 0 ],
	'layers 34.1 (18 Aug 1987)': [ 0xFE0B4E, -1 ],
	'romboot 34.1 (18 Aug 1987)': [ 0xFEB114, 0 ],
};

export class Kickstart {
	private data: Buffer;
	private base = 0xfc0000;
	private idc = '';
	constructor(private path: string, private fdPath: string) {
		this.idc += '#include <idc.idc>\nstatic main(void) {\n';
		this.data = fs.readFileSync(path);
		for(let i = 0; i < this.data.byteLength; i += 2) {
			if(this.data.readInt16BE(i) === RTC_MATCHWORD && this.data.readInt32BE(i + 2) === this.base + i && this.data[i + 12] === NT_LIBRARY) {
				this.parseLibrary(i);
			}
		}
		this.idc += '}\n';
		fs.writeFileSync(path + '.idc', this.idc);
	}

	private parseLibrary(offset: number) {
		const version = this.data[offset + 11];
		const getString = (offset: number) => {
			let str = '';
			for(let s = 0; this.data[offset + s] !== 0 && this.data[offset + s] !== 0xd && this.data[offset + s] !== 0xa; s++)
				str += String.fromCharCode(this.data[offset + s]);
			return str;
		};
		const name = getString(this.data.readInt32BE(offset + 14) - this.base);
		const id = getString(this.data.readInt32BE(offset + 18) - this.base);
		const vectors: number[] = [];
		if(this.data[offset + 10] & RTF_AUTOINIT) {
			const initOffset = this.data.readInt32BE(offset + 22) - this.base;
			const vectorsOffset = this.data.readInt32BE(initOffset + 4) - this.base;
			if(this.data.readInt16BE(vectorsOffset) === -1) { // relative
				for(let v = 2; this.data.readInt16BE(vectorsOffset + v) !== -1; v += 2)
					vectors.push(vectorsOffset + this.base + this.data.readInt16BE(vectorsOffset + v));
			} else { // absolute
				for(let v = 0; this.data.readInt32BE(vectorsOffset + v) !== -1; v += 4)
					vectors.push(this.data.readInt32BE(vectorsOffset + v));
			}
		} else if(libraryVectors[id]) { // lookup
			const vectorsOffset = libraryVectors[id][0] - this.base;
			if(libraryVectors[id][1] === 0)
				for(let v = 0; this.data.readInt32BE(vectorsOffset + v) !== -1; v += 4)
					vectors.push(this.data.readInt32BE(vectorsOffset + v));
			else if(libraryVectors[id][1] === -1)
				for(let v = 0; this.data.readInt16BE(vectorsOffset + v) !== -1; v += 2)
					vectors.push(vectorsOffset + this.base + this.data.readInt16BE(vectorsOffset + v));
		}
		console.log(`Found library @ ${(offset + this.base).toString(16)}: ${name} V${version} [${id}] flags: ${this.data[offset + 10].toString(16)}; ${vectors.length} LVOs`);
		this.idc += `\t// ${id}\n`;
		const fdPath = path.join(this.fdPath, name.replace('.library', '_lib.fd'));
		if(fs.existsSync(fdPath)) {
			const fd = new FD(fdPath);
			for(const func of fd.functions) {
				const index = func.lvo / 6 - 1;
				if(version >= func.minVersion && vectors.length > index)
					this.idc += `\tMakeName (0X${vectors[index].toString(16)}, "${func.name}_${func.lvo}");\n`;
			}
		}

		//for(const v of vectors)
		//	console.log(`  ${v.toString(16)}`);
		//if(!vectors.length)
		//	console.log('  nopes');
	}
}

/*
Function name	Segment	Start	Length	Locals	Arguments	R	F	L	S	B	T	=
AddDevice_432	ROM	0000000000FC0690	0000000E			R	.	.	.	.	.	.
RemDevice_438	ROM	0000000000FC069E	00000004			R	.	.	.	.	.	.
OpenDevice_444	ROM	0000000000FC06A2	0000004E			R	.	.	.	.	.	.
CloseDevice_450	ROM	0000000000FC06F0	00000016			R	.	.	.	.	.	.
SendIO_462	ROM	0000000000FC0706	00000012			R	.	.	.	.	.	.
DoIO_456	ROM	0000000000FC0718	00000072			R	.	.	.	.	.	.
CheckIO_468	ROM	0000000000FC078A	0000001C			R	.	.	.	.	.	.
AbortIO_480	ROM	0000000000FC07A6	0000000E			R	.	.	.	.	.	.
SumKickData_612	ROM	0000000000FC0A78	00000050			R	.	.	.	.	.	.
FindResident_96	ROM	0000000000FC0AFC	00000030			R	.	.	.	.	.	.
InitCode_72	ROM	0000000000FC0B2C	00000038			R	.	.	.	.	.	.
InitResident_102	ROM	0000000000FC0B64	00000058			R	.	.	.	.	.	.
InitStruct_78	ROM	0000000000FC0C04	00000072			R	.	.	.	.	.	.
Dispatch68881	ROM	0000000000FC1124	00000008			R	.	.	.	.	.	.
SetSR_144	ROM	0000000000FC115E	0000000C			R	.	.	.	.	.	.
GetCC_528	ROM	0000000000FC117C	00000008			R	.	.	.	.	.	.
SuperState_150	ROM	0000000000FC1184	0000000C			R	.	.	.	.	.	.
UserState_156	ROM	0000000000FC11B0	0000000A			R	.	.	.	.	.	.
SetIntVector_162	ROM	0000000000FC11CA	00000046			R	.	.	.	.	.	.
AddIntServer_168	ROM	0000000000FC1210	00000040			R	.	.	.	.	.	.
RemIntServer_174	ROM	0000000000FC1250	00000048			R	.	.	.	.	.	.
Cause_180	ROM	0000000000FC135C	00000060			R	.	.	.	.	.	.
Disable_120	ROM	0000000000FC1428	0000000E			R	.	.	.	.	.	.
Enable_126	ROM	0000000000FC1436	00000010	00000001	00000000	R	.	.	.	.	.	.
AddLibrary_396	ROM	0000000000FC1448	0000000E			R	.	.	.	.	.	.
RemLibrary_402	ROM	0000000000FC1456	00000016			R	.	.	.	.	.	.
OldOpenLibrary_408	ROM	0000000000FC146C	00000008			R	.	.	.	.	.	.
OpenLibrary_552	ROM	0000000000FC1474	0000002E			R	.	.	.	.	.	.
CloseLibrary_414	ROM	0000000000FC14A2	00000014			R	.	.	.	.	.	.
SetFunction_420	ROM	0000000000FC14B6	0000001E			R	.	.	.	.	.	.
SumLibrary_426	ROM	0000000000FC14D4	00000054			R	.	.	.	.	.	.
MakeLibrary_84	ROM	0000000000FC1528	0000008A			R	.	.	.	.	.	.
MakeFunctions_90	ROM	0000000000FC15B2	00000036			R	.	.	.	.	.	.
Insert_234	ROM	0000000000FC15E8	0000002C			R	.	.	.	.	.	.
AddHead_240	ROM	0000000000FC1614	00000010			R	.	.	.	.	.	.
AddTail_246	ROM	0000000000FC1624	00000018			R	.	.	.	.	.	.
Remove_252	ROM	0000000000FC163C	0000000E			R	.	.	.	.	.	.
RemHead_258	ROM	0000000000FC164A	00000010			R	.	.	.	.	.	.
RemTail_264	ROM	0000000000FC165A	00000016			R	.	.	.	.	.	.
Enqueue_270	ROM	0000000000FC1670	00000026			R	.	.	.	.	.	.
FindName_276	ROM	0000000000FC1696	00000028			R	.	.	.	.	.	.
Allocate_186	ROM	0000000000FC16D8	00000052			R	.	.	.	.	.	.
Deallocate_192	ROM	0000000000FC1740	00000090			R	.	.	.	.	.	.
AllocMem_198	ROM	0000000000FC17D0	0000005C			R	.	.	.	.	.	.
FreeMem_210	ROM	0000000000FC182C	0000002A			R	.	.	.	.	.	.
TypeOfMem_534	ROM	0000000000FC1856	00000026			R	.	.	.	.	.	.
AllocAbs_204	ROM	0000000000FC187C	00000090			R	.	.	.	.	.	.
AvailMem_216	ROM	0000000000FC190C	0000004E			R	.	.	.	.	.	.
AllocEntry_222	ROM	0000000000FC195A	0000008E			R	.	.	.	.	.	.
FreeEntry_228	ROM	0000000000FC19E8	0000003E			R	.	.	.	.	.	.
AddMemList_618	ROM	0000000000FC1A26	00000054			R	.	.	.	.	.	.
GetMsg_372	ROM	0000000000FC1BEA	0000002E			R	.	.	.	.	.	.
ReplyMsg_378	ROM	0000000000FC1C18	0000001A			R	.	.	.	.	.	.
WaitPort_384	ROM	0000000000FC1C32	00000028			R	.	.	.	.	.	.
FindPort_390	ROM	0000000000FC1C5A	0000000A			R	.	.	.	.	.	.
AddResource_486	ROM	0000000000FC1C64	00000008			R	.	.	.	.	.	.
RemResource_492	ROM	0000000000FC1C6C	00000004			R	.	.	.	.	.	.
OpenResource_498	ROM	0000000000FC1C70	00000012			R	.	.	.	.	.	.
AddTask_282	ROM	0000000000FC1C84	000000A4			R	.	.	.	.	.	.
TaskExit	ROM	0000000000FC1D28	00000088			R	.	.	.	.	.	.
FindTask_294	ROM	0000000000FC1DB0	00000054			R	.	.	.	.	.	.
SetTaskPri_300	ROM	0000000000FC1E04	00000050			R	.	.	.	.	.	.
SetExcept_312	ROM	0000000000FC1E54	000000B8			R	.	.	.	.	.	.
Wait_318	ROM	0000000000FC1F0C	00000068			R	.	.	.	.	.	.
AllocTrap_342	ROM	0000000000FC1FCA	00000026			R	.	.	.	.	.	.
FreeTrap_348	ROM	0000000000FC1FF0	00000010			R	.	.	.	.	.	.
AllocSignal_330	ROM	0000000000FC2000	00000038			R	.	.	.	.	.	.
FreeSignal_336	ROM	0000000000FC2038	00000010			R	.	.	.	.	.	.
RawDoFmt_522	ROM	0000000000FC2124	00000080			R	.	.	.	.	.	.
Debug_114	ROM	0000000000FC236A	0000000A			R	.	.	.	.	.	.
Procure_540	ROM	0000000000FC2D98	00000016			R	.	.	.	.	.	.
Vacate_546	ROM	0000000000FC2DAE	00000022			R	.	.	.	.	.	.
InitSemaphore_558	ROM	0000000000FC2DD0	00000020			R	.	.	.	.	.	.
ObtainSemaphore_564	ROM	0000000000FC2DF0	00000050	00000014	00000000	R	.	.	.	.	.	.
ReleaseSemaphore_570	ROM	0000000000FC2E40	00000064	00000001	00000000	R	.	.	.	.	.	.
AttemptSemaphore_576	ROM	0000000000FC2EA4	00000030			R	.	.	.	.	.	.
ObtainSemaphoreList_582	ROM	0000000000FC2ED4	00000076			R	.	.	.	.	.	.
ReleaseSemaphoreList_588	ROM	0000000000FC2F4A	00000016			R	.	.	.	.	.	.
AddSemaphore_600	ROM	0000000000FC2F60	0000000C			R	.	.	.	.	.	.
RemSemaphore_606	ROM	0000000000FC2F6C	00000004			R	.	.	.	.	.	.
FindSemaphore_594	ROM	0000000000FC2F70	0000000A			R	.	.	.	.	.	.
CopyMemQuick_630	ROM	0000000000FC2F7C	00000004			R	.	.	.	.	.	.
CopyMem_624	ROM	0000000000FC2F80	00000070			R	.	.	.	.	.	.
ConfigBoard_60	ROM	0000000000FC4CDA	0000008E			R	.	.	.	.	.	.
ConfigChain_66	ROM	0000000000FC4E8A	00000056			R	.	.	.	.	.	.
AllocConfigDev_48	ROM	0000000000FC4EF8	00000016			R	.	.	.	.	.	.
FreeConfigDev_84	ROM	0000000000FC4F0E	00000012			R	.	.	.	.	.	.
AllocExpansionMem_54	ROM	0000000000FC4F20	0000004E			R	.	.	.	.	.	.
AllocBoardMem_42	ROM	0000000000FC4FBC	00000018			R	.	.	.	.	.	.
FreeBoardMem_78	ROM	0000000000FC4FD4	00000010			R	.	.	.	.	.	.
FreeExpansionMem_90	ROM	0000000000FC4FF0	00000038			R	.	.	.	.	.	.
AddConfigDev_30	ROM	0000000000FC5028	0000001C			R	.	.	.	.	.	.
RemConfigDev_108	ROM	0000000000FC5044	00000020			R	.	.	.	.	.	.
FindConfigDev_72	ROM	0000000000FC5064	00000036			R	.	.	.	.	.	.
ReadExpansionByte_96	ROM	0000000000FC509A	0000001C			R	.	.	.	.	.	.
WriteExpansionByte_114	ROM	0000000000FC50B6	00000014			R	.	.	.	.	.	.
ReadExpansionRom_102	ROM	0000000000FC50CA	0000005E			R	.	.	.	.	.	.
ObtainConfigBinding_120	ROM	0000000000FC517A	00000012			R	.	.	.	.	.	.
ReleaseConfigBinding_126	ROM	0000000000FC518C	00000012			R	.	.	.	.	.	.
SetCurrentBinding_132	ROM	0000000000FC519E	0000000C			R	.	.	.	.	.	.
GetCurrentBinding_138	ROM	0000000000FC51AA	00000010			R	.	.	.	.	.	.
MakeDosNode_144	ROM	0000000000FC51DC	000000D8	0000003A	00000000	R	.	.	.	.	.	.
AddDosNode_150	ROM	0000000000FC52F0	00000060			R	.	.	.	.	.	.
AreaMove_252	ROM	0000000000FC5430	00000094			R	.	.	.	.	.	.
BltClear_300	ROM	0000000000FC54C4	000000E0			R	.	.	.	.	.	.
Draw_246	ROM	0000000000FC5634	000001C4	00000052	00000000	R	.	.	.	.	.	.
InitArea_282	ROM	0000000000FC57F8	0000001E			R	.	.	.	.	.	.
Move_240	ROM	0000000000FC5818	00000014			R	.	.	.	.	.	.
MrgCop_210	ROM	0000000000FC582C	0000000C			R	.	.	.	.	.	.
QBlit_276	ROM	0000000000FC5838	00000016			R	.	.	.	.	.	.
RectFill_306	ROM	0000000000FC5990	000000B4			R	.	.	.	.	.	.
SetRGB4_288	ROM	0000000000FC5A44	00000012			R	.	.	.	.	.	.
WaitBlit_228	ROM	0000000000FC5A58	00000024			R	.	.	.	.	.	.
WaitTOF_270	ROM	0000000000FC5A7C	00000006			R	.	.	.	.	.	.
Flood_330	ROM	0000000000FC5AD0	00000014			R	.	.	.	.	.	.
PolyDraw_336	ROM	0000000000FC5AE4	00000020			R	.	.	.	.	.	.
ScrollRaster_396	ROM	0000000000FC5B04	00000012			R	.	.	.	.	.	.
InitRastPort_198	ROM	0000000000FC5B40	0000000A			R	.	.	.	.	.	.
LoadRGB4_192	ROM	0000000000FC5B4C	00000012			R	.	.	.	.	.	.
SetRast_234	ROM	0000000000FC5B60	0000006A			R	.	.	.	.	.	.
BltPattern_312	ROM	0000000000FC5C70	0000003C			R	.	.	.	.	.	.
WaitBOVP_402	ROM	0000000000FC5E58	00000046	00000000	00000008	R	.	.	.	.	.	.
InitTmpRas_468	ROM	0000000000FC5EA0	0000000C			R	.	.	.	.	.	.
SetAPen_342	ROM	0000000000FC5EAC	00000006			R	.	.	.	.	.	.
SetBPen_348	ROM	0000000000FC5EB2	00000006			R	.	.	.	.	.	.
SetDrMd_354	ROM	0000000000FC5EB8	00000016			R	.	.	.	.	.	.
VBeamPos_384	ROM	0000000000FC5ECE	00000010			R	.	.	.	.	.	.
AreaDraw_258	ROM	0000000000FC5EE0	00000050			R	.	.	.	.	.	.
AreaEnd_264	ROM	0000000000FC5F36	000002F2	00000082	00000000	R	.	.	.	.	.	.
AndRectRegion_504	ROM	0000000000FC628C	00000010			R	.	.	.	.	.	.
OrRectRegion_510	ROM	0000000000FC629C	00000010			R	.	.	.	.	.	.
OrRegionRegion_612	ROM	0000000000FC62AC	00000010			R	.	.	.	.	.	.
XorRectRegion_558	ROM	0000000000FC62BC	00000010			R	.	.	.	.	.	.
ClearRegion_528	ROM	0000000000FC62CE	0000000C			R	.	.	.	.	.	.
DisposeRegion_534	ROM	0000000000FC62DA	0000000C			R	.	.	.	.	.	.
ClearRectRegion_522	ROM	0000000000FC62E6	00000010			R	.	.	.	.	.	.
AndRegionRegion_624	ROM	0000000000FC62F6	00000010			R	.	.	.	.	.	.
XorRegionRegion_618	ROM	0000000000FC6306	00000010			R	.	.	.	.	.	.
AllocRaster_492	ROM	0000000000FC6318	00000012			R	.	.	.	.	.	.
FreeRaster_498	ROM	0000000000FC6338	00000014			R	.	.	.	.	.	.
CopySBitMap_450	ROM	0000000000FC634C	0000000C			R	.	.	.	.	.	.
SyncSBitMap_444	ROM	0000000000FC6358	0000000C			R	.	.	.	.	.	.
InitView_360	ROM	0000000000FC6364	00000016			R	.	.	.	.	.	.
InitVPort_204	ROM	0000000000FC637C	00000010			R	.	.	.	.	.	.
LockLayerRom_432	ROM	0000000000FC638C	00000016			R	.	.	.	.	.	.
UnlockLayerRom_438	ROM	0000000000FC63A4	00000016			R	.	.	.	.	.	.
MakeVPort_216	ROM	0000000000FC63BC	00000010			R	.	.	.	.	.	.
LoadView_222	ROM	0000000000FC63CC	0000000C			R	.	.	.	.	.	.
QBSBlit_294	ROM	0000000000FC63D8	000000AA			R	.	.	.	.	.	.
InitBitMap_390	ROM	0000000000FC6484	00000016			R	.	.	.	.	.	.
FreeVPortCopLists_540	ROM	0000000000FC649C	0000000E			R	.	.	.	.	.	.
FreeCopList_546	ROM	0000000000FC64AC	0000000E			R	.	.	.	.	.	.
OwnBlitter_456	ROM	0000000000FC64BC	00000018			R	.	.	.	.	.	.
DisownBlitter_462	ROM	0000000000FC64D4	00000068	00000001	00000000	R	.	.	.	.	.	.
FreeCprList_564	ROM	0000000000FC653C	0000000E			R	.	.	.	.	.	.
GetColorMap_570	ROM	0000000000FC654C	00000058	00000008	00000000	R	.	.	.	.	.	.
FreeColorMap_576	ROM	0000000000FC65A4	00000024			R	.	.	.	.	.	.
GetRGB4_582	ROM	0000000000FC65C8	00000018			R	.	.	.	.	.	.
ScrollVPort_588	ROM	0000000000FC65E0	0000000C			R	.	.	.	.	.	.
ReadPixel_318	ROM	0000000000FC65EC	00000108			R	.	.	.	.	.	.
WritePixel_324	ROM	0000000000FC66F4	00000160			R	.	.	.	.	.	.
ClipBlit_552	ROM	0000000000FC6854	00000018			R	.	.	.	.	.	.
BltBitMapRastPort_606	ROM	0000000000FC686C	00000018			R	.	.	.	.	.	.
BltMaskBitMapRastPort_636	ROM	0000000000FC6884	0000001A			R	.	.	.	.	.	.
SetRGB4CM_630	ROM	0000000000FC6A8C	00000038			R	.	.	.	.	.	.
DrawEllipse_180	ROM	0000000000FC6AC4	00000016			R	.	.	.	.	.	.
AttemptLockLayerRom_654	ROM	0000000000FC6ADC	00000016			R	.	.	.	.	.	.
AreaEllipse_186	ROM	0000000000FC6AF4	000000BC			R	.	.	.	.	.	.
AddBob_96	ROM	0000000000FC72E0	0000000E			R	.	.	.	.	.	.
AddVSprite_102	ROM	0000000000FC72EE	0000000E			R	.	.	.	.	.	.
DoCollision_108	ROM	0000000000FC72FC	0000000C			R	.	.	.	.	.	.
DrawGList_114	ROM	0000000000FC7308	0000000E			R	.	.	.	.	.	.
InitGels_120	ROM	0000000000FC7316	00000012			R	.	.	.	.	.	.
InitMasks_126	ROM	0000000000FC7328	0000000C			R	.	.	.	.	.	.
RemIBob_132	ROM	0000000000FC7334	00000012			R	.	.	.	.	.	.
RemVSprite_138	ROM	0000000000FC7346	0000000C			R	.	.	.	.	.	.
SetCollision_144	ROM	0000000000FC7352	00000012			R	.	.	.	.	.	.
SortGList_150	ROM	0000000000FC7364	0000000C			R	.	.	.	.	.	.
AddAnimOb_156	ROM	0000000000FC7370	00000012			R	.	.	.	.	.	.
Animate_162	ROM	0000000000FC7382	0000000E			R	.	.	.	.	.	.
GetGBuffers_168	ROM	0000000000FC7390	00000012			R	.	.	.	.	.	.
InitGMasks_174	ROM	0000000000FC73A2	0000000C			R	.	.	.	.	.	.
FreeGBuffers_600	ROM	0000000000FC73AE	00000012			R	.	.	.	.	.	.
BltBitMap_30	ROM	0000000000FC74AA	00000132			R	.	.	.	.	.	.
BltTemplate_36	ROM	0000000000FC7A12	00000124			R	.	.	.	.	.	.
ClearEOL_42	ROM	0000000000FC7CC8	00000038			R	.	.	.	.	.	.
ClearScreen_48	ROM	0000000000FC7D00	00000042			R	.	.	.	.	.	.
OpenFont_72	ROM	0000000000FC7D84	0000012A			R	.	.	.	.	.	.
CloseFont_78	ROM	0000000000FC7EAE	0000001E	00000001	00000000	R	.	.	.	.	.	.
AddFont_480	ROM	0000000000FC7ECC	0000003A			R	.	.	.	.	.	.
RemFont_486	ROM	0000000000FC7F06	0000004E			R	.	.	.	.	.	.
AskFont_474	ROM	0000000000FC7F54	00000012			R	.	.	.	.	.	.
SetFont_66	ROM	0000000000FC7F66	0000001C			R	.	.	.	.	.	.
AskSoftStyle_84	ROM	0000000000FC7F82	00000024			R	.	.	.	.	.	.
SetSoftStyle_90	ROM	0000000000FC7FA6	00000032			R	.	.	.	.	.	.
TextLength_54	ROM	0000000000FC7FD8	00000060			R	.	.	.	.	.	.
Text_60	ROM	0000000000FC8038	00000404			R	.	.	.	.	.	.
CBump_366	ROM	0000000000FC9AB8	0000000C			R	.	.	.	.	.	.
UCopperListInit_594	ROM	0000000000FC9AC4	00000010			R	.	.	.	.	.	.
CMove_372	ROM	0000000000FC9AD4	00000012			R	.	.	.	.	.	.
CWait_378	ROM	0000000000FC9AE6	00000012			R	.	.	.	.	.	.
GetSprite_408	ROM	0000000000FC9AF8	0000000E			R	.	.	.	.	.	.
FreeSprite_414	ROM	0000000000FC9B06	0000000C			R	.	.	.	.	.	.
ChangeSprite_420	ROM	0000000000FC9B12	00000012			R	.	.	.	.	.	.
MoveSprite_426	ROM	0000000000FC9B24	00000014			R	.	.	.	.	.	.
NewRegion_516	ROM	0000000000FCF418	00000014			R	.	.	.	.	.	.
MakeLibrary	ROM	0000000000FD3B88	00000020	00000000	00000010	R	.	.	.	.	.	.
Alert	ROM	0000000000FD3BA8	0000001C	00000000	00000008	R	.	.	.	.	.	.
Disable	ROM	0000000000FD3BC4	00000010			R	.	.	.	.	.	.
Enable	ROM	0000000000FD3BD4	00000010			R	.	.	.	.	.	.
Forbid	ROM	0000000000FD3BE4	00000010			R	.	.	.	.	.	.
Permit	ROM	0000000000FD3BF4	00000010			R	.	.	.	.	.	.
SetIntVector	ROM	0000000000FD3C04	00000016	00000000	00000004	R	.	.	.	.	.	.
AddIntServer	ROM	0000000000FD3C1C	00000016	00000000	00000004	R	.	.	.	.	.	.
AllocMem	ROM	0000000000FD3C34	00000016	00000000	00000004	R	.	.	.	.	.	.
FreeMem	ROM	0000000000FD3C4C	00000018	00000000	00000008	R	.	.	.	.	.	.
AddTail	ROM	0000000000FD3C64	00000016	00000000	00000004	R	.	.	.	.	.	.
Remove	ROM	0000000000FD3C7C	00000014	00000000	00000004	R	.	.	.	.	.	.
RemHead	ROM	0000000000FD3C90	00000014	00000000	00000004	R	.	.	.	.	.	.
FindTask	ROM	0000000000FD3CA4	00000014	00000000	00000004	R	.	.	.	.	.	.
SetSignal	ROM	0000000000FD3CB8	00000016	00000000	00000004	R	.	.	.	.	.	.
Wait	ROM	0000000000FD3CD0	00000014	00000000	00000004	R	.	.	.	.	.	.
Signal	ROM	0000000000FD3CE4	00000018	00000000	00000008	R	.	.	.	.	.	.
AddLibrary	ROM	0000000000FD3CFC	00000014	00000000	00000004	R	.	.	.	.	.	.
OpenResource	ROM	0000000000FD3D10	00000018	00000000	00000008	R	.	.	.	.	.	.
InitSemaphore	ROM	0000000000FD3D28	00000014	00000000	00000004	R	.	.	.	.	.	.
ObtainSemaphore	ROM	0000000000FD3D3C	00000014	00000000	00000004	R	.	.	.	.	.	.
ReleaseSemaphore	ROM	0000000000FD3D50	00000014	00000000	00000004	R	.	.	.	.	.	.
OpenIntuition_30	ROM	0000000000FDFB4C	0000000C			R	.	.	.	.	.	.
Intuition_36	ROM	0000000000FDFB58	00000006			R	.	.	.	.	.	.
AddGadget_42	ROM	0000000000FDFB5E	00000012			R	.	.	.	.	.	.
ClearDMRequest_48	ROM	0000000000FDFB70	0000000C			R	.	.	.	.	.	.
ClearMenuStrip_54	ROM	0000000000FDFB7C	0000000C			R	.	.	.	.	.	.
ClearPointer_60	ROM	0000000000FDFB88	0000000C			R	.	.	.	.	.	.
CloseScreen_66	ROM	0000000000FDFB94	0000000C			R	.	.	.	.	.	.
CloseWindow_72	ROM	0000000000FDFBA0	0000000C			R	.	.	.	.	.	.
CloseWorkBench_78	ROM	0000000000FDFBAC	00000006			R	.	.	.	.	.	.
CurrentTime_84	ROM	0000000000FDFBB2	0000000E			R	.	.	.	.	.	.
DisplayAlert_90	ROM	0000000000FDFBC0	00000012			R	.	.	.	.	.	.
DisplayBeep_96	ROM	0000000000FDFBD2	0000000C			R	.	.	.	.	.	.
DoubleClick_102	ROM	0000000000FDFBDE	00000010			R	.	.	.	.	.	.
DrawBorder_108	ROM	0000000000FDFBF0	00000014			R	.	.	.	.	.	.
DrawImage_114	ROM	0000000000FDFC04	00000014			R	.	.	.	.	.	.
EndRequest_120	ROM	0000000000FDFC18	0000000E			R	.	.	.	.	.	.
GetDefPrefs_126	ROM	0000000000FDFC26	0000000E			R	.	.	.	.	.	.
GetPrefs_132	ROM	0000000000FDFC34	0000000E			R	.	.	.	.	.	.
InitRequester_138	ROM	0000000000FDFC42	0000000C			R	.	.	.	.	.	.
ItemAddress_144	ROM	0000000000FDFC4E	0000000E			R	.	.	.	.	.	.
ModifyIDCMP_150	ROM	0000000000FDFC5C	0000000E			R	.	.	.	.	.	.
NewModifyProp_468	ROM	0000000000FDFC6A	00000004			R	.	.	.	.	.	.
ModifyProp_156	ROM	0000000000FDFC6E	0000001A			R	.	.	.	.	.	.
MoveScreen_162	ROM	0000000000FDFC88	00000012			R	.	.	.	.	.	.
MoveWindow_168	ROM	0000000000FDFC9A	00000012			R	.	.	.	.	.	.
OffGadget_174	ROM	0000000000FDFCAC	00000010			R	.	.	.	.	.	.
OffMenu_180	ROM	0000000000FDFCBC	0000000E			R	.	.	.	.	.	.
OnGadget_186	ROM	0000000000FDFCCA	00000010			R	.	.	.	.	.	.
OnMenu_192	ROM	0000000000FDFCDA	0000000E			R	.	.	.	.	.	.
OpenScreen_198	ROM	0000000000FDFCE8	0000000C			R	.	.	.	.	.	.
OpenWindow_204	ROM	0000000000FDFCF4	0000000C			R	.	.	.	.	.	.
OpenWorkBench_210	ROM	0000000000FDFD00	00000006			R	.	.	.	.	.	.
PrintIText_216	ROM	0000000000FDFD06	00000014			R	.	.	.	.	.	.
RefreshGadgets_222	ROM	0000000000FDFD1A	00000010			R	.	.	.	.	.	.
RemoveGadget_228	ROM	0000000000FDFD2A	0000000E			R	.	.	.	.	.	.
ReportMouse_234	ROM	0000000000FDFD38	0000000E			R	.	.	.	.	.	.
Request_240	ROM	0000000000FDFD46	0000000E			R	.	.	.	.	.	.
ScreenToBack_246	ROM	0000000000FDFD54	0000000C			R	.	.	.	.	.	.
ScreenToFront_252	ROM	0000000000FDFD60	0000000C			R	.	.	.	.	.	.
SetDMRequest_258	ROM	0000000000FDFD6C	0000000E			R	.	.	.	.	.	.
SetMenuStrip_264	ROM	0000000000FDFD7A	0000000E			R	.	.	.	.	.	.
SetPointer_270	ROM	0000000000FDFD88	00000014			R	.	.	.	.	.	.
SetWindowTitles_276	ROM	0000000000FDFD9C	00000010			R	.	.	.	.	.	.
ShowTitle_282	ROM	0000000000FDFDAC	0000000E			R	.	.	.	.	.	.
SizeWindow_288	ROM	0000000000FDFDBA	00000012			R	.	.	.	.	.	.
ViewAddress_294	ROM	0000000000FDFDCC	00000006			R	.	.	.	.	.	.
ViewPortAddress_300	ROM	0000000000FDFDD2	0000000C			R	.	.	.	.	.	.
WindowToBack_306	ROM	0000000000FDFDDE	0000000C			R	.	.	.	.	.	.
WindowToFront_312	ROM	0000000000FDFDEA	0000000C			R	.	.	.	.	.	.
WindowLimits_318	ROM	0000000000FDFDF6	00000012			R	.	.	.	.	.	.
SetPrefs_324	ROM	0000000000FDFE08	00000012			R	.	.	.	.	.	.
IntuiTextLength_330	ROM	0000000000FDFE1A	0000000C			R	.	.	.	.	.	.
WBenchToBack_336	ROM	0000000000FDFE26	00000006			R	.	.	.	.	.	.
WBenchToFront_342	ROM	0000000000FDFE2C	00000006			R	.	.	.	.	.	.
AutoRequest_348	ROM	0000000000FDFE32	00000014			R	.	.	.	.	.	.
BeginRefresh_354	ROM	0000000000FDFE46	0000000C			R	.	.	.	.	.	.
BuildSysRequest_360	ROM	0000000000FDFE52	00000014			R	.	.	.	.	.	.
EndRefresh_366	ROM	0000000000FDFE66	0000000E			R	.	.	.	.	.	.
FreeSysRequest_372	ROM	0000000000FDFE74	0000000C			R	.	.	.	.	.	.
MakeScreen_378	ROM	0000000000FDFE80	0000000C			R	.	.	.	.	.	.
RemakeDisplay_384	ROM	0000000000FDFE8C	00000006			R	.	.	.	.	.	.
RethinkDisplay_390	ROM	0000000000FDFE92	00000006			R	.	.	.	.	.	.
AllocRemember_396	ROM	0000000000FDFE98	00000012			R	.	.	.	.	.	.
sub_FDFEAA	ROM	0000000000FDFEAA	0000000C			R	.	.	.	.	.	.
FreeRemember_408	ROM	0000000000FDFEB6	0000000E			R	.	.	.	.	.	.
LockIBase_414	ROM	0000000000FDFEC4	0000000C			R	.	.	.	.	.	.
UnlockIBase_420	ROM	0000000000FDFED0	0000000C			R	.	.	.	.	.	.
GetScreenData_426	ROM	0000000000FDFEDC	00000012			R	.	.	.	.	.	.
RefreshGList_432	ROM	0000000000FDFEEE	00000012			R	.	.	.	.	.	.
AddGList_438	ROM	0000000000FDFF00	00000014			R	.	.	.	.	.	.
RemoveGList_444	ROM	0000000000FDFF14	00000012			R	.	.	.	.	.	.
ActivateWindow_450	ROM	0000000000FDFF26	0000000C			R	.	.	.	.	.	.
RefreshWindowFrame_456	ROM	0000000000FDFF32	0000000C			R	.	.	.	.	.	.
ActivateGadget_462	ROM	0000000000FDFF3E	00000010			R	.	.	.	.	.	.
SPFlt_36	ROM	0000000000FE3F28	00000038			R	.	.	.	.	.	.
SPCmp_42	ROM	0000000000FE3F60	0000003C			R	.	.	.	.	.	.
SPTst_48	ROM	0000000000FE3F9C	00000028			R	.	.	.	.	.	.
SPAbs_54	ROM	0000000000FE3FC4	00000006			R	.	.	.	.	.	.
SPNeg_60	ROM	0000000000FE3FCA	0000000A			R	.	.	.	.	.	.
SPSub_72	ROM	0000000000FE3FD4	0000010E			R	.	.	.	.	.	.
SPMul_78	ROM	0000000000FE40E4	0000009A			R	.	.	.	.	.	.
SPCeil_96	ROM	0000000000FE4228	0000000A			R	.	.	.	.	.	.
SPFloor_90	ROM	0000000000FE4232	00000056	00000004	00000000	R	.	.	.	.	.	.
*/