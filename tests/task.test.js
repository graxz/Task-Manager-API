const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    setupDB, 
    user1, 
    user1Id, 
    user2, 
    user2Id, 
    task1, 
    task2, 
    task3 
} = require('./fixtures/db')

beforeEach(setupDB)

test('criar task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: 'Terminar o curso de NodeJS'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('receber todas as task do usuario', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('nao excluir tarefas de outro usuario', async () => {
    const response = await request(app)
        .delete(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull()
})

test('nao cria tasks com dados invalidos', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: 123,
            completed: 'isaddora'
        })
        .expect(400)
})

test('nao atualiza tasks de outro user', async () => {
    await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send({
            description: 'Isaddora',
            completed: true
        })
        .expect(404)
})

test('achar tasks por id', async () => {
    await request(app)
        .get(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('achar tasks completas', async () => {
    await request(app)
        .get(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(200)
})

test('achar tasks incompletas', async () => {
    await request(app)
        .get(`/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send({
            completed: false
        })
        .expect(200)
})

test('nao deleta task sem autentificacao', async () => {
    await request(app)
        .delete(`/tasks/${task1._id}`)
        .send()
        .expect(401)
})

test('nao acha tasks por id sem autentificacao', async () => {
    await request(app)
        .get(`/tasks/${task1._id}`)
        .send()
        .expect(401)
})

test('nao acha tasks por id sem autentificacao', async () => {
    await request(app)
        .get(`/tasks/${task1._id}`)
        .send()
        .expect(401)
})

test('nao deve achar tasks de outros usuarios por id', async () => {
    await request(app)
        .get(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(404)
})

test('classifica as tasks por description/completed/createdAt/updatedAt', async () => {
    await request(app)
        .get(`/tasks?sortBy=createdAt:desc`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            completed: false
        })
        .expect(200)
})

// test('nao atualiza a task com description/completed invalido', async () => {
//     await request(app)
//         .patch(`/tasks/${task1._id}`)
//         .set('Authorization', `Bearer ${user1.tokens[0].token}`)
//         .send({
//             description: new Object,
//             completed: 'Isaddora'
//         })
//         .expect(400)
// })