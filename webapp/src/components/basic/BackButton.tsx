import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React from "react";

function BackButton(props: { onClick: () => void }) {
    return (
            <a className="back-page-link" onClick={props.onClick}><KeyboardBackspaceIcon sx={{fontSize: "2.5em"}}/></a>
    );
}

export default BackButton;