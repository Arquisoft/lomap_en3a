import React from "react";

function EmptyFriendsList() {
    return (<>
            <main style={{display: "flex"}}>
                <div style={{display: "flex", flexDirection: "column", marginLeft: "20%", gap: 0}}>
                    <h3 style={{fontSize: "x-large", marginBottom: 0}}>Your friend list is empty!</h3>
                    <h4 style={{marginTop: 0}}>Add some friends through your <a
                        href={"inrupt.net"}>inrupt.net</a> account.</h4>
                </div>
                <img style={{width: "269px", height: "207px", alignSelf: "end"}}
                     src="/map-magnifier.png"
                     alt="A map with a magnifying glass"/>
            </main>
        </>
    );
}

export default EmptyFriendsList;