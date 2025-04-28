const express=require("express")

const StudentsRouter=express.Router()
const StudentController=require("../Controllers/Students")


// Define the routes for student operations
// Get all students
StudentsRouter.get("/",StudentController.getAllStudents)
// Get a student by ID

StudentsRouter.get("/:id",StudentController.getStudentById)
// Create a new student
StudentsRouter.post("/",StudentController.createStudent)
// Update a student by ID
StudentsRouter.put("/:id",StudentController.updateStudent)
// Delete a student by ID
StudentsRouter.delete("/:id",StudentController.deleteStudent)   


