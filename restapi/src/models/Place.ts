import Placemark from "./Placemark";
import {model, Schema } from "mongoose";

const placeSchema: Schema = new Schema(
    {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            unique: true,
            required: true
        },
        placeUrl: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: false
        }
    }
)
export default model<Placemark>("places", placeSchema)