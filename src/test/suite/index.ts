import * as path from 'path';
import * as inspector from 'inspector';
import * as fs from 'fs';

export const profile = (name: string, func: () => void) => (done: (err?: any) => void) => {
	// make sure function is optimized before profiling
	for(let i = 0; i < 5; i++) 
		func();

	const session = new inspector.Session();
	session.connect();
	session.post('Profiler.enable', () => {
		session.post('Profiler.start', () => {
			console.log("===Profiler.start===");
			try {
				func();
			} catch(error) {
				done(error);
				return;
			}
			session.post('Profiler.stop', (err, { profile }) => {
				if(!err)
					fs.writeFileSync(path.join('profile', `${name}.cpuprofile`), JSON.stringify(profile));
				done();
			});
		});
	});
};
