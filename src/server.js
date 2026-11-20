const express = require("express");
const helmet = require("helmet");
const path = require("path");
const db = require("./db");
const app = express();
const PORT = process.env.PORT || 3000;
const statuses = ["Active","Inactive","Graduated"];

app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"20kb"}));
app.use(express.static(path.join(__dirname,"..","public")));

function validate(b) {
 const s = {
  student_code:String(b.student_code||"").trim(),
  full_name:String(b.full_name||"").trim(),
  email:String(b.email||"").trim().toLowerCase(),
  phone:String(b.phone||"").trim(),
  course:String(b.course||"").trim(),
  enrollment_date:String(b.enrollment_date||"").trim(),
  status:String(b.status||"Active").trim()
 };
 if(!s.student_code || s.student_code.length>30) return "Student ID is required (max 30 characters).";
 if(!s.full_name || s.full_name.length>100) return "Full name is required (max 100 characters).";
 if(!/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(s.email)) return "Enter a valid email address.";
 if(s.phone.length>25) return "Phone must be 25 characters or fewer.";
 if(!s.course || s.course.length>100) return "Course is required (max 100 characters).";
 if(!/^\d{4}-\d{2}-\d{2}$/.test(s.enrollment_date) || Number.isNaN(Date.parse(s.enrollment_date))) return "Enter a valid enrollment date.";
 if(!statuses.includes(s.status)) return "Choose a valid status.";
 return s;
}
function dbError(e,res) {
 if(String(e.code).startsWith("SQLITE_CONSTRAINT")) return res.status(409).json({error:"Student ID or email already exists."});
 console.error(e); return res.status(500).json({error:"Unexpected server error."});
}
app.get("/api/health",(_q,r)=>r.json({status:"ok"}));
app.get("/api/students",(req,res)=>{
 const search=`%${String(req.query.search||"").trim()}%`, status=String(req.query.status||"");
 let rows;
 if(req.query.search && statuses.includes(status))
  rows=db.prepare("SELECT * FROM students WHERE (student_code LIKE ? OR full_name LIKE ? OR email LIKE ? OR course LIKE ?) AND status=? ORDER BY id DESC").all(search,search,search,search,status);
 else if(req.query.search)
  rows=db.prepare("SELECT * FROM students WHERE student_code LIKE ? OR full_name LIKE ? OR email LIKE ? OR course LIKE ? ORDER BY id DESC").all(search,search,search,search);
 else if(statuses.includes(status))
  rows=db.prepare("SELECT * FROM students WHERE status=? ORDER BY id DESC").all(status);
 else rows=db.prepare("SELECT * FROM students ORDER BY id DESC").all();
 res.json(rows);
});
app.get("/api/students/:id",(req,res)=>{
 const row=db.prepare("SELECT * FROM students WHERE id=?").get(Number(req.params.id));
 if(!row) return res.status(404).json({error:"Student not found."});
 res.json(row);
});
app.post("/api/students",(req,res)=>{
 const s=validate(req.body); if(typeof s==="string") return res.status(400).json({error:s});
 try {
  const info=db.prepare("INSERT INTO students(student_code,full_name,email,phone,course,enrollment_date,status) VALUES(@student_code,@full_name,@email,@phone,@course,@enrollment_date,@status)").run(s);
  res.status(201).json(db.prepare("SELECT * FROM students WHERE id=?").get(info.lastInsertRowid));
 } catch(e){dbError(e,res);}
});
app.put("/api/students/:id",(req,res)=>{
 const id=Number(req.params.id), s=validate(req.body);
 if(!Number.isInteger(id)||id<1) return res.status(400).json({error:"Invalid student ID."});
 if(typeof s==="string") return res.status(400).json({error:s});
 if(!db.prepare("SELECT id FROM students WHERE id=?").get(id)) return res.status(404).json({error:"Student not found."});
 try {
  db.prepare("UPDATE students SET student_code=@student_code,full_name=@full_name,email=@email,phone=@phone,course=@course,enrollment_date=@enrollment_date,status=@status,updated_at=CURRENT_TIMESTAMP WHERE id=@id").run({...s,id});
  res.json(db.prepare("SELECT * FROM students WHERE id=?").get(id));
 } catch(e){dbError(e,res);}
});
app.delete("/api/students/:id",(req,res)=>{
 const id=Number(req.params.id);
 if(!Number.isInteger(id)||id<1) return res.status(400).json({error:"Invalid student ID."});
 const info=db.prepare("DELETE FROM students WHERE id=?").run(id);
 if(!info.changes) return res.status(404).json({error:"Student not found."});
 res.json({message:"Student deleted."});
});
app.get("*",(_q,r)=>r.sendFile(path.join(__dirname,"..","public","index.html")));
app.listen(PORT,()=>console.log(`Student Management System: http://localhost:${PORT}`));
