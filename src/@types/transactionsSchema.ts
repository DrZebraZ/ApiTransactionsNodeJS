import { z } from 'zod'

export const createTransactionBodySchema = z.object({
  title: z.string().min(3),
  amount: z.number().min(1),
  type: z.enum(['credit', 'debit']),
})

export const getTransactionParamsSchema = z.object({
  id: z.string().uuid()
})