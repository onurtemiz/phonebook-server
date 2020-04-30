const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://onuryokeder:${password}@cluster0-zqsgs.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((p) => {
      console.log(p);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const newPerson = new Person({
    name: `${process.argv[3]}`,
    number: `${process.argv[4]}`,
  });
  newPerson.save().then((response) => {
    console.log(
      `added ${newPerson.name} number ${newPerson.number} added to phonebook`
    );
    mongoose.connection.close();
  });
} else {
  mongoose.connection.close();
  process.exit(1);
}
