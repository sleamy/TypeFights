const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')

const app = express()

const PORT = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(passport.initialize())

// Passport Config
require('./config/passport')(passport);

app.use('/api/users', users)

app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))