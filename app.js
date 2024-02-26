const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const teacherRoute = require("./Routes/teachersRoute");
const childsRoute = require("./Routes/childRoute");
const classesRoute = require("./Routes/classesRoute");
const loginRoute = require("./Routes/loginRoute");
const authMW = require("./MW/auth/authorizationMiddleWare");
const changePasswordRoute = require("./Routes/changePassword");
require("dotenv").config();// for file .env
const port = process.env.PORT || 8080;
const server = express();
// connnect to DB and statrt the server

// Apply strict mode to queries
mongoose.set("strictQuery", true);
mongoose
	.connect("mongodb://127.0.0.1:27017/NurserySystem")
	.then(() => {
		console.log("DataBase Connection Success");
		server.listen(port, () => console.log(`listening on http://localhost:${port},`));
	})
	.catch((error) => {
		console.log("Connection Error: " + error);
	});

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// Swagger options
const swaggerOptions = {
	swaggerDefinition: {
	  openapi: '3.0.0',
	  info: {
		title: 'School API Documentation',
		version: '1.0.0',
		description: 'Documentation for School API',
	  },
	  servers: [
		{
		  url: `http://localhost:${process.env.PORT || 8080}`,
		  description: 'Development server',
		},
	  ],
	},
	apis: ['./Routes/*.js'], // Path to the API routes files
  };
  
  // Initialize Swagger
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  



server.use(cors());
server.use(logger("dev"));

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(loginRoute);
server.use(authMW);
server.use(teacherRoute);
server.use(childsRoute);
server.use(classesRoute);
server.use(changePasswordRoute);

server.use((require, result, next) => {
	result.status(404).json({ massage: "Not Found" });
});

server.use((error, require, result, next) => {
	let status = error.status || 500;
	result.status(status).json({ massage: error + "" });
});
