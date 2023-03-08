import React from "react";
// We make use of this component to create the slideshow!
import {Slide} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const spanStyle = {
    padding: '20px',
    background: '#efefef',
    color: '#000000'
}

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: '400px'
}

/**
 * Will create a slideshow with the given images URLs
 * It could be a good idea to change the array of images
 * with something different that allows them to have a caption.
 *
 * NOTE: This script might be better in other place rather than in folder
 * components, but I am leaving it here for now just to see how it works (so
 * it will need to be moved later)
 * @param props
 */
function ImageList(props: { images: any[]; }) {
    return (
        <div className="slide-container">
            <Slide>
                {props.images.map((slideImage, index) => (
                    <div key={index}>
                        <div style={{...divStyle, 'backgroundImage': `url(${slideImage})`}}>
                        </div>
                    </div>
                ))}
            </Slide>
        </div>
    )
        ; // TODO could add some alt text
}

export default ImageList;