import { addStringNoLocale, addTerm, buildThing, createSolidDataset, createThing, getThing, setThing, SolidDataset, Thing } from '@inrupt/solid-client';
import { SCHEMA_INRUPT, RDF, VCARD } from '@inrupt/vocab-common-rdf';
import Map from '../../domain/Map';
import Placemark from '../../domain/Placemark';
import { Bindings } from 'rdf-js';
import Place from '../../domain/Place';
import PlaceComment from '../../domain/Place/PlaceComment';
import PlaceRating from '../../domain/Place/PlaceRating';
import User from '../../domain/User';
import Group from '../../domain/Group';

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

    public static commentToDataset(comment: PlaceComment) {
        let dataset = createSolidDataset(); 
        let thing =  buildThing(createThing({name: comment.id}))
            .addStringNoLocale(SCHEMA_INRUPT.description, comment.comment)
            .addStringNoLocale(SCHEMA_INRUPT.accountId, comment.user)
            .addStringNoLocale(SCHEMA_INRUPT.identifier, comment.id)
            .build();

        return setThing(dataset, thing);
    }

    public static toPlaceComments(bindings: Bindings[]): Array<PlaceComment> {
        let result: Array<PlaceComment> = [];
        for (let b of bindings) {
            let user = b.get("user")?.value as string;
            let comment = b.get("comment")?.value as string;
            let id = b.get("comment")?.value as string;
            result.push(new PlaceComment(user, comment, id));
        }
        return result;
    }

    public static urlToReference(url: string) {
        let thing =  buildThing()
            .addStringNoLocale(SCHEMA_INRUPT.URL, url)
            .build();

        return thing;
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

        if (title!==undefined && lat!==undefined && lng!==undefined && placeUrl!==undefined && cat!==undefined) {
            placemarks.push(new Placemark(Number(lat), Number(lng), title, placeUrl, cat));
        }
    }

    public static toPlace(binding: Bindings): Place {
        let title = binding.get("title")?.value;
        let lat = binding.get("lat")?.value;
        let lng = binding.get("lng")?.value;
        let desc = binding.get("desc")?.value;
        let id = binding.get("id")?.value;
        console.log(id)

        if ([title, desc, lat, lng, id].every(p => p!==undefined)) {
            return new Place(title as string, Number(lat), Number(lng), desc as string, undefined, id as string, "no-category");
        } else {
            throw "Undefined property for place";
        }
    }


    public static reviewToDataset(review: PlaceRating): SolidDataset {
        let dataset = createSolidDataset(); 
        let thing =  buildThing(createThing({name: review.id}))
            .addDecimal(SCHEMA_INRUPT.value, review.score)
            .addStringNoLocale(SCHEMA_INRUPT.accountId, review.user)
            .addStringNoLocale(SCHEMA_INRUPT.identifier, review.id)
            .build();

        return setThing(dataset, thing);
    }

    public static groupToDataset(group: Group): SolidDataset {
        let dataset = createSolidDataset(); 
        let mapsThing = buildThing(createThing({name:"maps"}))
            .addStringNoLocale(RDF.type, RDF.Bag)
            .build();

        let thing = buildThing(createThing({name: "details"}))
            .addStringNoLocale(VCARD.Name, group.getName())
            .addStringNoLocale(VCARD.hasUID, group.getId());

        for (let user of group.getMembers()) {
            thing = thing.addStringNoLocale(VCARD.hasMember, user.getWebId());
        }

        dataset = setThing(dataset, thing.build());
        return setThing(dataset, mapsThing);
    }

    public static toGroup(binding: Bindings): Group {
        let name = binding.get("name")?.value as string;
        let id = binding.get("id")?.value as string;
        let members = [];

        let concatenatedIDs = binding.get("members")?.value as string;
        let webIDs = concatenatedIDs.split(',');
        for (let friend of webIDs) {
            members.push(new User(friend.slice(8, friend.indexOf(".inrupt")), friend))
        }

        return new Group(name, members, id)
    }

}