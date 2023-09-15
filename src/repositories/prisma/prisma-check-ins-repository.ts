import { Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "../../lib/prisma";

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        })

        return checkIn
    }
    async findCheckInByPlate(plate: string, userId: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id: userId,
                placa: plate
            }
        })

        return checkIn
    }
    async findCheckInByUserId(userId: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id: userId
            }
        })

        return checkIn
    }

}