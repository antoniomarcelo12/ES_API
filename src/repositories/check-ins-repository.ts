import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    findCheckInByPlate(plate: string, userId: string): Promise<CheckIn | null>
    findCheckInByUserId(userId: string): Promise<CheckIn | null>
}