import React from "react";
import {Button, Dialog, DialogActions, TextField} from "@mui/material";
import {IoEyeOutline} from "react-icons/io5";
import OpenWeatherMapAdapter from "../adapters/OpenWeatherMapAdapter";

export default class Configuration extends React.Component<any, {
    apiText: string | undefined,
    openConfirmationDialog: boolean,
    showPassword: boolean
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            apiText: OpenWeatherMapAdapter.getInstance().getAPIKey(),
            openConfirmationDialog: false,
            showPassword: false
        }

        this.handleTextFieldAPIChange = this.handleTextFieldAPIChange.bind(this);
        this.changeAPIKeyWeather = this.changeAPIKeyWeather.bind(this);
        this.showPassword = this.showPassword.bind(this);
    }

    private changeAPIKeyWeather() {
        if (this.state.apiText != undefined) {
            OpenWeatherMapAdapter.getInstance().setAPIKey(this.state.apiText);
        }
        this.setState(({
            openConfirmationDialog: false
        }));
    }

    private handleTextFieldAPIChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target;
        const value = target.value;

        this.setState(({
            apiText: value
        }))
    }

    private showPassword() {
        this.setState((prevState) => ({
            showPassword: !prevState.showPassword
        }));
    }

    render() {
        return (<>
            <h1>Configuration</h1>
            <label htmlFor={"apiKey"}>OpenWeatherMap Api Key</label>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField id="apiKey" variant="standard"
                           sx={{marginBottom: "1em", width: "80%"}} onChange={this.handleTextFieldAPIChange}
                           value={this.state.apiText}
                           type={this.state.showPassword ? "text" : "password"}
                           helperText={this.state.apiText === "" || this.state.apiText === undefined ? 'No api key given' : ' '}></TextField>
                <button style={{borderRadius: "0.3em", height: 24}} onClick={this.showPassword}><IoEyeOutline
                    size={20}/></button>
            </div>
            <Button onClick={() => {
                this.setState(({
                    openConfirmationDialog: true
                }));
            }}>Change key</Button>

            {/** Confirmation dialog for API key change **/}

            <Dialog open={this.state.openConfirmationDialog} onClose={() => {
                this.setState(({
                    openConfirmationDialog: false
                }));
            }}>
                <h2>Are you sure about changing your API key?</h2>
                <DialogActions>
                    <Button onClick={this.changeAPIKeyWeather}>
                        Change
                    </Button>
                    <Button onClick={() => {
                        this.setState(({
                            openConfirmationDialog: false
                        }));
                    }} color={"error"}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>);
    }

}