import { Document } from "mongoose";
export interface PlaceType extends Document {
    title: string;
    longitude: number;
    latitude: number;
    podUuid: string | undefined;
}