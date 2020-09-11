const express = require('express');
const router = express.Router();
const categorys = require('../models/categorys');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/category');
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

//add categorys
router.post("/Categoryadd", upload.single('url'), (req, res, next) => {
    console.log(req.file);
 
    const Category = new categorys({
        nom:  req.body.nom,
        image:  req.file.path,
        description:  req.body.description,
      
    });
  
    Category.save().then(createdCategorys=> {
      res.status(201).json({
        message: "Post added categorys successfully",
        postId: createdCategorys._id
      });
    });
  });
  //end-of categorys 
  //get routes getallCategory
router.get('/getallCategory', (req, res) => {
    categorys.find({})
      .then(category => {
        console.log(category);
        res.json(category);
  
      })
      .catch(err => {
        console.log('error_msg', 'ERROR: ' + err);
  
      })
  
  });
  //get routes  getallCategory
  //  deleteCategory
router.delete("/deleteCategory/:id",(req, res, next) => {
    categorys.findByIdAndDelete( req.params.id ).then(result => {
   

    //categorys.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result.image);
      const path = result.image;

      fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return
        }
      
        //file removed
      })
      res.status(200).json({ message: "category deleted!" });
    });
  });
  //end- of delet
  //get routes by id  Category
router.get('/Getcategory/:id', (req, res) => {
    const category=categorys.findById({ _id: req.params.id });
    categorys.findById({ _id: req.params.id })
      .then(category => {
        console.log(category.image);
        res.json(category);
  
      })
      .catch(err => {
        console.log('error_msg', 'ERROR: ' + err);
  
      })
  
  });
  //get routes by id  category
  //put routes by id 
router.put('/Updatecategory/:id',upload.single('url'), (req, res) => {
  console.log(req.file);

  const Category = {
        nom:  req.body.nom,
        image:  req.file.path,
        description:  req.body.description,
      
    }
    categorys.findByIdAndUpdate(req.params.id, Category).then(result => {
    console.log(result.image);

    const path = result.image;

    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
        return
      }
    
      //file removed
    })

    });

   // categorys.findByIdAndUpdate(req.params.id).then(result => {
     // console.log(result);
      //res.status(200).json({ message: "update category" });
    //});
   // Category.updateOne({ _id: req.params.id},Category, function (err, Category) {
     // if (err) return console.log('error_msg', 'ERROR: ' + err);
  
      res.json(Category);
    //});
  });
  //put routes by id  category
  
  module.exports = router;