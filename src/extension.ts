// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "jss-to-css-syntax" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "jss-to-css-syntax.jssToCSS",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        return;
      }

      const regex = /(\w+): ('\S+'|[^,\s]+),?/gm;
      const formattedSelection = text.replace(
        regex,
        (substring: string, ...args: any[]) => {
          const property = args[0];
          const propertyToDashCase = property.replace(
            /[A-Z]/g,
            (match: string, offset: Number) =>
              (offset > 0 ? "-" : "") + match.toLowerCase()
          );
          const value = args[1];
          const valueWithoutQuotes = value.startsWith("'")
            ? value.slice(1, -1)
            : value;

          const newString = substring
            .replace(property, propertyToDashCase)
            .replace(value, `${valueWithoutQuotes};`)
            .replace(/,/, "");

          return newString;
        }
      );

      editor.edit((edit) => edit.replace(selection, formattedSelection));
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
