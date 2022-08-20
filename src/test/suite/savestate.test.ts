import { suite, test } from 'mocha';
import * as assert from 'assert';
import * as path from 'path';
import { UssFile } from '../../backend/savestate';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data/uss");
const testOutDir = path.resolve(__dirname, "../../../src/test/suite/data/output");

suite("savestate", () => {
	test("read bobble33-bug.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'bobble33-bug.uss'));
	});
	test("read bobble-title.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'bobble-title.uss'));
	});
	test("read desertdream-dots.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'desertdream-dots.uss'));
	});
	test("read gods.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'gods.uss'));
	});
	test("write gods.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'gods.uss'));
		ussFile.write(path.join(testOutDir, 'gods.uss'));
		const ussFile2 = new UssFile(path.join(testOutDir, 'gods.uss'));
	});
	test("write masterblazer.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'masterblazer.uss'));
		ussFile.write(path.join(testOutDir, 'masterblazer.uss'));
		const ussFile2 = new UssFile(path.join(testOutDir, 'masterblazer.uss'));
	});
	test("write shadesbeat.uss", () => {
		const ussFile = new UssFile(path.join(testDataDir, 'shadesbeat.uss'));
		ussFile.setCycleExact();
		ussFile.write(path.join(testOutDir, 'shadesbeat.uss'));
		const ussFile2 = new UssFile(path.join(testOutDir, 'shadesbeat.uss'));
	});
});
