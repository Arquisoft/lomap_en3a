import React from "react";
import IPlacePageProps from "./IPlacePage";
import IPlacePageState from "./IPlacePage";
import {
    BarSeries,
    Category,
    ChartComponent,
    Inject,
    SeriesCollectionDirective,
    SeriesDirective
} from "@syncfusion/ej2-react-charts";

export default class ReviewsPage extends React.Component<IPlacePageProps, IPlacePageState> {

    private data: Array<{ x: string, y: number, color: string }>;

    constructor(props: IPlacePageProps) {
        super(props);
        this.data = new Array(); // TODO to be filled
        // TESTING ONLY
        this.data = [{x: '0 Stars', y: 100, color: '#ffff'}];
    }

    render() {
        return <div>
            <h3>Rating</h3>
            <div>
                <ChartComponent primaryXAxis={{valueType: "Category", title: "Users"}} primaryYAxis={{title: "Stars"}}>
                    <Inject services={[BarSeries, Category]}></Inject>
                    <SeriesCollectionDirective>
                        <SeriesDirective dataSource={this.data} xName='Users' yName='Stars' type='Bar'
                                         pointColorMapping='color'>
                        </SeriesDirective>
                    </SeriesCollectionDirective>
                </ChartComponent>
            </div>
            <div id="comments">
                <h4>@User</h4>
                <p>Comment</p>
            </div>
        </div>;
    }
}