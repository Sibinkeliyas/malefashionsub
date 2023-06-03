// requires
var connection = require('../../config/connection')
var collection = require('../../config/collection')
module.exports = {

    admin_signup : (adminData) => {
        return new Promise(async(resolve, reject) => {
            console.log(adminData);
            let user =await connection.get().collection(collection.ADMIN_LOGIN).findOne({email:adminData.email})
            if(!user) {
                connection.get().collection(collection.ADMIN_LOGIN).insertOne(adminData).then((data) => {
                    resolve(data)
                }).catch((err) => {
                    reject(err)
                })
            } else {
                reject('err')
            }
        })
    } ,

     admin_login : (adminData) => {
        return new Promise(async(resolve,reject)=>{
            try {
                let response = {}
            let user =await connection.get().collection(collection.ADMIN_LOGIN).findOne({email:adminData.email})
            if(user){ 
                if(user.password == adminData.password){
                    response.admin = user   
                    response.status = true 
                    resolve(response)
                }else{
                    resolve({status : false})
                }
            }else{
                resolve({emailStatus : true})
            }
            } catch (err) {
                reject(err)
            }
        })
    }




}