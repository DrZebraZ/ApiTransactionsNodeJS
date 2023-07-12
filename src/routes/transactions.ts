import { randomUUID } from "node:crypto"
import { knex } from "../database"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { createTransactionBodySchema, getTransactionParamsSchema } from "../@types/transactionsSchema"
import { handleCookies, requireCookies } from "./middlewares/cookie"

export async function transactionRoutes(app: FastifyInstance){
  
  app.post('/', {preHandler: [handleCookies]}, async (request: FastifyRequest, reply: FastifyReply)=>{
    const body = createTransactionBodySchema.parse(request.body)
    const { title, amount, type } = body
    let { sessionId } = request.cookies

    await knex('transactions')
      .insert({
        id: randomUUID(),
        title: title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId
      })

    reply.code(201).send()
  })


  app.get('/', {preHandler:[requireCookies]}, async (request: FastifyRequest, reply: FastifyReply)=>{
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where({
        session_id: sessionId,
      })
      .select()

    reply.code(200).send({transactions})
  })


  app.get('/:id', {preHandler:[requireCookies]}, async(request: FastifyRequest, reply: FastifyReply) =>{
    const { id } = getTransactionParamsSchema.parse(request.params)
    const { sessionId } = request.cookies

    const transaction = await knex('transactions')
    .where({
      session_id: sessionId,
      id
    })
    .first()

    reply.code(200).send({transaction})
  })


  app.get('/summary', {preHandler:[requireCookies]}, async(request: FastifyRequest, reply: FastifyReply) =>{
    const { sessionId } = request.cookies

    const summary = await knex('transactions')
    .where({session_id: sessionId})
    .sum('amount', {as: 'amount'})
    .first()

    reply.code(200).send({summary})
  })


}