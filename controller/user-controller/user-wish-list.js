const cartCount = require('../user-controller/user-check-out')
const wallet = require('../user-controller/user-home')
const user_wish_list_helper = require('../../helpers/user-helpers/user-wish-list-helper')


 //........................................................global variable .........................................................................................




 exports.user_add_wish_list_post = (req,res)=>{
  try{
    if(req.session.user){
      user_wish_list_helper.doAddWishList(req.query.id,req.session.user._id).then((status)=>{    
          res.json({status})    
      })
  }else{
      res.redirect('/login')
  }
  } catch{
    res.redirect('/404')
  }
   
 }

 exports.user_wish_list_get = async(req,res)=>{
    try{
      if(req.session.user){
        let count = cartCount.cart
        var profileStatus; 
        profileStatus = true    
        let wallets = wallet.wallets
        user_wish_list_helper.doFindWishList(req.session.user._id).then((data)=>{
          res.render('wish-list',{ data,profileStatus,Name: req.session.user,count,wallets })
        })
        }else{
          profileStatus = false
          res.redirect('/login')
        }
    } catch (err){
      console.log(err);
      res.redirect('/404')
    }
   
 }

 exports.user_wish_list_delete_post = (req,res)=>{
  try{
    user_wish_list_helper.doRemoveWishList(req.session.user._id,req.query.id).then((status) => {
      res.json ({status})
    })
  } catch{
    res.redirect('/404')
  }
    
 }

