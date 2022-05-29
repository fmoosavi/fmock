import * as vscode from "vscode";
import * as path from "path";
import { FileUtil } from "./fileUtil";
export class FMockTreeDataProvider
  implements vscode.TreeDataProvider<MockConifg>
{
  private _onDidChangeTreeData: vscode.EventEmitter<MockConifg | undefined> =
    new vscode.EventEmitter<MockConifg | undefined>();
  readonly onDidChangeTreeData: vscode.Event<MockConifg | undefined> =
    this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {
    let workspaces: readonly vscode.WorkspaceFolder[] | undefined =
      vscode.workspace.workspaceFolders;
    if (workspaces) {
      this.workspaceRoot = workspaces[0].uri.fsPath;
      // check rootpath if already inlude .mock floder
      // if not create a default .mock floder
      if (!FileUtil.pathExists(path.join(this.workspaceRoot, ".fmock"))) {
        FileUtil.createDefaultFMockFloder(this.workspaceRoot);
      }
    }
  }

  refresh(): void {
    //@ts-ignore
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: MockConifg): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MockConifg): Thenable<MockConifg[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage(
        "no fmockConf file in empty workspace."
      );
      return Promise.resolve([]);
    }
    let files: string[] = FileUtil.getMockConfigFileList(this.workspaceRoot);
    if (files && files.length > 0) {
      let mockConfig: MockConifg[] = new Array<MockConifg>();
      files.forEach((file) => {
        if (file != "setting.json") {
          let uri = vscode.Uri.file(
            path.join(this.workspaceRoot, ".fmock", file)
          );
          mockConfig.push(
            new MockConifg(
              path.basename(file, ".js"),
              vscode.TreeItemCollapsibleState.None,
              { command: "extension.openFmock", title: "", arguments: [uri] }
            )
          );
        }
      });
      return Promise.resolve(mockConfig);
    } else {
      return Promise.resolve([]);
    }
  }
}

export class MockConifg extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
  }

  //@ts-ignore
  get tooltip(): string {
    return `${this.label}`;
  }

  //@ts-ignore
  get description(): string | boolean {
    return false;
  }

  iconPath = path.join(
    __filename,
    "..",
    "..",
    "..",
    "resources",
    "light",
    "am.svg"
  );
}
