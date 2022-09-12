import { suite, test } from 'mocha';
import * as fs from 'fs';
import * as path from 'path';
import { profile } from '.';
import { ICpuProfileRaw } from '../../client/types';
import { buildModel } from '../../client/model';
import { DefaultDeniseState, getScreen } from '../../client/screen';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data");

suite("screen", function () {
	test("profile", profile('screen' , function () {
		const PROFILES = JSON.parse(fs.readFileSync(path.join(testDataDir, 'profile/desertdream-dots.uss-2022.09.12-21.35.45.amigaprofile')).toString()) as ICpuProfileRaw[];
		const MODELS = [ buildModel(PROFILES[0]) ];
		const [pixelSources, pixelPtrs, pixels, pixelsRgb, pixelsDma] = getScreen(2, MODELS[0], DefaultDeniseState);
	})).timeout(5000);
});
