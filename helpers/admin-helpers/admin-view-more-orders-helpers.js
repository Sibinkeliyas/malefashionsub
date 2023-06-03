// requires
var connection = require('../../config/connection')
var collection = require('../../config/collection')


module.exports = {

     doUserdetails :  () => {
        return new Promise(async(resolve,reject)=>{
            connection.get().collection(collection.USER_COLLECTION).find().sort(({arragingdate : -1})).toArray((err,data)=>{
            if(err) reject(err)
            else{
            resolve(data)
            }
            })
        })
    }

}
