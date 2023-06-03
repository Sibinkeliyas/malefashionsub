const connection = require('../../config/connection')
const collection = require('../../config/collection')
const { ObjectID } = require('bson');

module.exports = {

     doFindOrderedProduct : (productID,orderID) => {
        return new Promise(async(resolve,reject)=>{
            try {
                let orders = await  connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).
                    aggregate([
                        { 
                            $match: {  _id : ObjectID(orderID)}            
                        },
                        {
                            $unwind : '$products'
                        },
                        { 
                            $match: {  'products.item' : ObjectID(productID)}            
                        },
                        {
                            $lookup : 
                            {
                                from : collection.PRODUCT_COLLECTION, 
                                localField : 'products.item',
                                foreignField : '_id',
                                as:'orders'
                            }   
                        },{
                            $unwind : '$orders'
                        }
                    ]).toArray()
                    resolve(orders)
            } catch (err) {
                reject(err)
            }
        })
    },
     doOrderCount : (userID) => {
        return new Promise(async(resolve,reject)=>{
           try {
            let count = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).find({userID : ObjectID(userID)}).count()
            resolve(count)
           } catch (err) {
            reject(err)
           }
        })
    },
    
    docartProductCount : (userID) => {
        return new Promise(async(resolve,reject)=>{
            try {
                let count = 0
            let cart = await connection.get().collection(collection.CART).findOne({
                userId :ObjectID (userID)})
            if(cart){
                count = cart.products.length
                resolve(count)
            }else{
                resolve(0)
            }
            } catch (err) {
                reject(err)
            }
        })
    },
    doOrderDetails : (userID) => {
        return new Promise(async(resolve,reject)=>{
        try {
            let orders = await  connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).
        find({userID : ObjectID(userID)}).sort({arragingdate : -1}).toArray()
        resolve(orders)
        } catch (err) {
            reject(err)
        }
        })
    },
     doFindorderQuantity : (orderID) => {
        return new Promise(async(resolve,reject) => {
            try {
                let orders = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION)
            .aggregate([
                    {
                        $match : 
                        { 
                            _id : ObjectID(orderID)
                        }
                    },
                    {
                        $unwind : '$products'
                    },
                    { 
                        $project : 
                        {
                        
                            'products.products.itemquantity' : 1,'products.products._id' : 1
                          
                        }
                }
                ]).toArray()
                    resolve(orders)
            } catch (err) {
                reject(err)
            }
        })
    },
     paymentMethod : (orderID) => {
        return new Promise(async(resolve,reject) => {
            try {
                let orderStatus = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).findOne({
                _id : ObjectID(orderID)
            })
                resolve(orderStatus)
            } catch (err) {
                reject(err)
            }
        })
    },
     updateOrder : (orderID,productsQuantity,status) => {
        return new Promise(async(resolve,reject)=>{
        connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).
        updateOne({
            _id : ObjectID(orderID)
        },{
            $set : {
                status : status
            }
        }).then((data)=>{
            quantityIncreasing(productsQuantity)
            resolve(data)
        }).catch(err => {
            reject(err)
        })
           
    })
    },
     totalAmount : (orderID) => {
        return new Promise(async(resolve,reject) => {
            try {
                let total = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).aggregate(
                    [
                        {
                            $match :
                            {
                                _id : ObjectID(orderID)
                            }
                        },
                        {
                            $unwind : '$totalPrice'
                        },
                        {
                            $unwind : '$products'
                        },
                       
                    ]
            ).toArray()
            resolve(total)
            } catch (err) {
                reject(err)
            }
        })
    },
    addTowallet : (amount,userID) => {
       return new Promise(async(resolve,reject) => {
           let Wallet = {
               wallet : amount.wallet,
               walletHistory : amount.walletHistory
           }
          
           let wallets = {
               wallet :[ Wallet],
               userID : ObjectID(userID)
           }
           let user = await connection.get().collection(collection.WALLET).findOne({
               userID : ObjectID(userID)
           })
   
   
           if(user){
               let wallet = {
                   wallet : amount.wallet,
                   walletHistory : amount.walletHistory
               }
               connection.get().collection(collection.WALLET).updateOne(
                   {
                       userID : ObjectID(userID)
                   },
                   {
                       $push : 
                       {
                           wallet : wallet
                       }
                   }
               ).then((data) => {
                resolve(data)
               }).catch((err) => {
                resolve(reject)
               })
           }else{
               connection.get().collection(collection.WALLET).insertOne(wallets).then((data) => {
                   resolve(data)
           }).catch((err) => {
            reject(err)
           })
       }
   
       })
   
   
   }
}

function quantityIncreasing  (productsQuantity)  {
    let quantity
    for(i=0;i<productsQuantity.length;i++){
         connection.get().collection(collection.PRODUCT_COLLECTION).updateOne({
            _id : productsQuantity[i].products.products._id
        },
        {
            $inc : {quantity :  productsQuantity[i].products.products.itemquantity}
        })
    }
    }