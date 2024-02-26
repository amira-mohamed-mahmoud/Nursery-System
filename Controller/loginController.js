const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
require("../Schemas/teacherSchema");
const TeacherSchema = mongoose.model("teachers");
// login and authentication
exports.login = (request, response, next) => {
	if (request.body.fullName == "admin" && request.body.password == "123456") {
		//  authentication
		let token = jwt.sign({ id: 1, role: "admin" }, "ITI", { expiresIn: "2h" });// secret Key:ITI
		response.status(200).json({ message: "Authenticated", token });
	} else {
		TeacherSchema.findOne({ fullName: request.body.fullName })
			.then((data) => {
				if (data == null) {
					let error = new Error("Not Authenticated");
					error.status = 401;
					next(error);
				} else {
					let checkPass = bcrypt.compareSync(request.body.password, data.password);//password encryption
					if (!checkPass) {
						let error = new Error("Not Authenticated");
						error.status = 401;
						next(error);
					} else {
						let token = jwt.sign({ id: data._id, role: "teacher" }, "ITI", { expiresIn: "2h" });
						response.status(200).json({ message: "Authenticated", token });
					}
				}
			})
			.catch((error) => {
				next(error);
			});
	}
};
