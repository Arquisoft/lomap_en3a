import React, {ChangeEvent} from "react";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import MapFilter from "../components/MapFilter";
import Map from "../domain/Map";
import PODManager from "../adapters/solid/PODManager";
import PassmeDropdown from "../components/basic/PassmeDropdown";
import Footer from "../components/Footer";
import {ModalDialog, ModalClose} from "@mui/joy";
import {Button, Modal} from "@mui/material";
import AddMap from "../components/map/AddMap";
import LoadingPage from "../components/basic/LoadingPage";
import EmptyList from "../components/basic/EmptyList";


interface MapViewProps {
}

interface MapViewState {
    data: Map | undefined,
    filter: string[] | undefined,
    maps: Map[],
    popUpOpen: boolean,
    loading: boolean,
    noMaps: boolean
}

export default class MapView extends React.Component<MapViewProps, MapViewState> {
    private podManager = new PODManager();

    public constructor(props: any) {
        super(props);
        this.state = {
            data: undefined,
            filter: undefined,
            maps: [],
            popUpOpen: false,
            loading: true,
            noMaps: false
        };
        this.createMapForGroup = this.createMapForGroup.bind(this);

    }

    public componentDidMount() {
        this.loadMaps().catch(() => {
            this.setState({
                noMaps: true,
                loading: false
            });
        })
    }


    private async loadMaps() {
        let maps = await this.podManager.getAllMaps();
        console.log(maps);
        if (maps.length > 0) {
            await this.podManager.loadPlacemarks(maps[0]);
            this.setState({
                maps: maps,
                data: maps[0],
                loading: false
            });
        } else {
            this.setState({
                noMaps: true,
                loading: false
            });
        }
    }

    private async changeMap(event: ChangeEvent): Promise<void> {
        let select: HTMLSelectElement = (event.target as HTMLSelectElement);
        let index: number = select.selectedIndex;
        let id: string = select.options[index].value;
        let map: Map | undefined = this.state.maps.find(m => m.getId() === id);

        if (map !== undefined) {
            this.setState({data: undefined});
            await this.podManager.loadPlacemarks(map);
            this.setState({data: map});
        }
    }

    private setFilter(categories: string[] | undefined): void {
        this.setState({filter: categories});
    }

    public createMapForGroup() {
        this.setState(({popUpOpen: true}));
    }

    public render(): JSX.Element {

        if (this.state.loading) {
            return <LoadingPage/>;
        }

        if (this.state.noMaps) {
            return (<section className='Home'>
                    <div className="map-header">
                        <Button onClick={this.createMapForGroup} variant={"contained"}
                                color={"success"}
                                sx={{margin: "0 0 0.3em 1em", height: "fit-content"}}>Create a
                            map</Button>
                    </div>
                    <EmptyList firstHeader={"You don't have any map!"} secondHeader={"Try creating one to add places"}
                               image={"/map-magnifier.png"}/>
                    <Modal open={this.state.popUpOpen} onClose={(() => {
                        this.setState(({popUpOpen: false}));
                        this.loadMaps().then(() => {
                            this.setState(({noMaps: false}))
                        });
                    })}>
                        <ModalDialog>
                            <ModalClose accessKey={"x"} onClick={(() => {
                                this.setState(({popUpOpen: false}));
                                this.loadMaps().then(() => {
                                    this.setState(({noMaps: false}))
                                });
                            })}/>
                            <AddMap/>
                        </ModalDialog>
                    </Modal>
                </section>
            );
        }

        return (
            <section className='Home'>
                <div className="map-header">
                    <h2>{this.state.data?.getName() || "Loading"}</h2>
                    <div className="map-options">
                        <select title="map-options" name="map" onChange={this.changeMap.bind(this)}>
                            {this.state.maps.map(m => {
                                return (<option value={m.getId()}>{m.getName()}</option>)
                            })}
                        </select>
                        <PassmeDropdown presentMe={<MapFilter callback={this.setFilter.bind(this)}/>}
                                        buttonText={"Show Filters"}/>
                        <Button onClick={this.createMapForGroup} variant={"contained"} color={"success"}
                                sx={{margin: "0 0 0.3em 1em", height: "fit-content"}}>Create a map</Button>
                    </div>
                </div>
                <Modal open={this.state.popUpOpen} onClose={(() => this.setState(({popUpOpen: false})))}>
                    <ModalDialog>
                        <ModalClose accessKey={"x"} onClick={(() => this.setState(({popUpOpen: false})))}/>
                        <AddMap/>
                    </ModalDialog>
                </Modal>
                {this.state.data !== undefined &&
                    <div className="content">
                        <LeafletMapAdapter map={this.state.data} categories={this.state.filter}/>
                    </div>}
                <Footer style={{
                    backgroundColor: "#002E66",
                    color: "white",
                    textAlign: "center",
                    fontSize: "x-small",
                    height: "6em",
                    paddingTop: "0.3em"
                }}/>
            </section>
        );
    }
}