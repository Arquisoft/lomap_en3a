import React from "react";
import Place from "../../domain/Place";
import {BiWind} from "react-icons/bi";
import {TbTemperatureCelsius} from "react-icons/tb";
import OpenWeatherMapAdapter from "../../adapters/OpenWeatherMapAdapter";

interface WeatherState {
    description: string;
    icon: string;
    main: string;
    windSpeed: number;
    windDeg: number;
    name: string;
    temp?: string;
    loaded: boolean;
}

export default class WeatherPage extends React.Component<{ place: Place }, WeatherState> {

    private url: string;
    private apikey: string | undefined = OpenWeatherMapAdapter.getInstance().getAPIKey();
    private readonly kelvinToCelsius: number = 273.15;

    constructor(props: { place: Place }) {
        super(props);
        this.state = {
            description: "",
            icon: "",
            main: "",
            windSpeed: 0,
            windDeg: 0,
            name: "",
            loaded: false
        }
        this.url = "https://api.openweathermap.org/data/2.5/weather?lat=" + props.place.latitude + "&lon=" + props.place.longitude + "&APPID=" + this.apikey;
    }


    componentDidMount() {
        this.test();
    }

    public test() {
        if (this.apikey === undefined) {
            return;
        }
        fetch(this.url).then(response => response.json()).then(data => {
            this.setState(({
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                main: data.weather[0].main,
                windSpeed: data.wind.speed,
                windDeg: data.wind.deg,
                name: data.name,
                temp: (data.main.temp - this.kelvinToCelsius).toFixed(2),
                loaded: true
            }));
        });
    }

    render() {
        if (!this.state.loaded) {
            return <></>;
        }

        return (<aside>
                <img src={'https://openweathermap.org/img/w/' + this.state.icon + '.png'}
                     alt={"The weather in " + this.state.name + " is " + this.state.main + ": " + this.state.description}
                     style={{height: 70, width: 70}}/>
                <p style={{fontSize: "small", marginTop: 0}}>{this.state.temp}<TbTemperatureCelsius/></p>
                <p style={{fontSize: "small", marginTop: 0}}><BiWind/> {this.state.windSpeed} m/s, {this.state.windDeg}º
                </p>
            </aside>
        )
            ;
    }

}