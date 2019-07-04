const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

const knex = require('../../db/knex')

// Load input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

router.get('/', (req, res) => {
    knex('fighter')
        .select()
        .then(users => {
            res.json(users)
        })
})

router.get('/leaderboard', (req, res) => {
    knex('fighter')
        .select('*')
        .where('fights', '>', 0)
        .limit(10)
        .then(users => {
            res.json(users)
        })
})

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    // Check validation
    if(!isValid) {
        return res.status(400).json(errors)
    }

    knex('fighter')
        .select()
        .where({ email: req.body.email })
        .then(user => {
            user = user[0]

            if (user) {
                errors.email = 'Email already in use'
                return res.status(400).json(errors)
            } else {

                knex('fighter')
                    .select()
                    .where({ username: req.body.username })
                    .then(user => {
                        user = user[0]
                        if (user) {
                            return res.status(400).json({ username: 'Username already in use' })
                        } else {
                            const newUser = {
                                username: req.body.username,
                                email: req.body.email,
                                password: req.body.password,
                                joined: new Date()
                            }
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash
                                    knex('fighter')
                                        .returning('*')
                                        .insert(newUser)
                                        .then(user => res.json(user[0]))
                                        .catch(err => console.log(err))
                                })
                            })
                        }
                    })
            }
        })
})

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body)

    // Check validation
    if(!isValid) {
        return res.status(400).json(errors)
    }


    const username = req.body.username
    const password = req.body.password

    knex('fighter')
        .select()
        .where({username: username})
        .then(user => {
            user = user[0]

            if(!user) {
                errors.username = 'User does not exist'
                return res.status(404).json(errors)
            }

            // Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // User matched

                        const payload = {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            fights: user.fights,
                            wins: user.wins,
                            losses: user.losses,
                            rating: user.rating
                        }
                        
                        // Sign token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 604800 }, (err, token) => {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            })
                        })
                    } else {
                        errors.password = 'Incorrect password'
                        return res.status(400).json(errors)
                    }
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user)
})

module.exports = router