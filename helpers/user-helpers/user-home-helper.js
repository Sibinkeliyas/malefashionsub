const connection = require('../../config/connection')
const collection = require('../../config/collection')
const { ObjectID } = require('bson');
const moment = require('moment');
const { reject } = require('promise');

module.exports = {

     doFindWishList : (userID) => {
        return new Promise(async(resolve,reject)=>{
            connection.get().collection(collection.WISH_LIST).
                aggregate([
                    {
                        $match :
                        {
                            userID : ObjectID(userID)
                        }
                    },
                    {
                        $unwind : '$products'
                    }
                ]).toArray().then((data) => {
                    resolve(data)
                }).catch((err) => {
                    reject(err)
                })
        })
    },
     walletFind : (userID) => {
        return new Promise(async(resolve,reject) => {
            try {
                let wallet = await connection.get().collection(collection.WALLET).aggregate([
            {
              $match :
                {
                    userID : ObjectID(userID)
                }
            },
             {
                 $unwind : '$wallet'
            }
            ]).toArray()
            resolve(wallet)
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
     doFindBanners : () => {
        return new Promise(async(resolve,reject) => {
            try {
                let banner = await connection.get().collection(collection.BANNERS).aggregate([
             
                {
                    $unwind : '$images'
                }
            ]).toArray()
            resolve(banner)
            console.log(banner);
            } catch (err) {
                reject(err)
            }
        })
    },
     doFindAllproduct : () => {
        return new Promise(async(resolve,reject)=>{
            try {
                   let data = await connection.get().collection(collection.PRODUCT_COLLECTION).find({
                        date : {$gte :moment().subtract(7, 'days').calendar()}
                    }).toArray()
                    resolve(data)
            } catch (err) {
                reject(err)
            }
        })
    },
     doFindSingleWishList : (userID) => {
        return new Promise(async(resolve,reject)=>{   
            if(userID !=null){
                let wishList = await connection.get().collection(collection.WISH_LIST).aggregate([
                    {
                        $match : {userID : ObjectID(userID)}
                    },
                    {
                        $unwind : '$wish_list'
                    },
                    {
                        $project : {wishList : '$wish_list.item'}
                    },                                                  
                ]).toArray()   
                resolve(wishList)
             }else{
                resolve(null)
             }               
        })
    },
    searchProduct : (search) => {
       return new Promise(async(resolve,reject) => {
        connection.get().collection(collection.PRODUCT_COLLECTION).find({
            productName :  { $regex: '.*'+search+'.*', $options: 'i' }
          }).toArray().then((data) => {
              resolve(data)
          }).catch((err) => {
            reject(err)
          })
       })
        
    }
}