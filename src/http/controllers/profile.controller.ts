import { FastifyReply, FastifyRequest } from "fastify"
import { makeGetUserProfileUseCase } from "../../use-cases/factories/make-get-user-profile-use-case"

interface TokenParsedType {
    sub: string
}

export async function profileController(request: FastifyRequest, reply: FastifyReply) {
    
    const getUserProfile = makeGetUserProfileUseCase()

    try {
        const tokenParsed: TokenParsedType = await request.jwtVerify()
    
        const data = await getUserProfile.execute({
            userId: tokenParsed.sub
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

    } catch {
        return reply.status(404).send()
    }
}