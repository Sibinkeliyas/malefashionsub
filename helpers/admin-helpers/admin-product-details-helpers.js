// requires
var connection = require('../../config/connection')
var collection = require('../../config/collection')
const { ObjectID } = require('bson');

module.exports = {

    
   doProductmanagement : () => {
    return new Promise(async(resolve,reject)=>{
        connection.get().collection(collection.PRODUCT_COLLECTION).find().sort({arragingdate : -1}).toArray((err,data)=>{
        if(err) reject(err)
        else{
        resolve(data)
        }
        })
    })
}

}