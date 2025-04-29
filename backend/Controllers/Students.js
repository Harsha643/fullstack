
const Student = require("../Models/students"); // Adjust path if necessary


// Get all students
exports.getAllStudents = async (req, res) => {
    console.log(req.url);
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
    }
}

// Get a student by ID
exports.getStudentById = async (req, res) => {
    console.log(req.params);
    const { presentClass } = req.params;  // Extract presentClass from the URL

    try {
        // Find all students with the specified presentClass
        const students = await Student.find({ presentClass });

        if (students.length === 0) {
            return res.status(404).json({ message: `No students found in class ${presentClass}` });
        }

        res.status(200).json(students);
    } catch (error) {

        res.status(500).json({ message: "Error fetching students", error });
    }
};




// Function to generate next admission number
function getNextAdmissionNumber(students) {
    if (students.length === 0) return 'EDU0001';

    const numbers = students
        .map(s => s.admissionNumber)
        .filter(n => n && /^EDU\d+$/.test(n))
        .map(n => parseInt(n.replace('EDU', ''), 10));

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;

    return `EDU${String(nextNumber).padStart(4, '0')}`;
}

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const students = await Student.find();
        const admissionNumber = getNextAdmissionNumber(students);

        const newStudent = {
            ...req.body,
            admissionNumber,
            image: req.file ? req.file.filename : null
        };

        const savedStudent = await Student.create(newStudent);

        res.status(201).json({ message: "Student added successfully", student: savedStudent });
    } catch (error) {
        res.status(500).json({ message: "Error creating student", error });
    }
}

// Update a student by ID
exports.updateStudent = async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    console.log(id);
    try {
        const updatedStudent = await Student.findByIdAndUpdate({ _id:id}, req.body, { new: true, runValidators: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(502).json({ message: "Error updating student"+error.message });
    }
}

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(502).json({ message: "Error deleting student" + error.message });
    }
}
