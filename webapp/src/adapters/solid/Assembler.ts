import { buildThing, createSolidDataset, createThing, setThing, SolidDataset, Thing } from '@inrupt/solid-client';
import { SCHEMA_INRUPT, RDF } from '@inrupt/vocab-common-rdf';
import Map from '../../domain/Map';
import Placemark from '../../domain/Placemark';
import { Bindings } from 'rdf-js';

export default class Assembler {

    public static toDataset(map: Map): SolidDataset {
        let dataset = createSolidDataset();
        let details =  buildThing(createThing({name: "details"}))
            .addStringNoLocale(RDF.type, 'details')
            .addStringNoLocale(SCHEMA_INRUPT.name, map.getName())
            .addStringNoLocale(SCHEMA_INRUPT.identifier, map.getId())
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
            .addStringNoLocale(RDF.type, 'placemark')
            .addStringNoLocale(SCHEMA_INRUPT.name, placemark.getTitle())
            .addDecimal(SCHEMA_INRUPT.latitude, placemark.getLat())
            .addDecimal(SCHEMA_INRUPT.longitude, placemark.getLng())
            .build();
    }

    public static toMapPreviews(bindings: Bindings[]): Array<Map> {
        let result: Array<Map> = new Array();

        for (let binding of bindings) {
            this.addMapPreview(binding, result);
        }
        return result;
    }

    private static addMapPreview(binding: Bindings, maps: Array<Map>): void {
        let id = binding.get("id")?.value;
        let name = binding.get("name")?.value;
        let desc = binding.get("desc")?.value;

        if (id!==undefined && name!==undefined && desc!==undefined) {
            maps.push(new Map(name, desc, id));
        }
    }

    public static toPlacemarkArray(bindings: Bindings[]): Array<Placemark> {
        console.log("Assembler")
        let result: Array<Placemark> = new Array();

        for (let binding of bindings) {
            this.addPlacemark(binding, result);
        }
        return result;
    }

    public static addPlacemark(binding: Bindings, placemarks: Array<Placemark>): void {
        let title = binding.get("title")?.value;
        let lat = binding.get("lat")?.value;
        let lng = binding.get("lng")?.value;

        if (title!==undefined && lat!==undefined && lng!==undefined) {
            placemarks.push(new Placemark(Number(lat), Number(lng), title));
        }
    }

}