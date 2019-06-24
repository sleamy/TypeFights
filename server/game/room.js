
const wordsList = require('./words')

class Room {

    constructor(id) {
        this.id = id;
        this.players = [];
        this.health = 0;
        this.goal = 50;
        this.ended = false;
        this.winner = -1;
        this.words = this.initWords();
        this.countdown = 5;
    }

    initWords() {
        let words = [];
        for (let i = 0; i < 400; i++) {            
            words.push(wordsList[Math.round(Math.random() * wordsList.length)]);
        }
        return words
    }

}

module.exports = Room;