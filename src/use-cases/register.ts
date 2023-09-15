import { PrismaUsersRepository } from '../repositories/prisma/prisma-users-repository';
import { hash } from "bcryptjs"
import { prisma } from "../lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '@prisma/client';

interface RegisterUseCaseRequestParams {
    nome: string,
    email: string,
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository){

    }

    async execute({ nome, email, password }: RegisterUseCaseRequestParams): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if(userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const user = await this.usersRepository.create({
            nome, email, password_hash
        })

        return {
            user,
        }

    }
}