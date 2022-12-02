const Mongoose = require("mongoose"); 

Mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true
}, () => {
  console.log("Database connection established successfully"); 
}); 
