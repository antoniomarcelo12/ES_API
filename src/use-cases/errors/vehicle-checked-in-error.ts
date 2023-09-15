export class VehicleCheckedInError extends Error {
    constructor(){
        super('Check out before check in again.')
    }
}