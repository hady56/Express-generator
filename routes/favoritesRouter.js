
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const Favorites=require('../models/favorite');
const authenticate=require('../authenticate');
const cors = require('./cors');
const favoriteRouter=express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    Favorites.find({user:req.user._id}).populate('user', 'dishes')
    .then((favorites)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(favorites);
    },(err)=>next(err)).catch((err)=>next(err));
  })

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.find({user:req.user._id}).then((favorite)=>{
        if (favorite.toString()==''){
            Favorites.create({user:req.user._id});
         
        }
    
      for (v in req.body){
        Favorites.find({user:req.user._id,dishes:v._id}).then((favorite)=>{
            if (favorite.toString()==''){
               favorite.dishes.push(v._id);
                favorite.save();
            }
        })
      }
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json(favorite);
     
    },(err)=>next(err)).catch((err)=>next(err));
   })
   
 .put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
   res.statusCode=403;
   res.end('put operation is not supported on /favorites');
   })
   
 .delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
        Favorites.remove({user:req.user._id}).then((resp)=>{
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(resp);
        },(err)=>next(err)).catch((err)=>next(err));
   });

 favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
   res.end('get operation is not supported on /favorites '+req.params.dishId);
  })

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.find({user:req.user._id})
    .then((favorite)=>{
     if (favorite.toString()!=''){
        
    Favorites.find({user:req.user._id,dishes:req.params.dishId})
        .then((favorite)=>{
    if (favorite.toString()!=''){  
        Favorites.save({user:req.user._id,dishes:req.params.dishId}).then((favorite)=>{ 
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json(favorite);
    })
    }
      else{
        err=new Error('the dish '+req.params.dishId+' is already in your favorite list' );
        err.status=404;
        return next(err);
      }
    })
    }
    else{
        err=new Error('user '+req.user._id+' does not have favorites list');
        err.status=404;
        return next(err);
    }
     
    },(err)=>next(err)).catch((err)=>next(err));
   })
   
 .put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
   res.statusCode=403;
   res.end('put operation is not supported on /favorites');
   })
   
 .delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
        Favorites.remove({user:req.user._id,dishes:req.params.dishId}).then((resp)=>{
           
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(resp);
        },(err)=>next(err)).catch((err)=>next(err));
   });






   module.exports=favoriteRouter;