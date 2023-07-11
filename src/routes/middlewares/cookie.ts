import { randomUUID } from "node:crypto";
import { FastifyReply, FastifyRequest } from "fastify";

export async function handleCookies(request: FastifyRequest, reply: FastifyReply){
  let sessionId = request.cookies.sessionId
  if (!sessionId){
    sessionId = randomUUID()
    request.cookies.sessionId = sessionId
    reply.cookie('sessionId', sessionId,{
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    })
    console.log('NEW SESSION ID: ', sessionId)
  }else{
    console.log('SESSION ID: ', sessionId)
  }
}

export async function requireCookies(request: FastifyRequest, reply: FastifyReply){
  let sessionId = request.cookies.sessionId
  if (!sessionId){
    return reply.code(401).send({error: "Unauthorized"})
  }
}