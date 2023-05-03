import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React from "react";

function BackButton(props: { onClick: () => void }) {
    return (
        <a className="back-page-link" onClick={props.onClick}><KeyboardBackspaceIcon
            sx={{marginTop: "0.1em", fontSize: "2.5em", color: "white", backgroundColor: "#002E66", borderRadius: "100em"}}/></a>
    );
}

export default BackButton;