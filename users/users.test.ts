import 'jest'
import * as  request from 'supertest'

let address: string = (<any>global).address

test('get /users', ()=>{
  return request(address)
    .get('/users')
    .then(response =>{
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('post /users', ()=>{
  return request(address)
  .post('/users')
  .send({
    name: 'usuario1',
    email: 'usuario1@email.com',
    password: '123456',
    cpf: '688.144.310-27'
  })
  .then(response =>{
    expect(response.status).toBe(200)
    expect(response.body._id).toBeDefined()
    expect(response.body.name).toBe('usuario1')
    expect(response.body.email).toBe('usuario1@email.com')
    expect(response.body.cpf).toBe('688.144.310-27')
    expect(response.body.password).toBeUndefined()
  }).catch(fail)
})

test('post /users - required name', ()=>{
  return request(address)
  .post('/users')
  .send({
    email: 'usuario3@email.com',
    password: '123456',
    cpf: '688.144.310-27'
  })
  .then(response =>{
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors[0].message).toContain('name')    
  })
  .catch(fail)
})

test('get /users - finByEmail', ()=>{
  return request(address)
  .post('/users')
  .send({
    name: 'usuario4',
    email: 'usuario4@email.com',
    password: '123456'
  }).then(response => request(address)
            .get('/users')
            .query({email: 'usuario4@email.com'}))
  .then(response =>{
    expect(response.status).toBe(200)
    expect(response.body.items).toBeInstanceOf(Array)
    expect(response.body.items).toHaveLength(1)
    expect(response.body.items[0].email).toBe('usuario4@email.com')
  })
  .catch(fail)
})

test('get /users/aaaaa - not found', ()=>{
  return request(address)
  .get('/users/aaaaa')
  .then(response =>{
    expect(response.status).toBe(404)
  }).catch(fail)
})

test('get /users/:id', ()=>{
  return request(address)
            .post('/users')
            .send({
              name: 'usuario5',
              email: 'user5@gmail.com',
              password: '123456',
              cpf: '482.326.154-27'
            }).then(response => request(address)
                     .get(`/users/${response.body._id}`))
              .then(response=>{
                       expect(response.status).toBe(200)
                       expect(response.body.name).toBe('usuario5')
                       expect(response.body.email).toBe('user5@gmail.com')
                       expect(response.body.cpf).toBe('482.326.154-27')
                       expect(response.body.password).toBeUndefined()
           }).catch(fail)
})

test('delete /users/aaaaa - not found', ()=>{
  return request(address)
          .delete(`/users/aaaaa`)
          .then(response=>{
                expect(response.status).toBe(404)
           }).catch(fail)
})

test('delete /users:/id', ()=>{
  return request(address)
            .post('/users')
            .send({
              name: 'usuario7',
              email: 'user7@gmail.com',
              password: '123456',
              cpf: '187.638.581-26'
            }).then(response => request(address)
                     .delete(`/users/${response.body._id}`))
              .then(response=>{
                expect(response.status).toBe(204)
           }).catch(fail)

})


test('patch /users/aaaaa - not found', ()=>{
  return request(address)
          .patch(`/users/aaaaa`)
          .then(response=>{
                expect(response.status).toBe(404)
           }).catch(fail)
})

test('post /users - invalid CPF', ()=>{
  return request(address)
            .post('/users')
            .send({
              name: 'usuario8',
              email: 'user8@gmail.com',
              password: '123456',
              cpf: '123.458.789-10'
            })
            .then(response=>{
              expect(response.status).toBe(400)
              expect(response.body.errors).toBeInstanceOf(Array)
              expect(response.body.errors).toHaveLength(1)
              expect(response.body.errors[0].message).toContain('Invalid CPF')
            })
            .catch(fail)
})

test('post /users - duplicated email', ()=>{
  return request(address)
            .post('/users')
            .send({
              name: 'usuario9',
              email: 'usuario9@email.com',
              password: '123456',
              cpf: '593.436.344-12'
            }).then(response=>
                   request(address)
                      .post('/users')
                      .send({
                        name: 'usuario9',
                        email: 'usuario9@email.com',
                        password: '123456',
                        cpf: '593.436.344-12'
                      }))
            .then(response=>{
              expect(response.status).toBe(400)
              expect(response.body.message).toContain('E11000 duplicate key')
            })
            .catch(fail)
})


test('patch /users/:id', ()=>{
  return request(address)
  .post('/users')
  .send({
    name: 'usuario2',
    email: 'usuario2@email.com',
    password: '123456'
  })
  .then(response => request(address)
                    .patch(`/users/${response.body._id}`)
                    .send({
                      name: 'usuario2 - patch'
                    }))
  .then(response=>{
    expect(response.status).toBe(200)
    expect(response.body._id).toBeDefined()
    expect(response.body.name).toBe('usuario2 - patch')
    expect(response.body.email).toBe('usuario2@email.com')
    expect(response.body.password).toBeUndefined()
  })                    
  .catch(fail)
})

test('put /users/aaaaa - not found', ()=>{
  return request(address)
          .put(`/users/aaaaa`)
          .then(response=>{
                expect(response.status).toBe(404)
           }).catch(fail)
})

test('put /users:/id', ()=>{
  return request(address)
            .post('/users')
            .send({
              name: 'usuario10',
              email: 'user10@email.com',
              password: '123456',
              cpf: '613.586.318-59',
              gender: 'Male'
            }).then(response => request(address)
                     .put(`/users/${response.body._id}`)
                     .send({
                       name: 'usuario10',
                       email: 'user10@email.com',
                       password: '123456',
                       cpf: '613.586.318-59'
                     }))
              .then(response=>{
                       expect(response.status).toBe(200)
                       expect(response.body.name).toBe('usuario10')
                       expect(response.body.email).toBe('user10@email.com')
                       expect(response.body.cpf).toBe('613.586.318-59')
                       expect(response.body.gender).toBeUndefined()
                       expect(response.body.password).toBeUndefined()
            }).catch(fail)

})