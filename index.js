const express = require("express");
const app = express();
app.use(express.json());

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
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log("persons", persons);
  console.log("id", id);
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

  const newPerson = {
    name: person.name,
    number: person.number,
    id: getNewId(),
  };
  console.log("newPerson", newPerson);
  console.log("persons", persons);
  persons = persons.concat(newPerson);
  console.log("persons", persons);
  res.json(newPerson);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/info", (req, res) => {
  const lenInfo = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${new Date().toString()}</p>`;

  res.send(lenInfo);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server runin on port ${PORT}`);
});
