import PlaceWeather from "../domain/place/PlaceWeather";

export default class OpenWeatherMapAdapter {

    private static instance: OpenWeatherMapAdapter = new OpenWeatherMapAdapter();
    private apiKey: string | undefined = undefined;

    private constructor() {}

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

    public getData(latitude: number, longitude: number): PlaceWeather | null {
        if (this.apiKey != undefined) {
            const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=" + this.apiKey;
            fetch(url).then(response => response.json()).then(data => {
                return new PlaceWeather(data.weather[0].icon, data.weather[0].main, data.wind.speed, data.name, data.main.temp);
            });
        } else {
            throw new Error("The API key is not set");
        }
        return null;
    }

    public getIcon(icon : string | undefined){
        return 'https://openweathermap.org/img/w/' + icon + '.png';
    }

}