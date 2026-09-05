import { suite, test } from 'mocha';
import * as assert from 'assert';
import { copperlineArgs } from '../../backend/copperline';

suite('Copperline launch', () => {
	test('paths remain individual arguments and the clock is seeded', () => {
		const args = copperlineArgs({ program: '/a project/my program', kickstart: '/rom folder/kick.rom' }, 1234567000);
		assert.strictEqual(args[args.indexOf('--run') + 1], '/a project/my program.exe');
		assert.ok(args.includes('/rom folder/kick.rom'));
		assert.strictEqual(args[args.indexOf('--rtc-time') + 1], '1234567');
		assert.strictEqual(args[args.indexOf('--gdb-dialect') + 1], 'bartman');
	});
	test('accelerator and memory overrides use Copperline sizes', () => {
		const args = copperlineArgs({ program: 'a', config: 'A1200-030', slowmem: '1.8M', fastmem: '.5M', stack: '65536', endcli: true });
		assert.strictEqual(args[args.indexOf('--cpu') + 1], '68030');
		assert.strictEqual(args[args.indexOf('--accelerator') + 1], '32M');
		assert.strictEqual(args[args.indexOf('--slow') + 1], '1792K');
		assert.ok(args.includes('--run-detach'));
		assert.strictEqual(args[args.indexOf('--fast') + 1], '512K');
	});
	test('invalid presets and UAE CPU board ROMs are explicit errors', () => {
		assert.throws(() => copperlineArgs({ program: 'a', config: 'missing' }));
		assert.throws(() => copperlineArgs({ program: 'a', stack: '0' }));
		assert.throws(() => copperlineArgs({ program: 'a', cpuboard: 'board.rom' }));
	});
});
