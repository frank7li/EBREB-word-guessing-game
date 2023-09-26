const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');
const port = 3000;

app.use(cors());
app.use(express.json());

// Declare variables
let userGuesses = [];
let correctGuesses = [];
let totalnum = 0;
let correctnum = 0;
let current_word = "";
let scrambled_word = "";
let user_word = "";

// Get list of all correct gesses
app.get('/api/correct-guesses', (req, res) => {
  res.json(correctGuesses);
});

// Ger list of all user guesses
app.get('/api/user-guesses', (req, res) => {
  res.json(userGuesses);
});

// Get success rate
app.get('/api/success-rate', (req, res) => {
    res.json({num: Math.round(correctnum/totalnum*100)});
});

// retrieving a random word from the API and scrambling it
app.get('/api/random-word', async (req, res) => {
  try {
    const response = await axios.get('https://random-word-api.herokuapp.com/word');
    const randomWord = response.data[0];
    current_word = randomWord;
    res.json({ word: randomWord });
    let random_word_arr = randomWord.split('');
    for (let i = random_word_arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [random_word_arr[i], random_word_arr[j]] = [random_word_arr[j], random_word_arr[i]];
      }
    scrambled_word = random_word_arr.join('');
    console.log(current_word);
  } catch (error) {
    console.error('Error fetching wor from API:', error);
    res.status(500).json({ message: 'Error fetching word from API' });
  }
});


//Get the scrambled word
app.get('/api/scrambled-word', async (req, res) => {
  res.json({word:scrambled_word});
})

//Get the original word
app.get('/api/current-word', async (req, res) => {
  res.json({word:current_word});
})

//Reset the history
app.get('/api/reset', async (req, res) => {
  userGuesses = [];
  correctGuesses = [];
  totalnum = 0;
  correctnum = 0;
  res.json({ message: "reset successfull" });
})


// check if the guess is correct
app.post('/api/check-guess', (req, res) => {
  const { guess } = req.body;
  if (!guess) {
    return res.status(400).json({ message: 'A guess is required' });
  }
  user_word = guess;
  userGuesses.push(guess);
  correctGuesses.push(current_word);
  totalnum += 1;
  if (guess.toLowerCase() === current_word.toLowerCase()) {
    correctnum += 1;
    res.json({ message: 'correct' });
  }else{
    res.json({ message: 'incorrect' });
  }
});

//logs the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
