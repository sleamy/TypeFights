const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))