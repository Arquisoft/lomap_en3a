import React from "react";

function EmptyGroupList() {
    return (<>
            <main className={"empty-friend-list"} style={{display: "flex"}}>
                <div style={{display: "flex", flexDirection: "column", marginLeft: "20%", gap: 0}}>
                    <h3 style={{fontSize: "x-large", marginBottom: 0}}>You don't have any group...</h3>
                    <h4 style={{marginTop: 0}}>Try adding some friends or creating one yourself!</h4>
                </div>
                <img style={{width: "269px", height: "207px", alignSelf: "end"}}
                     src="/globe.png"
                     alt="A map with a magnifying glass"/>
            </main>
        </>
    );
}

export default EmptyGroupList;