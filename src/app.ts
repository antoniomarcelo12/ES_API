import fastify from "fastify";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { fastifyJwt } from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";


export const app = fastify()


app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
        expiresIn: '10m'
    },
    cookie: {
        cookieName: 'refreshToken',
        signed: false
    }
})

app.register(fastifyCors, {
    origin: 'http://localhost:5173'
})

app.register(fastifyCookie)
app.register(appRoutes)


app.setErrorHandler((error, _request, reply) => {
    if(error instanceof ZodError) {
        console.log("_request.body: ", _request.body)
        return reply.status(400).send({ message: 'Validation error.', issues: error.format() })
    }
    if(env.NODE_ENV !== 'production') {
        console.error(error)
    }
})