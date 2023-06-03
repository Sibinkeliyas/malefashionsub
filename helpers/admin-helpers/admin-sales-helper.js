// requires
var connection = require('../../config/connection')
var collection = require('../../config/collection')

module.exports = {

     orders : () => {
        return new Promise(async(resolve,reject) => {
            try {
                let order = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).aggregate([
                {
                    $lookup : {
                        from : collection.USER_COLLECTION,
                        localField : 'userID',
                        foreignField : '_id',
                        as:'user'
                    }
                },{
                    $unwind : '$user'
                }
            ]).toArray()
                resolve(order)
            } catch (err) {
                reject(err)
            }
        })
    },
    
    all_orders : () => {
        return new Promise(async(resolve,reject) => {
            try {
                let orders = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).find().toArray()
                    resolve(orders)
            } catch (err) {
                reject(err)
            }
        })
    }
        

}