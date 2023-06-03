const connection = require('../../config/connection')
const collection = require('../../config/collection')
const { ObjectID } = require('bson');
const moment = require('moment');
const coupen = require('../../controller/user-controller/user-cart')


module.exports = {

      doFindCartItem : (userID) => {
        return new Promise(async(resolve,reject)=>{
          try {
            let cart = await connection.get().collection(collection.CART).
           aggregate([
                    { 
                        $match: {  userId : ObjectID(userID)}            
                    },
                    {
                        $unwind : '$products'
                    },
                    {
                        $project : 
                       { item : '$products.item',
                       quantity : '$products.quantity'
                        }
                  
                    },
                    {
                        $lookup : {
                            from : collection.PRODUCT_COLLECTION, 
                            localField : 'item',
                            foreignField : '_id',
                            as:'products'
                        }
                    },
                    {
                        $project : {
                            item : 1,quantity : 1,products : {$arrayElemAt : ['$products',0]}
                        }
                    }
                  
              ]).toArray()
            resolve(cart)
          } catch (err) {
            reject(err)
          }
        })
    },
     doTotalAmount : (userID) => {
        return new Promise(async(resolve,reject)=>{
            connection.get().collection(collection.CART).
            aggregate([
                     { 
                         $match: {  userId : ObjectID(userID)}            
                     },
                     {
                         $unwind : '$products'
                     },
                     {
                         $project : 
                        { item : '$products.item',
                        quantity : '$products.quantity'
                         }
                   
                     },
                     {
                         $lookup : {
                             from : collection.PRODUCT_COLLECTION,
                             localField : 'item',
                             foreignField : '_id',
                             as:'products'
                         }
                     },
                     {
                         $project : {
                             item : 1,quantity : 1,products : {$arrayElemAt : ['$products',0]}
                         }
                     }
               ]).toArray().then((data)=>{
                let amount  = 0
                for(var i = 0 ; i < data.length ; i++){
                    if(data[i].products.offerPrice == data[i].products.price && data[i].products.categoryOffer == null || data[i].products.offerPrice == data[i].products.price && data[i].products.categoryOffer == 0 ){
                        amount = parseInt(amount) + ((parseInt(data[i].quantity) * parseInt(data[i].products.price)))
                    }
                    else{
                        if(data[i].products.offerPrice > data[i].products.categoryOffer){
                            amount = parseInt(amount) + ((parseInt(data[i].quantity) * parseInt(data[i].products.categoryOffer)))
                           
                        }else if(data[i].products.offerPrice < data[i].products.categoryOffer){
                            amount = parseInt(amount) + ((parseInt(data[i].quantity) * parseInt(data[i].products.offerPrice)))
                        }else if(data[i].products.categoryOffer == null){
                            
                        }
                    }
                 
                }
                 resolve(amount)
               }).catch((err) => {
                reject(err)
               })
             
         })
 
        },
         paymentAddress : (addresID,user) => {
            return new Promise(async(resolve,reject)=>{
              try {
                  let address =await connection.get().collection(collection.ADDRESS_COLLECTION).aggregate([
                    {
                        $match : 
                        {
                            userID : ObjectID(user)
                        }
                    },
                    {
                        $unwind : '$userAddress'
                    },
                    {
                        $match :
                        {    
                         'userAddress._id' : ObjectID(addresID)
                        }
                    },
                    {
                        $unwind : '$userAddress'
                    },
                ]).toArray()
                resolve(address[0])
              } catch (err) {
                reject(err)
              }
            })
        },
         findpaymentAddress : (addresID,userID) => {
            return new Promise(async(resolve,reject)=>{
              try {
                 let address = await connection.get().collection(collection.ADDRESS_COLLECTION).
                    findOne({userID: ObjectID(userID),'userAddress._id' :ObjectID(addresID)})
                        resolve(address)
              } catch (err) {
                reject(err)
              }
            })
        },
        
     doAddressFind : (userID) => {
        return new Promise(async(resolve,reject)=>{
            connection.get().collection(collection.ADDRESS_COLLECTION).findOne({userID : ObjectID(userID)}).then((data)=>{
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
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
     doSelectedAddressFind : (userID,addresID) => {
        return new Promise(async(resolve,reject)=>{
            connection.get().collection(collection.ADDRESS_COLLECTION).aggregate([
                {
                    $match : {userID : ObjectID(userID)}
                },
                {
                    $unwind : '$userAddress'
                },
                {
                    $project : {
                        userAddress : 1
                    }
                },
                {
                    $match : {'userAddress._id' : ObjectID(addresID)}
                }
            ]).toArray().then((data)=>{
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    
     getCartList : (userID) => {
        return new Promise(async(resolve,reject)=>{
            try {
                let cart = await connection.get().collection(collection.CART).aggregate([
                {
                    $match : 
                    {
                        userId : ObjectID(userID)
                    }
                },{
                    $unwind : '$products'
                },
                {
                 $project : {'products.item' : 1,'products.quantity' : 1}
                },
                

                {
                    $lookup : {
                        from : collection.PRODUCT_COLLECTION,
                        localField : 'products.item',
                        foreignField : '_id',
                        as:'products'
                    }
                },
                {
                    $unwind : '$products'
                },
                {
                    $project : {products : 1,quantity : 1}
                }
            ]).toArray()
                resolve(cart)
            } catch (error) {
                reject(err)
            }
        })
    },
     getCartquantity : (userID) => {
        return new Promise(async(resolve,reject)=>{
           try {
            let quantity = await connection.get().collection(collection.CART).
            aggregate([
                {
                    $match : 
                    {
                        userId : ObjectID(userID)
                    }
                },{
                    $unwind : '$products'
                },{
                    $project :{quantity : '$products.quantity',item : '$products.item'}
                },{
                    $unwind : '$quantity'
                }
           ]).toArray()
            resolve(quantity)
           } catch (err) {
            reject(err)
           }
        })
    },
     placeOrder : (order,products,totalPrize,productsQuantity,userID) => {
        try {
            for(i=0;i< products.length ; i++){
            products[i].products.itemquantity = productsQuantity[i].quantity
        }
        let total = {
            total : totalPrize
        }
        let totalPrice = [total]
        return new Promise(async(resolve,reject)=>{
            let status
            if(order.payment === 'cod' || order.payment === 'wallet'){
                status = "placed"
            }else{
                status = "pending"
            }
        
        let orderObj = {
            deliveryDetails : {
                name :  order.firstName+ order.lastName,
                mobile : order.mobile,
                address : order.address,
                pincode : order.pinCode,

            },
            userID : ObjectID(order.userID),
            paymentmethod : order.payment,
            products : products,
            totalPrice : totalPrice, 
            date :  moment().format('L'),
            deliveryDate : moment().add(7, 'days').calendar() ,
            status : status,
            arragingdate : moment().format()
        }
        connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).insertOne(orderObj).then((data)=>{
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
        
        // ....................quantity decreasing...........................//
        quantitydecrease(productsQuantity)
        // ....................adding user into coupen.......................//
        if(coupen.coupen != undefined){
            addUser(userID,coupen.coupen)
        }
        // ....................adding user into coupen........................//
        connection.get().collection(collection.CART).deleteOne
        ({
            userId : ObjectID(order.userID)})
          
        })
        } catch (err) {
            reject(err)
        }

    },   
     doViewItem : (productID) => {
        return new Promise(async(resolve,reject)=>{
            try {
                let product =  await connection.get().collection(collection.PRODUCT_COLLECTION).findOne({_id : productID})
                    resolve(product)
            } catch (err) {
                reject(err)
            }
            })
    },
     SingleplaceOrder : (order,products,totalPrice,productsQuantity) => {
     
        return new Promise(async(resolve,reject)=>{
         let status = order.payment==='cod'?'peding':'pending'
         let orderObj = {
             deliveryDetails : {
                 name :  order.address.firstName+ order.address.lastName,
                 mobile : order.address.mobile,
                 address : order.address.address,
                 pincode : order.address.pincode,
 
             },
             userID : ObjectID(order.userID),
             paymentmethod : order.payment,
             products : products,
             totalPrice : totalPrice, 
             date : moment().format('L'),
             status : status
         }
         connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).insertOne(orderObj).then((data)=>{
             resolve(data)
         }).catch((err) => {
            reject(err)
         })
         
           
         })
 
     },
  
    
    

     doFindproduct : (productID) => {
        return new Promise(async(resolve,reject)=>{
           try {
            let user = await connection.get().collection(collection.PRODUCT_COLLECTION).findOne({_id : productID})
                resolve(user)
           } catch (err) {
            reject(err)
           }
           
        })
    },
    docartTotalAmount : (userID) => {
        return new Promise(async(resolve,reject)=>{
            connection.get().collection(collection.CART).
            aggregate([
                    { 
                        $match: {  userId : ObjectID(userID)}            
                    },
                    {
                        $unwind : '$products'
                    },
                    {
                        $project : 
                        { item : '$products.item',
                        quantity : '$products.quantity'
                        }
                
                    },
                    {
                        $lookup : {
                            from : collection.PRODUCT_COLLECTION,
                            localField : 'item',
                            foreignField : '_id',
                            as:'products'
                        }
                    },
                    {
                        $project : {
                            item : 1,quantity : 1,products : {$arrayElemAt : ['$products',0]}
                        }
                    },
            ]).toArray().then((data)=>{
                let amount  = 0
                for(var i = 0 ; i < data.length ; i++){
                    if(data[i].products.offerPrice == data[i].products.price &&  data[i].products.categoryOffer == 0 ){
                        amount = parseInt(amount) + ((parseInt(data[i].quantity) * parseInt(data[i].products.price)))
                    }
                    else{
                        if( data[i].products.categoryOffer == 0){
                            amount = parseInt(amount) + ((parseInt(data[i].quantity) * parseInt(data[i].products.offerPrice)))
                        }
                        else if(data[i].products.offerPrice > data[i].products.categoryOffer){
                            amount = parseInt(amount) + ((parseInt(data[i].quantity) * parseInt(data[i].products.categoryOffer)))
                        
                        }else if(data[i].products.offerPrice < data[i].products.categoryOffer){
                            amount = parseInt(amount) + ((parseInt(data[i].quantity) * parseInt(data[i].products.offerPrice)))
                        }else if(data[i].products.categoryOffer == null || data[i].products.categoryOffer == 0){
                            amount = parseInt(amount) + ((parseInt(data[i].quantity) * parseInt(data[i].products.offerPrice)))
                        }
                    }
                
                }
                resolve(amount)
                }).catch((err) => {
                    reject(err)
                })
            
        })

        }

}

function quantitydecrease  (productsQuantity) {
    try {
        for(i = 0 ; i  < productsQuantity.length ; i ++){
         connection.get().collection(collection.PRODUCT_COLLECTION).updateOne({
            _id : productsQuantity[i].item
        },
        {
            $inc : {'quantity' : -productsQuantity[i].quantity}
        })
    }
    } catch (err) {
        
    }
}

function addUser  (userID,coupen) {
    let userIDs = {
        userID : ObjectID(userID)
    }
   
    return new Promise(async(resolve,reject) => {
        connection.get().collection(collection.COUPENS).updateOne({
            coupenName : coupen
        },{
            $push : {userID :userIDs}
        }).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })
}