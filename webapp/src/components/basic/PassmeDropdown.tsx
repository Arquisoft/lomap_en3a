import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';

/**
 * A dropdown that presents the component passed inside of it
 * Additional parameters might be added later to this class
 *
 *
 * @param {presentMe: JSX.Element} props
 * @constructor
 */
function PassmeDropdown(props: { presentMe: JSX.Element }) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * A method that handles the closing strate of the dropdown, make its anchor null
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{width: "fit-content"}}>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{margin: "0 0 0.3em 1em"}}
                className="hide-filters-button"
                variant="contained"
            >
                Show filters
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    sx: {padding: 0}
                }}
                sx={{paddingTop: 0, paddingBottom: 0}}
            >
                {props.presentMe}
            </Menu>
        </div>
    );
}

export default PassmeDropdown;