"use strict";
// conectar a la base de datos MongoDB
var mongoose = require("mongoose");
// exportar configuracion de express
var app = require("./app");
var port = process.env.PORT || 3999;

mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://Anthony:ECUADOR@cluster0.gwpjz.mongodb.net/db-veicor",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  // mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true })
  .then(() => {
    console.log("conexion a MongoDB correcta");

    // crear servidor
    app.listen(port, () => {
      console.log("El servidor http://localhost:3999 esta funcionando");
    });
  })
  .catch((error) => console.log(error));
