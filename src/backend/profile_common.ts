import { ICpuProfileRaw, IProfileNode } from '../client/types';
import { SourceLine, CallFrame } from './profile_types';

export function profileCommon(weightPerLocation: number[], sourceLocations: CallFrame[]): ICpuProfileRaw {
	// generate JSON .cpuprofile
	const nodes: IProfileNode[] = [];
	const nodeMap: Map<string, IProfileNode> = new Map();
	const samples: number[] = [];
	const timeDeltas: number[] = [];
	const startTime = 0;
	let endTime = 0;
	let nextNodeId = 1;
	let nextLocationId = 0;

	const getNodeKey = (callFrame: CallFrame, depth: number): string => {
		let key = "";
		for (let i = 0; i < depth; i++)
			key += callFrame.frames[i].func + ":";
		return key;
	};

	const getCallFrame = (callFrame: SourceLine) => {
		return {
			scriptId: callFrame.file,
			functionName: callFrame.func,
			url: callFrame.file.includes(':') ? "file:///" + callFrame.file.replace(/\\/g, "/") : callFrame.file,
			lineNumber: callFrame.line,
			columnNumber: 0
		};
	};

	const getNode = (callFrame: CallFrame, depth: number): IProfileNode => {
		const key = getNodeKey(callFrame, depth);
		let node = nodeMap.get(key);
		if (node === undefined) {
			const pp = getNode(callFrame, depth - 1);
			const fr = callFrame.frames[depth - 1];
			node = {
				id: nextNodeId++,
				callFrame: getCallFrame(fr),
				children: [],
				locationId: nextLocationId++,
				positionTicks: []
			};
			pp.children.push(node.id);
			nodes.push(node);
			nodeMap.set(key, node);
		}

		return node;
	};

	// add root node
	const rootNode: IProfileNode = {
		id: nextNodeId++,
		callFrame: {
			functionName: "(root)",
			scriptId: "0",
			url: "",
			lineNumber: -1,
			columnNumber: -1
		},
		hitCount: 0,
		children: [],
		locationId: nextLocationId++,
		positionTicks: []
	};
	nodes.push(rootNode);
	samples.push(rootNode.id);
	nodeMap.set("", rootNode);

	for (let i = 0; i < weightPerLocation.length; i++) {
		if (weightPerLocation[i] === 0)
			continue;

		const ticks = weightPerLocation[i];
		const loc = sourceLocations[i];
		const fr = sourceLocations[i].frames[sourceLocations[i].frames.length - 1];

        /*const tick: typeof rootNode.positionTicks[0] = {
            line: fr.line,
            ticks,
            startLocationId: nextLocationId++,
            endLocationId: nextLocationId++
        };*/
		const node = getNode(loc, loc.frames.length);
		node.hitCount = ticks;
		//node.positionTicks.push(tick);
		samples.push(node.id);
		timeDeltas.push(ticks);
		endTime += ticks;
	}
	timeDeltas.push(0);

	const out: ICpuProfileRaw = { nodes, startTime, endTime, samples, timeDeltas };
	return out;
}
