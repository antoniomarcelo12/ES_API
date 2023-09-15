import request from "supertest"
import { app } from "../../app" 
import { afterAll, beforeAll, describe, expect, it } from "vitest"


describe('Profile (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get profile', async () => {
        await request(app.server).post('/users').send({
                                                        nome: "João Teste",
                                                        email: "teste@gmail.com",
                                                        password: '123456'
                                                        })
        
        const response = await request(app.server).post('/session').send({
                                                                            email: "teste@gmail.com",
                                                                            password: '123456'
                                                                        })

        const {token} = response.body

        const profileResponse = await request(app.server).get('/me').set('Authorization', `bearer ${token}`).send()

        expect(profileResponse.statusCode).toEqual(200)
        expect(profileResponse.body.user).toEqual(expect.objectContaining({ email: 'teste@gmail.com' }))

    })
})