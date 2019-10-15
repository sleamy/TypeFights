class Player {

    constructor(id, room, user, playerNumber) {
        this.id = id
        this.room = room;
        this.user = user;
        this.recentElo = 0;
        this.playerNumber = playerNumber
    }
    
}

module.exports = Player;