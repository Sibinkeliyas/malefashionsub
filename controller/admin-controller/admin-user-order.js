const order_helpers = require('../../helpers/admin-helpers/admin-user-orders-helpers')
const { ObjectID } = require('bson');

exports.admin_user_orders_get = async(req,res)=>{
  try {
    let all_orders = await order_helpers.allOrders()
    res.render('user-orders',{all_orders})
  } catch (error) {
    res.redirect('/404')
  }
    
}


exports.admin_user_order_details_get = async(req,res)=>{
  try {
    let orders = await order_helpers.doOrderDetails(req.query.id)
    res.render('view-more',{orders})
  } catch (error) {
    res.redirect('/404')
  }
    
}

exports.admin_user_order_cancel_post = (req,res)=>{
  try {
    order_helpers.cancelOrder(req.query.id).then((data)=>{
      if(data != null){
        res.json({status : true})
      }
    })
  } catch (error) {
    res.redirect('/404')
  }
    
}

exports.admin_user_order_accept_post = (req,res)=>{
  try {
    order_helpers.acceptOrder(req.query.id).then((data)=>{
      if(data != null){
        res.json({status : true})
      }
    })
  } catch (error) {
    res.redirect('/404')
  }
    
}

exports.admin_user_order_shipping_post = (req,res)=>{
  try {
    order_helpers.shippingOrder(req.query.id).then((data)=>{
      if(data != null){
        res.json({status : true})
      }
    })
  } catch (error) {
    res.redirect('/404')
  }
    
}

exports.admin_user_order_delivery_post = (req,res)=>{
  try {
    order_helpers.deliverOrder(req.query.id).then((data)=>{
      if(data != null){
        res.json({status : true})
      }
    })
  } catch (error) {
    res.redirect('/404')
  }
    
}











