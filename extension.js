const { interfaces } = require('mocha');
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { type } = require('os');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "jump-cursor" is now active!');
	var json = fs.readFileSync(path.resolve(__dirname, "./setting/setting.json"), 'utf8');
	var obj = JSON.parse(json);

	// package.jsnoの”activationEvents”に書かれているメソッド名が実行される
	let disposable = vscode.commands.registerCommand('jump-cursor.do', function () {

		let editor = vscode.window.activeTextEditor;
		let position = editor.selection.active;
		
        var newPosition = position.with(position.line, position.character + obj.jump_num);
        var newSelection = new vscode.Selection(newPosition, newPosition);
		editor.selection = newSelection;
		editor.revealRange(new vscode.Range(newPosition,newPosition))
	});

	// 確認
	let confirm = vscode.commands.registerCommand('jump-cursor.confirm', function () {
		vscode.window.showInformationMessage('現在の文字数：' + obj.jump_num)
	});

	// +10
	let plus10 = vscode.commands.registerCommand('jump-cursor.plus10', function () {
		obj.jump_num = obj.jump_num + 10

		fs.writeFileSync(
			path.resolve(__dirname, "./setting/setting.json"),
			JSON.stringify(obj,null,'  '), 
			"utf-8"
		);

		vscode.window.showInformationMessage('プラス10文字：' + obj.jump_num)
	});

	// -10
	let minus10 = vscode.commands.registerCommand('jump-cursor.minus10', function () {
		obj.jump_num = obj.jump_num - 10

		fs.writeFileSync(
			path.resolve(__dirname, "./setting/setting.json"),
			JSON.stringify(obj,null,'  '), 
			"utf-8"
		);

		vscode.window.showInformationMessage('マイナス10文字：' + obj.jump_num)
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(plus10);
	context.subscriptions.push(minus10);
	context.subscriptions.push(confirm);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
