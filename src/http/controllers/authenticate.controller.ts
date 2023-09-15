import { z } from "zod"
import fastify, { FastifyReply, FastifyRequest } from "fastify"
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { AuthenticateUseCase } from "../../use-cases/authenticate"
import { InvalidCredentialsError } from "../../use-cases/errors/invalid-credentials-error"
import { makeAuthenticateUseCase } from "../../use-cases/factories/make-authenticate-use-case"

export interface Teste {
    sign: {
        sub: string
    }
}

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.execute({
            email, password
        })

        const token = await reply.jwtSign({}, {
            sign: {
                sub: user.id
            }
        })

        const refreshToken = await reply.jwtSign({}, {
            sign: {
                sub: user.id,
                expiresIn: '7d'
            }
        })
        
        return reply.setCookie('refreshToken', refreshToken, { path: '/', secure: true, sameSite: true, httpOnly: true }).status(200).send({
            token
        })

    }catch(err) {
        if(err instanceof InvalidCredentialsError){
            return reply.status(400).send({ message: err.message })
        }

        throw err
    }

}