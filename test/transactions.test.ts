import { expect, beforeAll, afterAll, describe, it, beforeEach } from "vitest";
import request from "supertest"
import { app } from "../src/server";
import { execSync } from "node:child_process";

describe("Transaction routes", () => {

  beforeAll(async ()=>{
    await app.ready()
    execSync('npm run knex migrate:latest')
  })


  afterAll(async ()=>{
    execSync('npm run knex -- migrate:rollback --all')
    await app.close()
  })


  beforeEach(()=>{
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })


  it('Should be able to create 2 transactions and verify the routes for get the transactions and verify the amount', async ()=>{
    const responsePostNewTransaction = await request(app.server)
      .post('/transactions')
      .send({
        "title": "New Transaction",
        "amount": 5000,
        "type": "credit"
      })
      .expect(201)

    const cookies = responsePostNewTransaction.get('Set-Cookie')
    

    const responseGetTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)
    
    expect(responseGetTransactions.body.transactions).toEqual([
      expect.objectContaining({
        "title": "New Transaction",
        "amount": 5000,
      })
    ])


    const { id } = responseGetTransactions.body.transactions[0]

    const responseGetTransactionById = await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(responseGetTransactionById.body.transaction).toEqual(
      expect.objectContaining({
        "id": id,
        "title": "New Transaction",
        "amount": 5000,
      })
    )


    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        "title": "New Transaction",
        "amount": 3000,
        "type": "debit"
      })
      .expect(201)
    
      
    const responseGetResume = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(responseGetResume.body.summary).toEqual({amount:2000})

  })
})