import { buildThing, createSolidDataset, createThing, setThing, SolidDataset, Thing } from '@inrupt/solid-client';
import { SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';
import Map from '../../domain/Map';
import Placemark from '../../domain/Placemark';

export default class Assembler {

    public static toDataset(map: Map): SolidDataset {
        let dataset = createSolidDataset();
        let details =  buildThing(createThing({name: "Details"}))
            .addStringNoLocale(SCHEMA_INRUPT.name, map.getName())
            .addStringNoLocale(SCHEMA_INRUPT.description, map.getDescription())
            .build();

        dataset = setThing(dataset, details);

        for (let p of map.getPlacemarks()) {
            dataset = setThing(dataset, this.toThing(p));
        }
        return dataset;
    }

    public static toThing(placemark: Placemark): Thing {
        return  buildThing(createThing())
            .addStringNoLocale(SCHEMA_INRUPT.name, placemark.getTitle())
            .addDecimal(SCHEMA_INRUPT.latitude, placemark.getLat())
            .addDecimal(SCHEMA_INRUPT.longitude, placemark.getLng())
            .build();
    }

}