    const Student = require('../Models/Student');

//get all students
    exports.getAllStudents = async (req, res) => {
        try {
            const students = await Student.find();
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ message: "Error fetching students", error });
        }
    }

    //get a student by id
        exports.getStudentById = async (req, res) => {
        const { classId } = req.params;
        try {
            const student = await Student.findById(classId);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json(student);
        }catch(error){
            res.status(502).json({ message: "Error fetching student", error });
        }
    }

    //create a new student
    function getNextAdmissionNumber(students) {
        if (students.length === 0) return 'EDU0001';
    
        // Get highest existing number
        const numbers = students
            .map(s => s.admissionNumber)
            .filter(n => n && /^EDU\d+$/.test(n)) // Filter valid ones
            .map(n => parseInt(n.replace('EDU', ''), 10));
    
        const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
        const nextNumber = maxNumber + 1;
    
        return `EDU${String(nextNumber).padStart(4, '0')}`;
    }
    
    exports.createStudent = async(req, res) => {
        const dbData = readData();
        const newId = dbData.students.length > 0 ? Math.max(...dbData.students.map(s => s.id)) + 1 : 1;
        const admissionNumber = getNextAdmissionNumber(dbData.students);
    
        const newStudent = {
            ...req.body,
            id: newId,
            admissionNumber,
            image: req.file ? req.file.filename : null
        };
    
        // dbData.students.push(newStudent);
    
        // writeData(dbData);
        const savedStudent = await model.create(newStudent) 
    
    
        res.status(201).json({ message: "Student added successfully", student: newStudent });
    }

    //update a student by id
    exports.updateStudent = async (req, res) => {
        const { classId } = req.params;
        try {
            const updatedStudent = await Student.findByIdAndUpdate(classId, req.body, { new: true });   
            if (!updatedStudent) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json(updatedStudent);
        }catch(error){
            res.status(502).json({ message: "Error fetching student", error });

        }
    }
    //delete a student by id
    exports.deleteStudent = async (req, res) => {
        const { classId } = req.params;
        try {
            const deletedStudent = await Student.findByIdAndDelete(classId);
            if (!deletedStudent) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({ message: "Student deleted successfully" });
        }
        catch(error){

            res.status(502).json({ message: "Error fetching student", error });
        }
    }