// requires
var connection = require('../../config/connection')
var collection = require('../../config/collection')

module.exports = {

     all_orders : () => {
        return new Promise(async(resolve,reject) => {
            try {
                let orders = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).find().toArray()
                    resolve(orders)
            } catch (err) {
                    reject(err)
            }
        })
    }, 
     weekDiff : (days) => {
        return new Promise(async(resolve,reject) => {
           try {
             let sales = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).
                find( { 
                date: { $gte: days } } )
                .toArray()
                resolve(sales)
           } catch (err) {
                reject(err)
           }
        })
    },
     total_users : (days) => {
        return new Promise(async(resolve,reject) => {
           try {
                let all_users = await connection.get().collection(collection.USER_COLLECTION).find().toArray()
                    resolve(all_users)
           } catch (err) {
                reject(err)
           }
        })
    },
     activeusers : (status) => {
        return new Promise(async(resolve,reject) => {
           try {
                 let userCount = await connection.get().collection(collection.USER_COLLECTION).find({
                        loginStatus : status
                    }).count()
                        resolve(userCount)
           } catch (err) {
                reject(err)
           }
        })
    },
    
    users : (days) => {
        return new Promise(async(resolve,reject) => {
          try {
              let users = await connection.get().collection(collection.USER_COLLECTION).
                find( { 
                date: { $gte: days } } )
                .toArray()
                    resolve(users)
          } catch (err) {
            reject(err)
          }
        })
    },
     order_payment : (method) => {
        return new Promise(async(resolve,reject) => {
            try {
                let paymantMethod  = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).find({
                paymentmethod : method
                    }).count()
                    resolve(paymantMethod)
            } catch (err) {
                reject(err)
            }
        })
    },
     order_paymentDate : (days,method) => {
        return new Promise(async(resolve,reject) => {
            try {
                let paymantMethod  = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).find({
                status : 'delivered',
                paymentmethod : method,date : {$gte: days }
                }).count()
                resolve(paymantMethod)
            } catch (err) {
                reject(err)
            }
        })
    }, 
    ordersCount : () => {
        return new Promise(async(resolve,reject) => {
            try {
                let count = await connection.get().collection(collection.ORDER_PAYMENT_COLLECTION).find().count()
                    resolve(count)
            } catch (err) {
                reject(err)
            }
    
        })
    }
    
    
    

    

}
