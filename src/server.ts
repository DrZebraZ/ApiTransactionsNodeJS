import fastify, { FastifyReply, FastifyRequest } from "fastify"
import { registerRoutes } from "./routes"
import cookie from '@fastify/cookie'

export const app = fastify()

app.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply)=>{
  console.log(`${request.method} - ${request.url}`)
})

app.register(cookie)
registerRoutes(app)

app.get('/healthcheck', async (request: FastifyRequest, reply: FastifyReply) =>{
  reply.code(200).send('Everything is good!')
})
