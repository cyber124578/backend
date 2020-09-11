// Import Express module 
const express = require('express');
// Import Router
const router = express.Router();
// Import User Module
const admins = require('../models/admin')
// cryptage password
const bcrypt = require('bcrypt');
// JWT plugin
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/user');
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + '-' + file.originalname )
  }
});
const upload = multer({storage: storage });
const methodOverride = require('method-override');


router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS,PUT"
  );
  next();
});
router.use(methodOverride('_method'));

router.post('/signup', upload.single('image'), (req, res) => {
    if(req.body.password==req.body.confirmPassword){
        bcrypt.hash(req.body.password, 10).then(
            hash => {
                console.log("Hash", hash);
              
    
        const admin = new admins({
    
            user: req.body.user,
            email: req.body.email,
            tel: req.body.tel,
            password: hash,
            confirmPassword:hash,
            image:  req.file.path,
    
        });
    
    
        admin.save()
            .then(
                result => {
                    
                    res.status(200).json({
                     message: "User added successfully"            
                     })
                }
            ).catch(
                err => {
                    console.log('error',err);
    
                    res.status(500).json({
                        error: err
                    })
                })
    });
    }
  
  
});
//token
  router.get('/adminToken', verifyToken, function(req,res,next){
    return res.status(200).json(decodedToken.token);
  })
  
  var decodedToken='';
  function verifyToken(req,res,next){
    let token = req.query.token;
  
    jwt.verify(token,'secret', function(err, tokendata){
      if(err){
        return res.status(400).json({message:' Unauthorized request'});
      }
      if(tokendata){
        decodedToken = tokendata;
        next();
      }
    })
  }

    //get routes starts here getall
router.get('/AllUtilisateur', (req, res) => {
    admins.find({})
        .then(utilisateur => {
            console.log(utilisateur);
            res.json(utilisateur);
          
        })
        .catch(err => {
            console.log('error_msg', 'ERROR: '+err);

        })

});
  
//get routes starts here
router.get('/GetAdmin/:id', (req, res) => {
  admins.findById({ _id: req.params.id })
      .then(administrateur => {
          console.log(administrateur);
          res.json(administrateur);
        
      })
      .catch(err => {
          console.log('error_msg', 'ERROR: '+err);

      })

});


router.delete("/deleteAdmin/:id", (req, res, next) => {
  admins.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});
//Login
//Login
router.post('/signin', (req, res) => {
  let getedUser;
  console.log(req.body);
  admins.findOne({ email: req.body.email }).then(
          user => {
            console.log('seeeeeeeeeeeeer', user);
              if (!user) {
                  res.status(401).json({
                      message: 'Email invalid'
                  })
                  return null;
              }
              getedUser = user;
              console.log("getted user", getedUser);

              return bcrypt.compare(req.body.password, getedUser.password);
          })
      .then(result => {
          if (!result) {
             
          }
          else{
            if(result === true){
          let token = jwt.sign({token:admins},'secret', {expiresIn : '1h'});
          console.log(token);
            return res.json(token);
            }else{
              return res.status(401).json({
                message: 'Password invalid'
            })
            }
        
        }
         //Email and password are valid
          //Generate Token
         // const token = jwt.sign({ email: getedUser.email, userId: getedUser._id }, 'secret_key', { expiresIn: '1h' });
          //console.log('this token', token);

       // res.status(200).json({
         //     message: "success Authentification",
           //   token: token
          //})
      })
      .catch(err => {
   console.log(err);
      })
});


//adminnew  

router.post("/Adminadd", upload.single('image'), (req, res, next) => {
  console.log(req.file);
  const admin = new admins({
            user: req.body.user,
            email: req.body.email,
            tel: req.body.tel,
            password: req.body.password,
            confirmPassword: req.body.password,
            image:  req.file.path,
    
  });
 
  
  

  admin.save().then(createdadmin => {
    res.status(201).json({
      message: "admin added successfully",
      postId: createdadmin._id
    });
 
  });
});


///end-of admin


// login etudiant
router.post('/LoginAdmin',(req, res) => {
  console.log(req.body.Email);
  admins.findOne({ Email: req.body.Email})
  .then(admins => {
    if(admins==null){
      return res.status(501).json({message:'User email is not registered.'})

    }else{
      verfpassword=bcrypt.compare(req.body.password, admins.password);
      if(verfpassword){ 
        let token = jwt.sign({token:admins},'secret', {expiresIn : '3h'});
      return res.status(200).json(token);
    }else{
      return res.status(401).json({
        message: 'Password invalid'
    })
    }
      

    // return res.json({token});
    }
     
  })
  .catch(err => {
      console.log('error_msg', 'ERROR: '+err);

  })
});
//end-of login etudiant
  
module.exports = router;