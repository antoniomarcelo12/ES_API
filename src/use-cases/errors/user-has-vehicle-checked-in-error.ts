export class UserHasVehicleCheckedInError extends Error {
    constructor(){
        super('User has a car checked in. Check out before check in again.')
    }
}