const express = require("express");
const router = express.Router();
const Users=require('../models/users');
const multer=require('multer');
const fs = require("fs");


//image upload

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, "./uploads")
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
    storage:storage
})

router.post('/add',upload.single('image'),(req,res)=>{
    const user = new Users({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename
    });
    user.save()
    .then(()=>{
         req.flash('success', 'User Added Successfully')
         res.redirect('/');
    })
        .catch((err)=>{
            res.json({message:err.message, type:'danger'});
        })
      
})


router.get("/", (req, res) => {
   Users.find().exec((err,users) =>{
     if(err){
        res.json({message: err.message});
     }else{
        res.render('index', {     
        title:"Home Page",
         users:users
        });
     }
   })
   });

router.get("/add", (req, res) => {
    res.render('add_users', {title:"Add Users"});
});


//edit

router.get("/edit/:id",(req, res)=>{
   let id = req.params.id;
   Users.findById(id, (err, user)=>{
    if(err){
        res.redirect('/');
    }else{
        if(user == null){
            res.redirect('/');
        }else{
            res.render('edit_users',{
                 title:'Edit User', 
                 user:user,
                })
            }
        }
    })
});
        
//update
router.post('/update/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let new_image = "";

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_image= req.body.old_image;
    }
      Users.findByIdAndUpdate(id, {
        name:req.body.name,
        email:req.body.email,
        phone: req.body.phone,
        image:new_image,
      }, (err, result)=>{
      if(err){
        res.json({message:err.message, type:'danger'});
      }else{
        req.flash('success', 'User Updated Successfully');
        res.redirect("/");
    }
})
})

router.get('/delete/:id', (req, res) =>{
    let id=req.params.id;
    Users.findByIdAndRemove(id, (err, result) =>{
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/' + result.image);
            }catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({ message:err.message});
        }else{
            req.flash('success', 'User deleted Successfully');
            res.redirect("/");
        }
})
})
   

module.exports =  router ;

