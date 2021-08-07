export class FilemanagerConfig {
    private static _config: configData;

    public static getConfig() {
        FilemanagerConfig._config = {
            apBaseiUrl: "http://localhost:2390/api/v1/FmUtil",
            listAction: "/list",
            rootPath:"D:\\SourceKaravi"
        }

        return FilemanagerConfig._config;
    }



}

interface configData {
    rootPath:string;
    apBaseiUrl: string;
    listAction: string;

}
