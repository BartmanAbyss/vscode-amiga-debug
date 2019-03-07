'use strict';

import * as vscode from 'vscode';
import { WorkspaceFolder, DebugConfiguration, ProviderResult, CancellationToken } from 'vscode';
import { WinUaeDebugSession } from './winUaeDebug';
import * as Net from 'net';

/*
 * Set the following compile time flag to true if the
 * debug adapter should run inside the extension host.
 * Please note: the test suite does not (yet) work in this mode.
 */
const EMBED_DEBUG_ADAPTER = true;

export function activate(context: vscode.ExtensionContext) {
	// register a configuration provider for 'mock' debug type
	const provider = new WinUaeConfigurationProvider();
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('winuae', provider));
}

export function deactivate() {
	// nothing to do
}

class WinUaeConfigurationProvider implements vscode.DebugConfigurationProvider {

	private server?: Net.Server;

	/**
	 * Massage a debug configuration just before a debug session is being launched,
	 * e.g. add all missing attributes to the debug configuration.
	 */
	resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration> {

		// if launch.json is missing or empty
		if (!config.type && !config.request && !config.name) {
			return vscode.window.showInformationMessage("Cannot find a launch.json config").then(_ => {
				return undefined;	// abort launch
			});
		}

		if (!config.program) {
			return vscode.window.showInformationMessage("Cannot find a program to debug").then(_ => {
				return undefined;	// abort launch
			});
		}

		if (EMBED_DEBUG_ADAPTER) {
			// start port listener on launch of first debug session
			if (!this.server) {
				// start listening on a random port
				this.server = Net.createServer(socket => {
					const session = new WinUaeDebugSession();
					session.setRunAsServer(true);
					session.start(<NodeJS.ReadableStream>socket, socket);
				}).listen(0);
			}
			// make VS Code connect to debug server instead of launching debug adapter
			let address: any = this.server.address();
			if (address instanceof Object) {
				config.debugServer = address.port;
			}
		}

		return config;
	}
}
