const wordsHelper = require('./helper')

class Room {

    constructor(id) {
        this.id = id;
        this.players = [];
        this.health = 0;
        this.goal = 50;
        this.ended = false;
        this.winner = -1;
        this.words = this.initWords();
        this.rematch = [false, false]
    }

    initWords() {
        return wordsHelper.getWords(400)
    }

}

module.exports = Room;