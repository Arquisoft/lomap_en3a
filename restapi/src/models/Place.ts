import { PlaceType } from "../types/PlaceType";
import {model, Schema } from "mongoose";

const placeSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        podUuid: {
            type: String,
            required: false,
            default: undefined
        }
    }
)
export default model<PlaceType>("places", placeSchema)