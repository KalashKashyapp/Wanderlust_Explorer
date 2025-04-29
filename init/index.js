const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  //step-1 Delete all data .
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ 
    ...obj,
    owner: "680ca7bde974fcf0e4e4847c",
  }));
  //step-2 then insert our data . here, data is an object (jo ki data.js me banaya tha export krte time.)
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

//calling the funct.
initDB();
