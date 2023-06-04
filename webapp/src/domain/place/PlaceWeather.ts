export default class PlaceWeather {

    private readonly _icon: string = "";
    private readonly _main: string = "";
    private readonly _windSpeed: number = 0;
    private readonly _name: string = "";
    private readonly _temp: string | undefined;

    private readonly kelvinToCelsius: number = 273.15;

    constructor(icon: string, main: string, speed: number, name: string, temp: string) {
        this._icon = icon;
        this._main = main;
        this._windSpeed = speed;
        this._name = name;
        this._temp = temp;
    }

    get icon() {
        return this._icon;
    }

    get main() {
        return this._main;
    }

    get speed() {
        return this._windSpeed;
    }

    get name() {
        return this._name;
    }

    // I really don't know, but it works
    get temp() {
        let temp = this._temp != undefined ? parseInt(this._temp) : undefined;
        return temp != undefined ? (temp - this.kelvinToCelsius).toFixed(2) : undefined;
    }

}