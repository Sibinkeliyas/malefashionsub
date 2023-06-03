const { ObjectID } = require('bson')
const wallet = require('../user-controller/user-home')
const user_cart_helpers = require('../../helpers/user-helpers/user-cart-helpers')

 //........................................................global variable .........................................................................................


 var profileStatus;
 var totalPriceStatus
 let coupentotalPrice = 0
 let totalPrice = 0

 exports.user_add_to_cart_get = (req,res)=>{
  try{
    var productId = req.query.id
    if(req.session.user){
      user_cart_helpers.doAddCart(productId, req.session.user._id)
        res.json({status : true})
     
    }else{
      res.redirect('/login')
    }
  }catch{
    res.redirect('/404')
  }
   
 }


 exports.user_cart_get = async(req,res)=>{
  try{
    let count
    if(req.session.user ){ 
     count  =await user_cart_helpers.docartProductCount(req.session.user._id)
      profileStatus = true
      var cartData
       totalPrice = await user_cart_helpers.doTotalAmount(req.session.user._id)
       totalPrice = parseInt(totalPrice) - parseInt(coupentotalPrice)
       exports.totalPrice = totalPrice 
       let data = await user_cart_helpers.doFindCartItem(req.session.user._id)
          cartData = true   
          if(data.length < 1){
            cartData = false
            totalPriceStatus = false
          } else{
            totalPriceStatus = true
          }
          let wallets = wallet.wallets
          res.render('shopping-cart', {data,cartData,totalPrice,totalPriceStatus,Name: req.session.user,profileStatus,count,wallets})      
          coupentotalPrice = 0
    }else{
      req.session.returnTo = req.originalUrl
      res.redirect('/login')
    }
  }catch{
    res.redirect('/404')
  }
   
 }

 exports.user_cart_post  = async(req,res) => {
  try{
    const nowDate = new Date()
    let coupenPrice = await user_cart_helpers.checkingCoupen(req.body.coupen,req.body.date)
    if(coupenPrice != null){
        let coupenRepeate = await  user_cart_helpers.coupenRepeates(req.session.user._id,req.body.coupen)
        if(coupenRepeate.length > 0){
          exports.coupenPrice = 0
            res.json({status : true})
        }else{
            if(parseInt(totalPrice) <= parseInt(coupenPrice.coupenminimum)){
              exports.coupenPrice = 0
                res.json({coupenstatus : true})
            }
           else if(parseInt(totalPrice) >= parseInt(coupenPrice.coupenmaximum)){
            exports.coupenPrice = 0
              res.json({coupenmaximastatus : true})
          }
            else if(nowDate > coupenPrice.coupenexpire){
              exports.coupenPrice = 0
                res.json({coupencoupenexpire : true})
            }else{
                coupentotalPrice = coupenPrice.coupenOffer
                exports.coupen = req.body.coupen
                exports.coupenPrice = coupentotalPrice
                res.json({coupentotalPrice})
            }
           
        }
    }else{
        res.json({status : false})
    }
  } catch{
    res.redirect('/404')
  }
   
 }

 exports.user_cart_increase_get = (req,res)=>{
  try{
    var id = ObjectID(req.query.id)
    user_cart_helpers.doincreaseCart(id,req.session.user._id,parseInt(req.query.quantity))
  }catch{
    res.redirect('/404')
  }
    
 }

 exports.user_cart_decrease_get = (req,res)=>{
  try{
    var id = ObjectID(req.query.id)
    user_cart_helpers.doDecreaseCart(id,req.session.user._id,parseInt(req.query.quantity))
  } catch{
    res.redirect('/404')
  }
    
 }

 exports.user_cart_delete_get = (req,res)=>{
  try{
    var id = req.query.id
    user_cart_helpers.doDeleteCart(id,req.session.user._id).then((data)=>{
     })
  }catch{
    res.redirect('/404')
  }
    
 }

