const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config({path: './.env'})

const app = express();
app.use(cors());
app.use(express.json());

// db connection variables 
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST ,
  user: process.env.DATABASE_USER,  
  password: process.env.DATABASE_PASS,  
  database: process.env.DATABASE 
})
// checking db connection 
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database!');
  }
});


app.get('/', (req , res) =>{
    return res.json("Backend is working");
})

// handle signup
app.post('/signup',(req , res) =>{

    const { username, email, password } = req.body;
    

    if (!username || !email || !password) {
        return res.json({ 
            success : false ,
            message: 'All Feilds are required '
         });
    }else{
        try {
            const checkQuery = 'SELECT * FROM users WHERE email = ?';
            db.query(checkQuery , [email] , async (err,results) =>{
                if(err){
                   return res.json({ 
                    success : false ,
                    message: 'Error in checking DB '
                    }); 
                }else{
                    if(results.length > 0 ){
                        return res.json({ 
                        success : false ,
                        message: 'Email Already Exist '
                    }); 
                    }else{
                        const hashedPass = await bcrypt.hash(password ,10) ;
                        const currentTime = new Date();
                        const query = 'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)';
                        db.query(query, [username, email, hashedPass, currentTime], (err, result) => {
                            if(err){
                                console.error("Error inserting data:", err);
                                return res.json({
                                success: false,
                                message: "Error saving data.",
                                });
                            }else{
                                console.error("succes in  data:", err);
                                
                                // sessionStorage.setItem("key", "value");
                                return res.json({
                                success: true,
                                message: "Saved data Successfully.",
                                });
                            }   
                        });
                    }

                }

            })


            
        } catch (error) {
            
        }
    }
})
// handle login 
app.post('/login', (req , res) =>{
    const {  email, password } = req.body;
    if(!email || !password){
        return res.json({ 
            success : false ,
            message: 'All Feilds are required'
        });
    }else{
        try {
            const checkQuery = 'SELECT * FROM users WHERE email = ?';
            db.query(checkQuery , [email] , async (err, results) =>{
                if(err){
                    return res.json({ 
                        success : false ,
                        message: 'Error in checking DB'
                    });
                }else{
                    if(!results.length > 0){
                        return res.json({ 
                            success : false ,
                            message: 'Email is not registered'
                        });
                    }else{
                        
                        const user = results[0]
                        const isMatch = await bcrypt.compare(password , user.password)
                        if(!isMatch){
                            return res.json({ 
                                success : false ,
                                message: 'Invalid Credentials'
                            });
                        }else{

                            const userInfo = {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                isLoggedIn: true,
                                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)

                            }   
                            const jwtToken = jwt.sign(userInfo , process.env.SECRET_KEY)
                                
                            
                           return res.json({ 
                                success : true ,
                                message: 'Success',
                                token : jwtToken,
                            }); 
                        }
                    }
                }
            })
        } catch (error) {
            
        }
    }

    
})
// get userData 
app.get('/getUser', (req , res) =>{

    const authentication = req.headers['authorization'];
    // console.log(authentication);
    if(!authentication || !authentication.startsWith('Bearer ')){
        return res.json({
            success: false,
            message: "No Token Provided"
        })
    }else{
        
  const token = authentication.split(" ")[1];
  try{
    const decoded = jwt.verify(token , process.env.SECRET_KEY);
    return res.json({
        success:true,
        message: "User Decoded",
        user:decoded
    })
    }catch(error){
        return res.json({
        success:false,
        message: "Invalid Token",
        })
    }
    }
    
    
})
// handle logout 
app.get('/logout', (req , res) =>{
    localStorage.removeItem("token");
    return res.json({
        success: true,
        message: "Logged out successfully"
    });
})

// ------------------------------------------handeling todo page------------------------------------------- 
// handle add todo 
app.post('/addTodo', (req , res) =>{
    const {todo_heading,
        todo_desc,
        todo_deadline,
        todo_userId,} = req.body;

        console.log(todo_heading);
        console.log(todo_desc);
        console.log(todo_deadline);
        console.log(todo_userId);
        
        if(!todo_heading || !todo_desc || !todo_deadline || !todo_userId){
            return res.json({ 
                success:false,
                message:"All fields are required"
            });
        }
        if(todo_deadline){
            const givenDate = new Date(todo_deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (givenDate < today) {
              return res.json({ 
                success:false,
                message:"Date is in the past"
              });  
            }
        }
        
            // const status = "remaining"
            const today = new Date();
            const query = "INSERT INTO todos(heading, description, deadline, userId, created_at) VALUES (?,?,?,?,?)";
    
    db.query(query, [todo_heading, todo_desc, todo_deadline, todo_userId, today], (err, results) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.json({ 
                success: false, 
                message: "Error saving data." 
            });
        } else {
            console.log("Success in inserting todo data");
            return res.json({ 
                success: true, 
                message: "Todo was saved successfully!" 
            });
        }
    });
        
})
// get all todo's of user 
app.get("/getAllTodos", (req,res)=>{
    const userid  = req.headers['userid'];
    if(userid){
        query = `SELECT * FROM todos WHERE userId = ? AND status = 'remaining' ORDER BY deadline ASC `
        db.query(query , [userid] , (err,result) =>{
            if(err){
               return res.json({
                success:false,
                message:"Error in getting query"
                }) 
            }else{
                if(result.length > 0){
                    return res.json({
                     success:true,
                     message:"User recieved success",
                     todoList : result
                     })  
                }else{
                    return res.json({
                     success:true,
                     message:"No todo found",
                     todoList : result
                     }) 
                }
            }
        })

        // res.json({
        //     success:true,
        //     message:"userId is found"
        // })
    }else{
        return res.json({
            success:false,
            message:"userId not found"
        })
    }
    
})
app.get("/getDoneTodos", (req,res)=>{
    const userid  = req.headers['userid'];
    if(userid){
        query = `SELECT * FROM todos WHERE userId = ? AND status = 'done' ORDER BY deadline ASC`
        db.query(query , [userid] , (err,result) =>{
            if(err){
               return res.json({
                success:false,
                message:"Error in getting query"
                }) 
            }else{
                if(result.length > 0){
                    return res.json({
                     success:true,
                     message:"User recieved success",
                     doneTodoList : result
                     }) 
                }else{
                    return res.json({
                     success:true,
                     message:"No todo found",
                     doneTodoList : result
                    }) 
                }
            }
        })

        // res.json({
        //     success:true,
        //     message:"userId is found"
        // })
    }else{
        return res.json({
            success:false,
            message:"userId not found"
        })
    }
    
})
// handle when todo is done  
app.post("/handleTaskDone" , (req,res)=>{
    const {todo_id} = req.body;

    if (todo_id) {
        const query = "UPDATE todos SET status = 'done'  WHERE id = ?"
        db.query(query , [todo_id] , (err ,result)=>{
            if(err){
               return res.json({
                success:false,
                message:"Error in getting query"
                }) 
            }else{
                return res.json({
                    success:true,
                    message:"Todo status is done success",
                    
                })  
            }
        })
    } else {
        return res.json({
            success:false,
            message:"TODO id is not Found"
        })
    }
})
app.post("/handleTaskDelete" , (req,res)=>{
    const {todo_id} = req.body;

    if (todo_id) {
        const query = "DELETE FROM `todos` WHERE id = ?"
        db.query(query , [todo_id] , (err ,result)=>{
            if(err){
               return res.json({
                success:false,
                message:"Error in getting query"
                }) 
            }else{
                return res.json({
                    success:true,
                    message:"Todo is deleted",
                    
                })  
            }
        })
    } else {
        return res.json({
            success:false,
            message:"TODO id is not Found"
        })
    }
})



const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});