// requires
var connection = require('../../config/connection')
var collection = require('../../config/collection')
const { ObjectID } = require('bson');

module.exports = {

     doFindCategory : () => {
        return new Promise(async(resolve,reject)=>{
            connection.get().collection(collection.CATEGORIES).find().toArray((err,data)=>{
                if(err) {
                    reject(err)
                } else {
                    resolve(data)
                }
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
     doFindSingleCategory : (categoryID) => {
        return new Promise(async(resolve,reject)=>{
            try {
                let user = await connection.get().collection(collection.CATEGORIES).findOne({_id :categoryID})
                resolve(user)
            } catch (err) {
                reject(err)
            }
        })
    },
     doUpdateProduct : (productID,productData) => {
        return new Promise(async(resolve,reject)=>{
            connection.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id : ObjectID(productID)},
            {$set : {image1 : productData.image1,image2 : productData.image2,image3 : productData.image3,
                categories : productData.categories,
                 productName : productData.productName,brand : productData.brand,
                 price:productData.price,offerPrice :productData.offerPrice, description : productData.description}}).then((data) => {
                    resolve(data)
                 }).catch((err) => {
                    reject(err)
                 })
        })
    }
    
    

}