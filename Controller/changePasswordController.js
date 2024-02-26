const Teacher = require('../Schemas/teacherSchema');
const bcrypt = require('bcryptjs');

// Change password endpoint for teachers
exports.changeTeacherPassword = async (req, res, next) => {
    try {
        const { id, newPassword } = req.body;

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        // Update teacher's password in the database
        const updatedTeacher = await Teacher.findByIdAndUpdate(id, { password: hashedPassword });

        if (!updatedTeacher) {
            // If teacher is not found, return an error
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json({ message: 'Password changed successfully for teacher' });
    } catch (error) {
        next(error);
    }
};
