const connection = require('../../config/connection')
const collection = require('../../config/collection')
const { ObjectID } = require('bson');
const { productID } = require('../../controller/user-controller/user-check-out');
const { resolve, reject } = require('promise');

module.exports = {

     doAddWishList : (productID,userID) => {
        let status
        let productObject = {
            item:ObjectID(productID)
        }
        return new Promise(async(resolve,reject)=>{
            let wishlist =await connection.get().collection(collection.WISH_LIST).findOne({userID : ObjectID(userID) })
            if(wishlist){
                let wishlistCheck = wishlist.products.findIndex((product) => product.item == productID )
                if(wishlistCheck != -1){
                    connection.get().collection(collection.WISH_LIST).updateOne({userID :ObjectID(userID),'products.item' : ObjectID(productID)},
                    {$pull : { products: {item : ObjectID(productID)}}}).then((data) => {
                        resolve({status : "delete"})
                    })
                }else {
                    connection.get().collection(collection.WISH_LIST).updateOne({userID :ObjectID(userID)},
                    {$push : 
                        {products : productObject }
                    }).then((data) => {
                        resolve({status : "add"})
                    }).catch((err) => {
                        reject(err)
                    })
                }
                
                
            }else{
                let userwishlist = {
                    userID : ObjectID(userID),
                    products :[productObject]
                }
                connection.get().collection(collection.WISH_LIST).insertOne(userwishlist).then((data)=>{
                    resolve({status : "add"})
                }).catch((err) => {
                    reject(err)
                })
            }
        })
    
    },
      doFindWishList : (userID) => {
        return new Promise(async(resolve,reject)=>{
          try {
            let wishlist = await connection.get().collection(collection.WISH_LIST).
           aggregate([
                    { 
                        $match: {  userID : ObjectID(userID)}            
                    },
                    {
                        $unwind : '$products'
                    },
                    {
                        $project : 
                       { item : '$products.item'
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
                            item : 1,products : {$arrayElemAt : ['$products',0]}
                        }
                    }
                  
              ]).toArray()
            resolve(wishlist)
          } catch (err) {
            reject(err)
          }
        })
    },
    deleteWishList : (userID,productID) => {
        return new Promise(async(resolve,reject) => {
            connection.get().collection(collection.WISH_LIST).deleteOne({
                userID : ObjectID(userID)
            },
            {
                $pull : { products: {item : ObjectID(productID)} }
            }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    doRemoveWishList : (userID,productID) => {
      
let status
        let productObject = {
            item:ObjectID(productID)
        }
        return new Promise(async(resolve,reject)=>{
            let wishlist =await connection.get().collection(collection.WISH_LIST).findOne({userID : ObjectID(userID) })
            
            if(wishlist){
                let wishlistCheck = wishlist.products.findIndex((product) => product.item == productID )
                if(wishlistCheck != -1){
                    connection.get().collection(collection.WISH_LIST).updateOne({userID :ObjectID(userID),'products.item' : ObjectID(productID)},
                    {$pull : { products: {item : ObjectID(productID)}}}).then((data) => {
                        resolve({status : "delete"})
                    }).catch((err) => {
                        reject(err)
                    })
                }else {
                    
                    connection.get().collection(collection.WISH_LIST).updateOne({userID :ObjectID(userID)},
                    {$push : 
                        {products : productObject }
                    }).then((data) => {
                        resolve({status : "add"})
                    }).catch((err) => {
                        reject(err)
                    })
                }
                
                
            }
        })
    }

}