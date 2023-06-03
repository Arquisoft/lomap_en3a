export default class OpenWeatherMapAdapter {

    private static instance: OpenWeatherMapAdapter = new OpenWeatherMapAdapter();
    private apiKey: string | undefined = undefined;

    // TODO implement the rest of methods for calls to the API
    private constructor() {

    }

    public static getInstance() {
        return this.instance;
    }

    public getAPIKey() {
        return this.apiKey;
    }

    public setAPIKey(key: string) {
        this.apiKey = key;
    }

    public removeAPIKey() {
        this.apiKey = undefined;
    }

}