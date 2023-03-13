/**
 * Class to define a point retrieved from the SOLID dataset
 */
export default class MapPoint{

    public title : string;
    public description : string;
    public images : string[];
    public location : string; // TODO to be changed

    constructor(title : string, description : string, images : string[], location : string) {
        this.title = title;
        this.description = description;
        this.images = images;
        this.location = location;
    }

    public imageToBase64(image : File){
        var fs = require('fs');
        // read binary data
        var bitmap = fs.readFileSync(image);
        // convert binary data to base64 string
        return new Buffer(bitmap).toString('base64');
    }

}