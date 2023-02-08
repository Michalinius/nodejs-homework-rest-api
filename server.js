const app = require('./app')
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

app.listen(3000, () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Database connection successful");
    console.log("Server running. Use our API on port: 3000");
  }).catch((error) => {
    console.log(error);
    process.exit(1);
  })
})

process.on("SIGINT", () => {
  mongoose.disconnect();
  console.log("Database disconnected")
})