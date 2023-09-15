import { UsersRepository } from './../repositories/users-repository.d';
import { PrismaUsersRepository } from './../repositories/prisma/prisma-users-repository';
import { beforeEach, describe, expect, it, test } from "vitest";
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should be able to register.', async () => {
        

        const { user } = await sut.execute({
            email: 'teste@gmail.com',
            nome: 'Teste dos Santos',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration.', async () => {
        
        const { user } = await sut.execute({
            email: 'teste@gmail.com',
            nome: 'Teste dos Santos',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with the same email.', async () => {

        const email = 'johndoe@exemple.com'

        await sut.execute({
            nome: 'John Doe',
            email,
            password: '123456',
          })
      

        await expect(() => 
        sut.execute({
                email,
                nome: 'Teste dos Santos',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})