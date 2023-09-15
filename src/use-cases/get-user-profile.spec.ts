import { beforeEach, describe, expect, it } from "vitest";
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found';

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('should be able to get user profile.', async () => {
        
        const createdUser = await usersRepository.create({
            email: 'teste@gmail.com',
            nome: 'Teste dos Santos',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })



        expect(user.nome).toEqual('Teste dos Santos')
    })

    it('should not be able to get user profile with wrong id.', async () => {

        await expect(() => 
            sut.execute({
                userId: 'non-existing-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
        
    })

    
})