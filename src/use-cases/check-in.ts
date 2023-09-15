import { compare } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { VehicleCheckedInError } from "./errors/vehicle-checked-in-error";
import { UserHasVehicleCheckedInError } from "./errors/user-has-vehicle-checked-in-error";

interface CheckInUseCaseRequest {
    userId: string,
    cor: string,
    data_reserva: Date,
    marca: string,
    modelo: string,
    placa: string,
    tipo_veiculo: string
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository
    ){}

    async execute({ userId, cor, data_reserva, marca, modelo, placa, tipo_veiculo }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

        const isVehicleCheckedIn = await this.checkInsRepository.findCheckInByPlate(placa)

        if(isVehicleCheckedIn) {
            throw new VehicleCheckedInError()
        }

        const isOwnerAlreadyCheckedIn = await this.checkInsRepository.findCheckInByUserId(userId)

        if(isOwnerAlreadyCheckedIn) {
            throw new UserHasVehicleCheckedInError()
        }
        
        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            cor: cor,
            data_reserva: new Date(data_reserva),
            marca: marca,
            modelo: modelo,
            placa: placa,
            tipo_veiculo: tipo_veiculo,
        })
        
        
        return {
            checkIn,
        }

    }
}