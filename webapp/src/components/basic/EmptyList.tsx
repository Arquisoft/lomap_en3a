import React from "react";

function EmptyList(props: {
    firstHeader: string,
    secondHeader: string | JSX.Element,
    image: string,
    imageStyle?: React.CSSProperties | undefined
}) {
    return (<>
            <main className={"empty-friend-list"} style={{display: "flex"}}>
                <div style={{display: "flex", flexDirection: "column", marginLeft: "20%", gap: 0}}>
                    <h3 style={{fontSize: "x-large", marginBottom: 0}}>{props.firstHeader}</h3>
                    <h4 style={{marginTop: 0}}>{props.secondHeader}</h4>
                </div>
                <img style={props.imageStyle || {width: "269px", height: "207px", alignSelf: "end"}}
                     src={props.image}
                     alt="A map with a magnifying glass"/>
            </main>
        </>
    );
}

export default EmptyList;