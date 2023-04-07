import {param, check} from 'express-validator';

const addPlaceChecks = [
    check('title').exists().trim().not().isEmpty().withMessage('Title must be provided and it cannot be empty'),
    check('uuid').exists().trim().not().isEmpty().withMessage('Pod uuid must be provided and it cannot be empty'),
    check('longitude').isFloat({min: -180, max: 180}).withMessage('Longitude must be between -180 and 180'),
    check('latitude').isFloat({min: -180, max: 180}).withMessage('Latitude must be between -180 and 180')
]

const deletePlaceChecks = [
    param('title').exists().trim().not().isEmpty().withMessage('Title must be provided and it cannot be empty'),
]

const findPlaceByTitleChecks = [
    param('title').exists().trim().not().isEmpty().withMessage('Title must be provided and it cannot be empty'),
]

const updatePlaceChecks = [
    check('title').trim().not().isEmpty().withMessage('Title cannot be empty'),
    check('uuid').trim().not().isEmpty().withMessage('Pod uuid cannot be empty'),
    check('longitude').isFloat({min: -180, max: 180}).withMessage('Longitude must be between -180 and 180'),
    check('latitude').isFloat({min: -180, max: 180}).withMessage('Latitude must be between -180 and 180')
]
export {addPlaceChecks, deletePlaceChecks, updatePlaceChecks, findPlaceByTitleChecks};