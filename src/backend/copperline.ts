/** Copperline's native launch surface. Keep argument construction independent
 * of VS Code so model presets and paths can be tested on every host. */
export interface CopperlineLaunch {
	program: string;
	config?: string;
	kickstart?: string;
	cpuboard?: string;
	chipmem?: string;
	fastmem?: string;
	slowmem?: string;
	stack?: string;
	endcli?: boolean;
	ntsc?: boolean;
	emuargs?: string[];
}

export function copperlineArgs(launch: CopperlineLaunch, now = Date.now()): string[] {
	if (launch.cpuboard)
		throw new Error('Copperline does not use WinUAE CPU board ROMs. Remove cpuboard and select a CPU preset.');
	const presets: Record<string, string[]> = {
		'a500': ['--model', 'A500', '--chip', '512K', '--slow', '512K'],
		'a1200': ['--model', 'A1200'],
		'a1200-fast': ['--model', 'A1200', '--fast', '4M'],
		'a1200-030': ['--model', 'A1200', '--cpu', '68030', '--accelerator', '32M'],
		'a3000': ['--model', 'A3000'],
		'a4000': ['--model', 'A4000', '--cpu', '68030', '--motherboard', '8M'],
	};
	const preset = presets[(launch.config ?? 'a500').toLowerCase()];
	if (!preset)
		throw new Error(`Unknown Copperline model preset: ${launch.config}`);
	const args = ['--factory', '--gdb-gui', ':2345', '--gdb-dialect', 'bartman',
		'--run', launch.program + '.exe', ...preset, '--rtc-time', String(Math.floor(now / 1000))];
	if (launch.kickstart)
		args.push(launch.kickstart);
	for (const [flag, value] of [['--chip', launch.chipmem], ['--fast', launch.fastmem], ['--slow', launch.slowmem]]) {
		if (value !== undefined)
			args.push(flag, value.toLowerCase() === '1.8m' ? '1792K'
				: /^(?:0)?\.5m$/i.test(value) ? '512K' : value);
	}
	if (launch.stack) {
		if (!/^\d+$/.test(launch.stack) || Number(launch.stack) <= 0)
			throw new Error('Copperline stack must be a positive byte count.');
		args.push('--run-stack', launch.stack);
	}
	if (launch.endcli)
		args.push('--run-detach');
	if (launch.ntsc)
		args.push('--video', 'ntsc');
	return [...args, ...(launch.emuargs ?? [])];
}
