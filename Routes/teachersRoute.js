const express = require("express");
const controller = require("./../Controller/teachersController");
const validation = require("./../MW/validations/validationMiddleWare");
const teachervalidation = require("./../Validation/teachersValidation");
const { checkAdmin, checkTeacherAndAdmin } = require("./../MW/auth/authorizationMiddleWare");
const multer = require("multer");
const path = require("path");

const uploadImage = multer({
	fileFilter: (request, file, callback) => {
		if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
			callback(null, true);
		} else {
			callback(new Error("Invalid image"));
		}
	},
	storage: multer.diskStorage({
		destination: (request, file, callback) => {
			callback(null, path.join(__dirname, "..", "Images"));
		},
		filename: (request, file, callback) => {
			let extension = path.extname(file.originalname);
			let name = path.basename(file.originalname, extension);
			let imageName = name + "-" + Date.now() + extension;
			callback(null, imageName);
		},
	}),
});
//size
const router = express.Router();

router
	.route("/teachers")
	.all(checkAdmin)// aughentication the authorization
	.get(controller.getAllTeachers)
	.post(uploadImage.single("image"), teachervalidation.postValidation, validation, controller.addTeacher)
	.delete(teachervalidation.deleteValidation, validation, controller.deleteTeacher);

router.patch(
	"/teacher",
	checkTeacherAndAdmin,// authentication
	uploadImage.single("image"),

	teachervalidation.patchValidation,
	validation,
	controller.updateTeacher
);
router.get("/teachers/:id", checkAdmin, teachervalidation.getTeacherValidation, validation, controller.getTeacher);

module.exports = router;
