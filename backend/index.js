// File: backend/index.js

const express=require("express")
const fs=require("fs")
const dotenv=require("dotenv")
const multer=require("multer")
const cors=require("cors")
const mongoose=require("mongoose")
const model=require("./models/students")








dotenv.config();

const db = "db.json";
const uploadDir = 'uploads';

// Initialize db.json with empty structure if it doesn't exist
if (!fs.existsSync(db)) {
    fs.writeFileSync(db, JSON.stringify({ students: [], staff: [] }, null, 2));
}

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const readData = () => {
    try {
        const data = fs.readFileSync(db, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading db.json:", error);
        return { students: [], staff: [] }; // Default structure
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(db, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to db.json:", error);
    }
};

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});


//student admission number generater
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





const upload = multer({ storage });

// Add a new student
app.post("/admin/students", upload.single("image"), async(req, res) => {
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
});

// Add a new staff member
app.post("/admin/staff", upload.single("image"), (req, res) => {
    const dbData = readData();
    const newId = dbData.staff.length > 0 ? Math.max(...dbData.staff.map(s => s.id)) + 1 : 1;

    const newStaff = {
        ...req.body,
        id: newId,
        image: req.file ? req.file.filename : null
    };

    dbData.staff.push(newStaff);
   
    writeData(dbData);

    res.status(201).json({ message: "Staff added successfully", staff: newStaff });
});



mongoose.connect(process.env.MONGOURI).then(()=>{
    console.log("monges connected")
}).catch(err=>console.log(err))
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});