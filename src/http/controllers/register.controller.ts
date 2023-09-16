import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { hash } from "bcryptjs"
import fastify, { FastifyReply, FastifyRequest } from "fastify"
import { RegisterUseCase } from "../../use-cases/register"
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { UserAlreadyExistsError } from "../../use-cases/errors/user-already-exists-error"
import { makeRegisterUseCase } from "../../use-cases/factories/make-register-use-case"

export const app = fastify()

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        nome: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, nome, password } = registerBodySchema.parse(request.body)

    try {
        const registerUseCase = makeRegisterUseCase()

        await registerUseCase.execute({
            email, nome, password
        }
        )
    }catch(err) {
        if(err instanceof UserAlreadyExistsError){
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }


    return reply.status(201).send({ code: 201, message: "usuário cadastrado com sucesso."})
}