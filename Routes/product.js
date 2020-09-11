const express = require('express');
const router = express.Router();
const products = require('../models/products');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/products');
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
router.post("/productsadd", upload.single('url'), (req, res, next) => {
    console.log(req.file);
   
    
  
    const product = new products({
        nom:  req.body.nom,
        category: req.body.category,
        image:  req.file.path,
        description:  req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        CodeaBarres: req.body.CodeaBarres
    });
  
    product.save().then(createdproducts=> {
      res.status(201).json({
        message: "Post added categorys successfully",
        postId: createdproducts._id
      });
    });
  });
  //end-of categorys 
  //get routes getallCategory
router.get('/getallproducts', (req, res) => {
    products.find({})
      .then(product => {
        console.log(product);
        res.json(product);
  
      })
      .catch(err => {
        console.log('error_msg', 'ERROR: ' + err);
  
      })
  
  });
  //get routes  getallCategory
  //  deleteCategory
router.delete("/deleteproduct/:id",(req, res, next) => {
    products.findByIdAndDelete( req.params.id ).then(result => {
   

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
      res.status(200).json({ message: "product deleted!" });
    });
  });
  //end- of delet
  //get routes by id  Category
router.get('/Getcategory/:id', (req, res) => {
    products.findById({ _id: req.params.id })
      .then(product => {
        console.log(product.image);
        res.json(product);
  
      })
      .catch(err => {
        console.log('error_msg', 'ERROR: ' + err);
  
      })
  
  });
  //get routes by id  category
  //put routes by id 
router.put('/Updateproduct/:id',upload.single('url'), (req, res) => {
  console.log(req.file);

  const product ={
    nom:  req.body.nom,
    category: req.body.category,
    image:  req.file.path,
    description:  req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    CodeaBarres: req.body.CodeaBarres
      
    };
    products.findByIdAndUpdate(req.params.id, product).then(result => {
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
  
      res.json(product);
    //});
  });
  //put routes by id  category
  
  module.exports = router;
