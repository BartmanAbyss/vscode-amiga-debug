import * as fs from 'fs';
import * as path from 'path';

/** Versioned GCC helpers shipped with the selected platform's toolchain. */
export function bundledGccExecutables(binPath: string): string[] {
	const root = path.join('opt', 'libexec', 'gcc', 'm68k-amiga-elf');
	const versions = fs.readdirSync(path.join(binPath, root), { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && fs.existsSync(path.join(binPath, root, entry.name, 'cc1')))
		.map((entry) => entry.name).sort();
	if (versions.length === 0)
		throw new Error(`Bundled Amiga GCC compiler was not found in ${path.join(binPath, root)}`);
	return versions.flatMap((version) => ['cc1', 'cc1plus', 'collect2', 'lto-wrapper', 'lto1']
		.map((exe) => path.join(root, version, exe)));
}
