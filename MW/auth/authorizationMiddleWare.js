const { request, response } = require("express");
const jwt = require("jsonwebtoken");
// after authentication then authorization 
module.exports = (request, response, next) => {
	try {
		let token = request.get("authorization").split(" ")[1];//token
		let decodedToken = jwt.verify(token, "ITI");
		request.id = decodedToken.id;
		request.role = decodedToken.role;
		next(); // 
	} catch (error) {
		error.status = 401;
		error.message = "Not Authorized";
		next(error);
	}
};

module.exports.checkAdmin = (request, response, next) => {
	if (request.role == "admin") {
		next();// teacher route
	} else {
		let error = new Error("Not Authorized");
		error.status = 401;
		next(error);
	}
};

module.exports.checkTeacherAndAdmin = (request, response, next) => {
	if (request.role == "admin" || request.role == "teacher") {
		next();//teacher route, 
	} else {
		let error = new Error("Not Authorized");
		error.status = 401;
		next(error);
	}
};
