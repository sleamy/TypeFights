
const wordsList = require('./words')

exports.getWords = function(num) {
    let words = [];
        for (let i = 0; i < num; i++) {            
            words.push(wordsList[Math.round(Math.random() * wordsList.length)]);
        }
        return words
}