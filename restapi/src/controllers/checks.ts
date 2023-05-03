import {param, check} from 'express-validator';

const addPlaceChecks = [
    check('title').exists().trim().not().isEmpty().withMessage('Title must be provided and it cannot be empty'),
    check('placeUrl').exists().trim().not().isEmpty().withMessage('Pod placeUrl must be provided and it cannot be empty'),
    check('longitude').exists().withMessage('Longitude must be included in the request'),
    check('latitude').exists().withMessage('Latitude must be included in the request'),
    check('longitude').isFloat({min: -180, max: 180}).withMessage('Longitude must be between -180 and 180'),
    check('latitude').isFloat({min: -90, max: 90}).withMessage('Latitude must be between -90 and 90'),
    
]

const deletePlaceChecks = [
    param('title').exists().trim().not().isEmpty().withMessage('Title must be provided and it cannot be empty'),
]

const findPlaceByTitleChecks = [
    param('title').exists().trim().not().isEmpty().withMessage('Title must be provided and it cannot be empty'),
]

const updatePlaceChecks = [
    check('title').trim().not().isEmpty().withMessage('Title cannot be empty'),
    check('placeUrl').trim().not().isEmpty().withMessage('Pod placeUrl cannot be empty'),
    check('longitude').isFloat({min: -180, max: 180}).withMessage('Longitude must be between -180 and 180'),
    check('latitude').isFloat({min: -90, max: 90}).withMessage('Latitude must be between -90 and 90')
]
export {addPlaceChecks, deletePlaceChecks, updatePlaceChecks, findPlaceByTitleChecks};