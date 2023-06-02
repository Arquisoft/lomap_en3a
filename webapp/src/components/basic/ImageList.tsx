import React from "react";
// We make use of this component to create the slideshow!
import {Slide} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'


const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    maxHeight: '15em',
    maxWidth: '100%',
    margin: "auto"
}

/**
 * Will create a slideshow with the given images URLs
 * It could be a good idea to change the array of images
 * with something different that allows them to have a caption.
 * @see The images passed must be in Base64
 * @author UO283069
 * @param {any[]} props
 */
function ImageList(props: { images: any[]; }) {
    if (props.images.length == 1) {
        return (<img style={{...divStyle}} src={props.images[0]} alt={"Default image alt text"}></img>);
    } else if (props.images.length > 0) {
        return (
            <div className="slide-container">
                <Slide>
                    {props.images.map((slideImage, index) => (
                        <div key={index}>
                            <img style={{...divStyle}} src={slideImage} alt={"Default image alt text"}></img>
                        </div>
                    ))}
                </Slide>
            </div>
        );
    }
    return <></>;
}

export default ImageList;
