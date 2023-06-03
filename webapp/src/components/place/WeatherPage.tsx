import React from "react";
import Place from "../../domain/Place";

interface WeatherState {
    description: string;
    icon: string;
    main: string;
    windSpeed: number;
    windDeg: number;
    name: string;
}

export default class WeatherPage extends React.Component<{ place: Place }, WeatherState> {

    private url: string;
    private apikey: string = "";

    constructor(props: { place: Place }) {
        super(props);
        this.state = {
            description: "",
            icon: "",
            main: "",
            windSpeed: 0,
            windDeg: 0,
            name: ""
        }
        this.url = "https://api.openweathermap.org/data/2.5/weather?lat=" + props.place.latitude + "&lon=" + props.place.longitude + "&APPID=" + this.apikey;
    }

    componentDidMount() {
        this.test();
    }

    public test() {
        fetch(this.url).then(response => response.json()).then(data => {
            this.setState(({
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                main: data.weather[0].main,
                windSpeed: data.wind.speed,
                windDeg: data.wind.deg,
                name: data.name

            }));
        });
    }

    render() {
        return (<aside>
                <h3>Weather report</h3>
                <img src={'https://openweathermap.org/img/w/' + this.state.icon + '.png'}
                     alt={"The weather in " + this.state.name + " is " + this.state.main}
                     style={{height: 70, width: 70}}/>
                <p>Weather: {this.state.description}</p>
                <p>Location: {this.state.name}</p>
                <p>Wind speed: {this.state.windSpeed}</p>
                <p>Wind degree: {this.state.windDeg}</p>
            </aside>
        )
            ;
    }

}