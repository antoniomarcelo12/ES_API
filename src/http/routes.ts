import { FastifyInstance } from "fastify";
import { registerController } from "./controllers/register.controller";
import { authenticateController } from "./controllers/authenticate.controller";
import { profileController } from "./controllers/profile.controller";
import { verifyJWT } from "./middlewares/verify-jwt";
import { refreshController } from "./controllers/refresh.controller";

export async function appRoutes(app: FastifyInstance){
    app.post('/users', registerController)
    app.post('/session', authenticateController)

    app.patch('/token/refresh', refreshController)

    app.get('/me', { onRequest: [verifyJWT]}, profileController)

    
}