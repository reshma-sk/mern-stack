const mongoose = require("mongoose");

async function connectMongoDb(url) {
  mongoose.connection.on("connected", () => {
    console.log("✅ [Mongoose] Connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ [Mongoose] Connection error:", err);
  });

  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  connectMongoDb,
};
