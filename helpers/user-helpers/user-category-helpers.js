const connection = require('../../config/connection')
const collection = require('../../config/collection')
const { ObjectID } = require('bson');
const { resolve, reject } = require('promise');

module.exports = {

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
     doFindCategoryItems : (categoryID) => {
        return new Promise(async(resolve,reject)=>{
           try {
             let category = await connection.get().collection(collection.PRODUCT_COLLECTION).find({
                categoryId : ObjectID(categoryID)
            }).toArray()
                resolve(category)
           } catch (err) {
                reject(err)
           }
        })
    },
    doFindCategory : (categoryID) => {
        return new Promise(async(resolve,reject) => {
            connection.get().collection(collection.CATEGORIES).findOne({
                _id : ObjectID(categoryID)
            }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })           
        })
    }

}