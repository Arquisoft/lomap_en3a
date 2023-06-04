import React from "react";
import Place from "../../domain/Place";
import {BiWind} from "react-icons/bi";
import {TbTemperatureCelsius} from "react-icons/tb";
import PlaceWeather from "../../domain/place/PlaceWeather";
import OpenWeatherMapAdapter from "../../adapters/OpenWeatherMapAdapter";

interface WeatherState {
    weather: PlaceWeather | undefined
    loaded: boolean;
}

/**
 * Shows the climatological information of the given location IF the user
 * has given the program an API key to use, if it has not then it does not show anythin
 */
export default class WeatherPage extends React.Component<{ place: Place }, WeatherState> {

    constructor(props: { place: Place }) {
        super(props);
        this.state = {
            loaded: false,
            weather: undefined
        }
    }


    async componentDidMount() {
        let url;
        try {
            url = OpenWeatherMapAdapter.getInstance().getDataUrl(this.props.place.latitude, this.props.place.longitude);
        } catch (ex) {
            return;
        }
        let weather = await fetch(url).then(response => response.json()).then(data => {
            return new PlaceWeather(data.weather[0].icon, data.weather[0].main, data.wind.speed, data.name, data.main.temp);
        });
        if (weather != null) {
            this.setState(({
                weather: weather,
                loaded: true
            }))
        }
    }


    render() {
        if (!this.state.loaded) {
            return <></>;
        }

        return (<aside>
                <img src={OpenWeatherMapAdapter.getInstance().getIcon(this.state.weather?.icon)}
                     alt={"The weather in " + this.state.weather?.name + " is " + this.state.weather?.main}
                     style={{height: 70, width: 70}}/>
                <p style={{fontSize: "small", marginTop: 0}}>{this.state.weather?.temp}<TbTemperatureCelsius/></p>
                <p style={{fontSize: "small", marginTop: 0}}><BiWind/> {this.state.weather?.speed} m/s
                </p>
            </aside>
        )
            ;
    }

}