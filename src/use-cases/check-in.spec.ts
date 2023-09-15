import { beforeEach, describe, expect, it, test } from "vitest";
import { RegisterUseCase } from './register';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { VehicleCheckedInError } from './errors/vehicle-checked-in-error';
import { UserHasVehicleCheckedInError } from "./errors/user-has-vehicle-checked-in-error";

let usersRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check in use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(usersRepository)
    })

    it('should be able to check in.', async () => {
        

        const { checkIn } = await sut.execute({
            userId: 'user 01',
            cor: 'black',
            data_reserva: new Date(),
            marca: "fiat",
            modelo: "siena",
            placa: "kkv-6536",
            tipo_veiculo: "carro"
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in before check out.', async () => {

        await sut.execute({
            userId: 'user 01',
            cor: 'black',
            data_reserva: new Date(),
            marca: "fiat",
            modelo: "siena",
            placa: "kkv-6536",
            tipo_veiculo: "carro"
        })

        await expect(() => sut.execute({
            userId: 'user 01',
            cor: 'black',
            data_reserva: new Date(),
            marca: "fiat",
            modelo: "siena",
            placa: "kkv-6536",
            tipo_veiculo: "carro"
        })).rejects.toBeInstanceOf(VehicleCheckedInError)

    })
    it('should not be able to check in twice with different vehicles.', async () => {

        await sut.execute({
            userId: 'user 01',
            cor: 'black',
            data_reserva: new Date(),
            marca: "fiat",
            modelo: "siena",
            placa: "kkv-6536",
            tipo_veiculo: "carro"
        })

        await expect(() => sut.execute({
            userId: 'user 01',
            cor: 'black',
            data_reserva: new Date(),
            marca: "fiat",
            modelo: "uno",
            placa: "kkk-1111",
            tipo_veiculo: "carro"
        })).rejects.toBeInstanceOf(UserHasVehicleCheckedInError)

    })
})