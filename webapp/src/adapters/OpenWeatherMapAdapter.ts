export default class OpenWeatherMapAdapter {

    private static instance: OpenWeatherMapAdapter = new OpenWeatherMapAdapter();
    private apiKey: string | undefined = undefined;

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

    public getDataUrl(latitude: number, longitude: number): string {
        if (this.apiKey == undefined) {
            throw new Error("The API key is not set");
        }
        return "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=" + this.apiKey;
    }

    public getIcon(icon: string | undefined) {
        return 'https://openweathermap.org/img/w/' + icon + '.png';
    }

}