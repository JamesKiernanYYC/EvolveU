const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cors = require('cors')
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const app = express()

app.use(bodyParser.json())
app.use(cors())

const database = {
    users: [
        {
            id: "123",
            name: 'James',
            email: 'James@email.com',
            password: 'james',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '124',
            name: 'sally',
            email: 'sally@email.com',
            password: 'sally',
            entries: 0,
            joined: new Date(),
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'james@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    bcrypt.compare('jim', '$2b$10$BWOkmsrU6o.0/ZE33wKwm.QQ4YoTFdhP7fLc.9g80QhOG/FzmQjy2', function(err, res) {
        console.log('first guess', res)
    });
    bcrypt.compare('rat', '$2b$10$BWOkmsrU6o.0/ZE33wKwm.QQ4YoTFdhP7fLc.9g80QhOG/FzmQjy2', function(err, res) {
        console.log('second guess', res)
    });
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0])
        } else {
            res.status(400).json('error logging in')
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body
    bcrypt.hash(password, saltRounds, (err, hash) => {
        console.log(hash)
      });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    })
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    let found = false
    database.users.forEach(user => {
        if (user.id === id) {
            found = true
            return res.json(user)
        } 
    })
    if (!found) {
        res.status(400).json('not found')
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body
    let found = false
    database.users.forEach(user => {
        if (user.id === id) {
            found = true
            user.entries++
            return res.json(user.entries)
        } 
    })
    if (!found) {
        res.status(400).json('not found')
    }
})

app.listen(3001, () => {
    console.log('app is running on port 3001')
})
