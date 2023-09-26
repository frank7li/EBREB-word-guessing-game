# EBREB-word-guessing-game
Author: Zhijian (Frank) Li
Email: zhijian.li@vanderbilt.edu


How to use the website:
    Installations to run the backend node_server.js:
        npm install express
        npm install cors
        npm install axios
        npm install crypto

    To run the backend node_server.js:
        -open the terminal
        -cd into the correct directory
        -call "node node_server.js"

    Then opening index.html in the browser to start playing


Brief reflection of the code:
    It has a color changing beautiful title that persist throughout the game.
    It starts with a begin page that explains the rule of the game.
    In the game, it retrieves a random word from the node.js server that's collected from the API ('https://random-word-api.herokuapp.com/word') and the scrambled version of the word.
    The hint button retrieves the correct word and the currently scrambled word from the server and shows the first half of the correct word. The rest of the letters will remain in the same order in the scrambled word and is shown to the user to help making the guess.
    After the user enters a guess, the guess button will prompt the server to evaluate whether it is correct or not and show the corresponding display. It will also record the history of the guess.
    After a game is played, the statistics will appear showing all the actual words, the user guesses and the accuracy. The reset button will reset the history and bring the statistics out of display.



