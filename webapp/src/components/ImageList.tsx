import React from "react";
// We make use of this component to create the slideshow!
import {Slide} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const spanStyle = {
    background: '#efefef',
    color: '#000000'
}

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: '25em',
    width: '100%'
}

/**
 * Will create a slideshow with the given images URLs
 * It could be a good idea to change the array of images
 * with something different that allows them to have a caption.
 * @see The images passed must be in Base64
 * @author UO283069
 * @param props
 */
function ImageList(props: { images: any[]; }) {
    return (
        <div className="slide-container">
            <Slide>
                {props.images.map((slideImage, index) => (
                    <div key={index}>
                        <img style={{...divStyle }} src={"data:image/png;base64," + slideImage} ></img>
                    </div>
                ))}
            </Slide>
        </div>
    )
        ; // TODO could add some alt text
}

export default ImageList;