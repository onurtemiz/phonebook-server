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

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

// GET ALL PEOPLE
app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => {
    res.json(result.map((p) => p.toJSON()));
  });
});

// GET SPECIFIC PERSON
app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person.toJSON());
  });
});

// DELETE ONE PERSON
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// CHANGE ONE PERSON
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  newPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
    .then((p) => {
      res.json(p.toJSON());
    })
    .catch((error) => next(error));
});

// ADD A NEW PERSON
app.post("/api/persons", (req, res) => {
  const person = req.body;
  if (!person.name || !person.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }
  // else if (persons.filter((p) => p.name === person.name).length > 0) {
  //   console.log("buldu");
  //   Person.find({ name: `${person.name}` })
  //     .then((person) => {
  //       console.log("person", person);
  //     })
  //     .catch((error) => next(error));
  // }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });
  newPerson.save().then((savedNote) => {
    res.json(savedNote.toJSON());
  });
});

// INFO PAGE
app.get("/api/info", (req, res) => {
  Person.collection.countDocuments().then((result) => {
    const lenInfo = `<p>Phonebook has info for 
  ${result} people</p><p>${new Date().toString()}</p>`;

    res.send(lenInfo);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server runin on port ${PORT}`);
});
