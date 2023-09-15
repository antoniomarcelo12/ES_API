import request from "supertest"
import { app } from "../../app" 
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { InvalidCredentialsError } from "../../use-cases/errors/invalid-credentials-error"


describe('Authenticate (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to authenticate', async () => {
        await request(app.server)
                        .post('/users')
                        .send({
                            nome: "João Teste",
                            email: "teste@gmail.com",
                            password: '123456'
                            })
        
                             const response = await request(app.server)
                                                    .post('/session')
                                                    .send({
                                                        email: "teste@gmail.com",
                                                        password: '123456'
                                                    })

                                                    expect(response.statusCode).toEqual(200)
                                                    expect(response.body).toEqual({ token: expect.any(String) })

    })
})