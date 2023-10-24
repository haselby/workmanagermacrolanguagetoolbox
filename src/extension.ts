// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "workmanagermacrolanguagetoolbox" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('workmanagermacrolanguagetoolbox.goToMacroDefinition', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showErrorMessage('No text selected');
            return;
        }

        const selectedText = editor.document.getText(selection);
        const currentFilePath = editor.document.uri.fsPath;
        let macroFilePath = path.join(path.dirname(currentFilePath), `${selectedText}.m`);

        if (!fs.existsSync(macroFilePath) && selectedText.startsWith('Csic')) {
            const newSelectedText = selectedText.replace('c', '');
            macroFilePath = path.join(path.dirname(currentFilePath), `${newSelectedText}.m`);
        }

        if (!fs.existsSync(macroFilePath)) {
            vscode.window.showErrorMessage(`Macro definition for '${selectedText}' not found`);
            return;
        }

        vscode.workspace.openTextDocument(macroFilePath).then((document) => {
            vscode.window.showTextDocument(document);
        });
    });

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
