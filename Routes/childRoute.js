const express = require("express");
const controller = require("../Controller/childController");
const validation = require("./../MW/validations/validationMiddleWare");
const childValidation = require("../Validation/childValidation");
const { checkAdmin } = require("../MW/auth/authorizationMiddleWare");
const router = express.Router();

router
	.route("/child")
	.all(checkAdmin)// not admin ; not authorized cant access these 
	.get(controller.getAllChild)
	.post(childValidation.postValidation, validation, controller.addChild)
	.patch(childValidation.patchValidation, validation, controller.updateChild)
	.delete(childValidation.deleteValidation, validation, controller.deleteChild);
router.get("/child/:id", checkAdmin, childValidation.getChildValidation, validation, controller.getChild);

module.exports = router;
