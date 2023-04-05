import React from "react";
import IPlacePageProps from "./IPlacePage";
import IPlacePageState from "./IPlacePage";

interface OverviewPageState extends IPlacePageState {
    comment: string;
    //rating : Stars?
}

export default class OverviewPage extends React.Component<IPlacePageProps, OverviewPageState> {

    public constructor(props : IPlacePageProps) {
        super(props);
    }

    render() {
        return undefined;
    }
}