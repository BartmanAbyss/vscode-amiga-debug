import * as assert from 'assert';
import * as path from 'path';
import { UssFile } from '../../backend/savestate';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data");

suite("savestate", () => {
	test("bobble33-bug.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'bobble33-bug.uss'));
	});
	test("bobble-title.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'bobble-title.uss'));
	});
	test("desertdream-dots.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'desertdream-dots.uss'));
	});
	test("gods.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'gods.uss'));
	});
});
