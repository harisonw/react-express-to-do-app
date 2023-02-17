require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://db/to-do-app';
console.log(MONGO_URI);

const app = express();

app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', true);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB on ' + MONGO_URI))
  .catch(console.error);


const Todo = require("./models/Todo");

app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post("/todos/new", async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
    });

    await todo.save();
    res.json(todo);
});

app.delete("/todos/delete/:id", async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
});

app.put("/todos/complete/:id", async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
});



app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));