import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      titles: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { titles, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      titles,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}
