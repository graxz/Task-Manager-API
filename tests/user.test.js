const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { setupDB, user1, user1Id } = require('./fixtures/db')

beforeEach(setupDB)

test('criar usuario', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Isaddora',
            email: 'isaddorafreitasar@exemplo.com',
            password: 'isaddorinha'
        })
        .expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Isaddora',
            email: 'isaddorafreitasar@exemplo.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('isaddorinha')
})

test('login usuario', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: user1.email,
            password: user1.password
        })
        .expect(200)

    const user = await User.findById(user1Id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('login caso não exista o usuario', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'isatkm@gmail.com',
            password:'ehissoaicaraio'
        })
        .expect(400)
})

test('ler perfil', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('sem autorizacao tentar ler perfil', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('deletar usuario', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user).toBeNull()
})

test('sem autorizacao tentar deletar usuario', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('upar img avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/me.png')
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('atualizar usuario', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            name: 'Isaddora'
        })
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user.name).toEqual('Isaddora')
})

test('caso nao exista o que quer atualizar nao atualiza', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            lixo: 'isaddora'
        })
        .expect(400)
})

test('dados para registro invalidos', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 123,
            email: 'isaddora',
            password: 'password'
        })
        .expect(400)
})

test('sem autorizacao nao pode atualizar', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Isaddora'
        })
        .expect(401)
})

test('dados para atualizacao invalidos', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 1274,
            email: 'isaddora',
            password: 'password'
        })
        .expect(401)
})

test('nao deleta usuario sem estar autentificado', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})