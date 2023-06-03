const connection = require('../../config/connection')
const collection = require('../../config/collection')
const { ObjectID } = require('bson');

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
     doMatchcategory : (userID,categoryID) => {
        return new Promise(async(resolve,reject)=>{
          try {
            let user = await connection.get().collection(collection.PRODUCT_COLLECTION).aggregate([
            {
              $match: { categoryId: ObjectID(categoryID) },
            },      
          ]).toArray()
            resolve(user) 
          } catch (err) {
            reject(err)
          }
        })
    }
    
    
    

}