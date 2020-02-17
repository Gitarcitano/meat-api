import 'jest'
import * as mongoose from 'mongoose'
import * as  request from 'supertest'

let address: string = (<any>global).address

test('get /reviews', ()=>{
  return request(address)
    .get('/reviews')
    .then(response =>{
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('get /reviews/aaaaa - not found', ()=>{
  return request(address)
         .get('/reviews/aaaaa')
         .then(response=>{
           expect(response.status).toBe(404)
         })
         .catch(fail)
})

test('post /reviews', ()=>{
  return request(address)
            .post('/reviews')
            .send({
              date: '2018-02-02T20:20:20',
              rating: 4,
              comments: 'ok',
              user: new mongoose.Types.ObjectId(),
              restaurant: new mongoose.Types.ObjectId()
            })
            .then(response=>{
              expect(response.status).toBe(200)
              expect(response.body._id).toBeDefined()
              expect(response.body.rating).toBe(4)
              expect(response.body.comments).toBe('ok')
              expect(response.body.user).toBeDefined()
              expect(response.body.restaurant).toBeDefined()
            })
            .catch(fail)
})