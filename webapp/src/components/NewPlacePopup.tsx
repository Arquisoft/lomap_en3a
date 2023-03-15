import React from "react";

interface NewPlacePopupProps {
    new: (e: React.MouseEvent) => void;
    cancel: (e: React.MouseEvent) => void;
}

export default class NewPlacePopup extends React.Component<NewPlacePopupProps> {
    public constructor(props: any) {
        super(props);
    }
    public render(): JSX.Element {
        return (
            <form>
                <input type="button" value="New..." onClick={this.props.new} />
                <input type="button" value="Cancel" onClick={this.props.cancel} />
            </form>
        );
    }
}