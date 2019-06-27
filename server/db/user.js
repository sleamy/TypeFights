const knex = require('./knex')

exports.updateStats = function(email, newRating, fights, wins, losses) {
    knex('fighter')
        .where({email: email})
        .update({
            rating: newRating, 
            fights: fights,
            wins: wins,
            losses: losses
        })
        .returning('*')
}

exports.getUserStats = function(email, cb) {

    knex('fighter')
        .select('*')
        .where({email: email})
        .then(user => { 
            user = user[0]
            cb({
                fights: user.fights,
                wins: user.wins,
                losses: user.losses,
                rating: user.rating
            })
        })
}