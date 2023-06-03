// requires
var connection = require('../../config/connection')
var collection = require('../../config/collection')
const { ObjectID } = require('bson');

module.exports = {

      allOrders : () => {
        return new Promise(async(resolve,reject)=>{
            try {
                let  all_orders = await  connection.get().collection(collection.ORDER_PAYMENT_COLLECTION)
                    .aggregate([
                        {
                            $lookup : 
                            {
                                from : collection.USER_COLLECTION,
                                localField : "userID",
                                foreignField : '_id',
                                as :'user'
                            }
                        },
                        {
                            $unwind : '$user'
                        }
                    ]).toArray()
                        resolve(all_orders)
            } catch (err) {
                reject((err))
            }
        })
    },
     doOrderDetails : (orderID) => {
        return new Promise(async(resolve,reject)=>{
         try {
            let orders = await  connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).
                aggregate([
                    { 
                        $match: {  _id : ObjectID(orderID)}            
                    },
                
                ]).toArray()
                resolve(orders)
         } catch (err) {
            reject((err))
         }
        })
    } ,
    
    cancelOrder : (orderID) => {
        return new Promise(async(resolve,reject)=>{
        connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).updateOne({
            _id : ObjectID(orderID)
        },{
            $set : {
                status : "cancel"
            }
        }).then((data)=>{
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })
    },
     acceptOrder : (orderID) => {
        return new Promise(async(resolve,reject)=>{
        connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).updateOne({
            _id : ObjectID(orderID)
        },{
            $set : {
                status : "placed"
            }
        }).then((data)=>{
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })
    },
    
    
     shippingOrder : (orderID) => {
        return new Promise(async(resolve,reject)=>{
        connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).updateOne({
            _id : ObjectID(orderID)
        },{
            $set : {
                status : "shipped"
            }
        }).then((data)=>{
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })
    },
    
     deliverOrder : (orderID) => {
        return new Promise(async(resolve,reject)=>{
        connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).updateOne({
            _id : ObjectID(orderID)
        },{
            $set : {
                status : "delivered"
            }
        }).then((data)=>{
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })
    }


}