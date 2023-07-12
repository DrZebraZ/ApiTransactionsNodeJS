import { test, expect, beforeAll, afterAll, describe, it, beforeEach } from "vitest";
import request from "supertest"
import { app } from "../server";
import { execSync } from "node:child_process";
import { afterEach } from "node:test";

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

  it('Should be able to create a new transaction', async ()=>{
    await request(app.server)
      .post('/transactions')
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit"
      })
      .expect(201)
  })

  it('Should be able to list all transactions', async ()=>{
    const responsePostNewTransaction = await request(app.server)
      .post('/transactions')
      .send({
        "title": "New Transaction",
        "amount": 5000,
        "type": "credit"
      })
      
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

  })

})