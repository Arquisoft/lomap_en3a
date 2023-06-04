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

    private readonly kelvinToCelsius: number = 273.15;

    constructor(props: { place: Place }) {
        super(props);
        this.state = {
            loaded: false,
            weather: undefined
        }
    }


    componentDidMount() {
        let weather;
        try {
            weather = OpenWeatherMapAdapter.getInstance().getData(this.props.place.latitude, this.props.place.longitude);
        } catch (ex) {
            return;
        }
        if (weather != null) {
            this.setState(({
                weather: weather
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