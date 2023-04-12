import { buildThing, createSolidDataset, createThing, setThing, SolidDataset, Thing } from '@inrupt/solid-client';
import { addStringNoLocale, addTerm, buildThing, createSolidDataset, createThing, getThing, setThing, SolidDataset, Thing } from '@inrupt/solid-client';
import { SCHEMA_INRUPT, RDF } from '@inrupt/vocab-common-rdf';
import Map from '../../domain/Map';
import Placemark from '../../domain/Placemark';
import { Bindings } from 'rdf-js';
import Place from '../../domain/Place';
import DataFactory from '@rdfjs/data-model';

export default class Assembler {

    public static placeToDataset(place: Place): SolidDataset {
        let dataset = createSolidDataset();  
        let thing =  buildThing(createThing({name: place.uuid}))
            .addStringNoLocale(SCHEMA_INRUPT.name, place.title)
            .addStringNoLocale(SCHEMA_INRUPT.identifier, place.uuid)
            .addStringNoLocale(SCHEMA_INRUPT.description, place.description)
            .addDecimal(SCHEMA_INRUPT.latitude, place.latitude)
            .addDecimal(SCHEMA_INRUPT.longitude, place.longitude)      
            .build();
        
        dataset = setThing(dataset, thing);
        return dataset;
    }

    private static thingAsBlankNode(name: string, thing: Thing): Thing {
        return {
            type: "Subject",
            url: "_:" + name,
            predicates: thing.predicates
        };
    }

    public static mapToDataset(map: Map): SolidDataset {
        let dataset = createSolidDataset();
        let details =  buildThing(createThing({name: "details"}))
            .addStringNoLocale(RDF.type, 'details')
            .addStringNoLocale(SCHEMA_INRUPT.name, map.getName())
            .addStringNoLocale(SCHEMA_INRUPT.identifier, map.getId())
            .addStringNoLocale(SCHEMA_INRUPT.description, map.getDescription())
            .build();

        dataset = setThing(dataset, details);

        for (let p of map.getPlacemarks()) {
            dataset = setThing(dataset, this.placemarkToThing(p));
        }
        return dataset;
    }

    public static placemarkToThing(placemark: Placemark): Thing {
        return  buildThing(createThing())
            .addStringNoLocale(RDF.type, 'placemark')
            .addStringNoLocale(SCHEMA_INRUPT.name, placemark.getTitle())
            .addDecimal(SCHEMA_INRUPT.latitude, placemark.getLat())
            .addDecimal(SCHEMA_INRUPT.longitude, placemark.getLng())
            .addStringNoLocale(SCHEMA_INRUPT.url, placemark.getPlaceUrl())
            .addStringNoLocale(SCHEMA_INRUPT.description, placemark.getCategory())
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
        let placeUrl = binding.get("placeUrl")?.value;
        let cat = binding.get("cat")?.value;

        if (title!==undefined && lat!==undefined && lng!==undefined && placeUrl!==undefined) {
            placemarks.push(new Placemark(Number(lat), Number(lng), title, placeUrl));
        if (title!==undefined && lat!==undefined && lng!==undefined && placeUrl!==undefined && cat!==undefined) {
            placemarks.push(new Placemark(Number(lat), Number(lng), title, placeUrl, cat));
        }
    }

    public static toPlace(binding: Bindings): Place {
        let title = binding.get("title")?.value;
        let lat = binding.get("lat")?.value;
        let lng = binding.get("lng")?.value;
        let desc = binding.get("desc")?.value;

        if ([title, desc, lat, lng].every(p => p!==undefined)) {
            return new Place(title as string, Number(lat), Number(lng), desc as string, undefined, undefined, "no-category");
        } else {
            throw "Undefined property for place";
        }
    }

}