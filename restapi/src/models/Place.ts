import { PlaceType } from "../types/PlaceType";
import {model, Schema } from "mongoose";

const placeSchema: Schema = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true
        },
        uuid: {
            type: String,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    }
)
export default model<PlaceType>("places", placeSchema)