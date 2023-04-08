const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON request bodies
app.use(bodyParser.json());

// Define the API routes
app.get('/api/questions', (req, res) => {
  // Read the questions JSON file and send it in the response
  const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json')));
  res.send(questions);
});

app.get('/api/questions/:id', (req, res) => {
  // Find the question with the specified ID and send it in the response
  const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json')));
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (question) {
    res.send(question);
  } else {
    res.sendStatus(404);
  }
});

app.post('/api/questions', (req, res) => {
  // Add a new question to the questions JSON file and send it in the response
  const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json')));
  const newQuestion = {
    id: questions.length + 1,
    question: req.body.question,
    skill: req.body.skill,
    choices: req.body.choices,
    correct: req.body.correct,
    explanations: req.body.explanations
  };
  questions.push(newQuestion);
  fs.writeFileSync(path.join(__dirname, 'questions.json'), JSON.stringify(questions, null, 2));
  res.send(newQuestion);
});

app.put('/api/questions/:id', (req, res) => {
  // Update the question with the specified ID in the questions JSON file and send it in the response
  const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json')));
  const questionIndex = questions.findIndex(q => q.id === parseInt(req.params.id));
  if (questionIndex !== -1) {
    questions[questionIndex].question = req.body.question;
    questions[questionIndex].skill = req.body.skill;
    questions[questionIndex].choices = req.body.choices;
    questions[questionIndex].correct = req.body.correct;
    questions[questionIndex].explanations = req.body.explanations;
    fs.writeFileSync(path.join(__dirname, 'questions.json'), JSON.stringify(questions, null, 2));
    res.send(questions[questionIndex]);
  } else {
    res.sendStatus(404);
  }
});

app.delete('/api/questions/:id', (req, res) => {
  // Delete the question with the specified ID from the questions JSON file and send a success response
  const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json')));
  const questionIndex = questions.findIndex(q => q.id === parseInt(req.params.id));
  if (questionIndex !== -1) {
    questions.splice(questionIndex, 1);
    fs.writeFileSync(path.join(__dirname, 'questions.json'), JSON.stringify(questions
        , null, 2));
        res.sendStatus(200);
        } else {
        res.sendStatus(404);
        }
        });
        // Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
    });