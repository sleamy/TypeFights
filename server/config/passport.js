const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const knex = require('../db/knex')
const keys = require('../config/keys')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey

module.exports = passport => {
    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
        // TODO: create findById function
        knex('fighter')
            .select()
            .where({id: jwt_payload.id})
            .then(fighter => {
                if(fighter[0]) {
                    return done(null, fighter)
                }
                return done(null, false)
            })
            .catch(err => console.log(err))
      })
    );
  };