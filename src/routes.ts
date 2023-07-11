import { FastifyInstance } from "fastify";
import { transactionRoutes } from "./routes/transactions";

export function registerRoutes(app: FastifyInstance){
  app.register(transactionRoutes, {prefix: 'transactions'})
}