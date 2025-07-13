const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');



const app = express();
const PORT = 3000
const FILE = './todos.json'

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

// function to help read to-dos
function readTodos() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  } catch (err) {
    console.error('Failed to read or parse todos.json:', err.message);
    return [];
  }
}

// fucntion to help save todo
function saveTodos(todos) {
    fs.writeFileSync(FILE, JSON.stringify(todos, null, 2))
}

// Get all todos
app.get('/todos', (req, res) => {
    const todos = readTodos()
    res.json(todos)
})

// post a new todo
app.post('/todos', (req, res) => {
    const todos = readTodos()
    const newTodo = {
        id: Date.now(),
        task: req.body.task
    }
    todos.push(newTodo)
    saveTodos(todos)
    res.status(201).json(newTodo)
})


// DELETE a todo
app.delete('/todos/:id', (req, res) => {
  let todos = readTodos();
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  saveTodos(todos);
  res.status(204).send();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
