require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
const Person = require("./models/person");

morgan.token("postR", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postR",
    {
      skip: function (req, res) {
        return req.method !== "POST";
      },
    }
  )
);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  })
);

let persons = [
  {
    name: "Ahmet Mehmet",
    number: "Devam Mevam",
    id: 1,
  },
  {
    name: "Yusuf Musuf",
    number: "Tamam Mamam",
    id: 2,
  },
];

const getNewId = () => {
  // maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  // return maxId + 1;
  return Math.floor(Math.random() * 100000000);
};

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person.toJSON());
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;
  if (!person.name || !person.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  } else if (persons.filter((p) => p.name === person.name).length > 0) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });
  newPerson.save().then((savedNote) => {
    res.json(savedNote.toJSON());
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => {
    res.json(result.map((p) => p.toJSON()));
  });
});

app.get("/api/info", (req, res) => {
  const lenInfo = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${new Date().toString()}</p>`;

  res.send(lenInfo);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server runin on port ${PORT}`);
});
