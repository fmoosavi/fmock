import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';
import { OutputChannel } from "./outputChannel";
import { ConfigTemplate } from "./configTemplate";

function evalMock(fmockConfig:string):any{
    const sandbox = {
        fmock: function(d:any,options?:any){
            sandbox.res = d;
            sandbox.options = options
        },
        res: null,
        options: null
    };
    vm.createContext(sandbox);
    try{
        vm.runInContext(fmockConfig, sandbox);
    }catch(err){
        OutputChannel.appendLine(err);
    }
    return { config: sandbox.res , options: sandbox.options};
}
export class FileUtil{
    public static createDefaultFMockFloder(rootPath:string){
        OutputChannel.appendLine(`Ready to create ${path.join(rootPath, '.fmock')}`);
        fs.mkdirSync(path.join(rootPath, '.fmock'));
        OutputChannel.appendLine(`Create ${path.join(rootPath, '.fmock')} success`);
        fs.writeFileSync(
            path.join(rootPath, '.fmock','setting.json'),
            ConfigTemplate.getDefaultFMockConfigTemplate({
                name: "fmock server"
            })
        );
    }
    public static getMockConfigFileList(rootPath:string):any{
        OutputChannel.appendLine(`Ready to get usefull mock config from : ${path.join(rootPath, '.fmock')} floder.`);
        let mockFiles:string[] = fs.readdirSync(path.join(rootPath, '.fmock'));
        let usefullMockFiles:string[] = new Array<string>();
        mockFiles && mockFiles.forEach((mockFile)=>{
            let fileStats:fs.Stats = fs.statSync(path.join(rootPath, '.fmock', mockFile));
            if(fileStats.isFile()){
                usefullMockFiles.push(mockFile);
            }
        })
        OutputChannel.appendLine(`Get usefull mock config from : ${path.join(rootPath, '.fmock')} success`);
        return usefullMockFiles;
    }

    public static getMockConfigList(rootPath:string): any{
        OutputChannel.appendLine(`Ready to get mock config from : ${path.join(rootPath, '.fmock')} floder.`);
        let mockFiles:string[] = fs.readdirSync(path.join(rootPath, '.fmock'));
        let mockConfig:any = {
            defaultJSON: null,
            configList:[]
        }
        mockFiles && mockFiles.forEach((mockFile)=>{
            let fileStats:fs.Stats = fs.statSync(path.join(rootPath, '.fmock', mockFile));
            if(fileStats.isFile()){
                let config:string = fs.readFileSync(path.join(rootPath, '.fmock', mockFile),'utf8');
                if(mockFile == "setting.json"){
                    mockConfig.defaultJSON = JSON.parse(config);
                }else if(mockFile.indexOf(".fmock") > -1){
                    mockConfig.configList.push({data:evalMock(config),fileName:mockFile.replace(".fmock.js","")}); 
                }
            }
        })
        OutputChannel.appendLine(`Get mock config from : ${path.join(rootPath, '.fmock')} success`);
        return mockConfig;
    }
    public static pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}   
}