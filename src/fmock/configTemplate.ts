export class ConfigTemplate{
    public static getDefaultFMockConfigTemplate(config:any):string{
        return `
{
    "name": "${config.name}",
    "port":"${config.prot | 3000}"
}
        `
    }    
}