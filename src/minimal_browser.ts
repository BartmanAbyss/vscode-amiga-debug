import * as vscode from 'vscode';

export function launchUrl(url : string, title: string)
{
	const webviewPanel = vscode.window.createWebviewPanel('openEmbedded', title, {
		viewColumn: vscode.ViewColumn.Active,
		preserveFocus: true
	}, {
		enableScripts: true,
		enableForms  : true,
		retainContextWhenHidden: true
	});
	webviewPanel.webview.html = `
        <html>
            <head>
                <style>
                    html, body {
                        background-color: transparent;
                        font: normal 1em 'Sans Serif';
                        overflow: hidden;
                        height: 100%;
                        min-height: 100%;
                        margin: 0;
                        padding: 0;
                    }
                    button {
                        border: solid 1px var(--vscode-menu-foreground);
                        outline: 1px solid transparent;                        
                        color: var(--vscode-menu-foreground);
                        text-align: center;
                        text-decoration: none;
                        width: 2.5em;
                        height: 2.5em;
                        padding: 0.2em;
                        margin: 0.3em 0.3em 0.3em 0;
                        background-color: var(--vscode-menu-background);
                    }
                </style>
            </head>
            <body>
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div>
                        <button onclick="javascript:window.history.back();">&#9668;</button>
                        <button onclick="javascript:window.history.forward();">&#9658;</button>
                        <button onclick="javascript:document.getElementById('webview').src = '${url}';">&#8635;</button>
                    </div>
                    <div style="flex: 1;">
                        <iframe id="webview" sandbox="allow-scripts allow-forms allow-same-origin" src="${url}" style="width: 100%; height: 100%; border: none; background-color: white; overflow: scroll;">
                        </iframe>
                    </div>
                </div>
            </body>
        </html>`;
	webviewPanel.reveal(vscode.ViewColumn.Active, true);
}
