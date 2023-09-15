import fastify, { FastifyReply, FastifyRequest } from "fastify"
import { makeGetUserProfileUseCase } from "../../use-cases/factories/make-get-user-profile-use-case"


export async function profileController(request: FastifyRequest, reply: FastifyReply) {
    
    const getUserProfile = makeGetUserProfileUseCase()

    const data = await getUserProfile.execute({
        userId: request.user.sub
    })

    const user = {
        id: data.user.id,
        nome: data.user.nome,
        email: data.user.email,
        data_criacao: data.user.data_criacao
    }

    return reply.status(200).send({
        user
    })
}