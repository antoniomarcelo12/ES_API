import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []
    
    async findCheckInByUserId(userId: string) {
        const checkin = this.items.find(item => item.user_id === userId)

        if(checkin) {
            return checkin
        }

        return null
    }

    async findCheckInByPlate(plate: string) {
        const checkin = this.items.find(item => item.placa === plate)

        if(checkin) {
            return checkin
        }

        return null
    }
    
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            data_reserva: new Date(data.data_reserva),
            placa: data.placa,
            marca: data.marca,
            modelo: data.modelo,
            cor: data.cor,
            tipo_veiculo: data.tipo_veiculo,
            data_criacao: new Date(),
            data_retirada: null
        }

        this.items.push(checkIn)

        return checkIn

    }

}