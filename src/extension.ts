import * as vscode from 'vscode';
import { FMock } from './fmock/fmock';
import { FMockTreeDataProvider } from './fmock/fmockTreeDataProvider';

export function activate(context: vscode.ExtensionContext) {

    const fmockTreeDataProvider = new FMockTreeDataProvider("");
    context.subscriptions.push(vscode.window.registerTreeDataProvider("fmock", fmockTreeDataProvider));
	let fmockApp = new FMock(null,null,null);

	let mockStart = vscode.commands.registerCommand('extension.fmockStart', () => {
		fmockApp.start();
	});
	context.subscriptions.push(mockStart);

	let mockStop = vscode.commands.registerCommand('extension.fmockStop', () => {
		fmockApp.stop();
	});
	context.subscriptions.push(mockStop);

	let mockReload = vscode.commands.registerCommand('extension.fmockReload', () => {
		fmockApp.reload();
	});
	context.subscriptions.push(mockReload);

	let openFmock = vscode.commands.registerCommand('extension.openFmock', (params) => {
		vscode.workspace.openTextDocument(params).then(
			document => vscode.window.showTextDocument(document)
		);
	});
	context.subscriptions.push(openFmock);

	vscode.workspace.onDidSaveTextDocument((e:vscode.TextDocument) =>{
		if(e.fileName && e.fileName.indexOf('.fmock.js') > -1){
			fmockTreeDataProvider.refresh();
		}
	})
}

export function deactivate() {}
