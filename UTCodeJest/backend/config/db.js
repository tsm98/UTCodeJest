const mongoose = require("mongoose");
const config = require("config");

const db = "mongodb+srv://sairam_maddala:CrFK3miLwJKnYk57@cluster0.6o1vrwt.mongodb.net/UTCodeJest?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("----------------MongoDB connected----------------------");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
