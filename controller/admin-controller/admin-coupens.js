const coupen_helpers = require('../../helpers/admin-helpers/admin-coupen-helpers')
const { ObjectID } = require('bson');
let coupenExist = null



exports.admin_add_coupen_get = (req,res) => {
    try {
        if(req.session.admin){
            coupen_helpers.existingCoupens().then((data)=>{
                res.render('add-coupen',{data , coupenExist})
            })
            
        }else{
            res.redirect('/login')
        }
    } catch (error) {
        res.redirect('/404')
    }
    
   
}
exports.admin_add_coupen_post = async(req,res) => {
    try {
        let coupen = await coupen_helpers.coupenExist(req.body)
    if(coupen){
        let status = true
        res.send(JSON.stringify(status));
    }else{
        req.body.coupenexpire = new Date(req.body.coupenexpire)
        coupen_helpers.add_coupen(req.body)
        res.redirect('/admin/add-coupen')
    }
    } catch (error) {
        res.redirect('/404')
    }
    
   
}

exports.admin_delete_coupen_post = (req,res) => {
    try {
        coupen_helpers.deleteCoupen(req.query.id)
    } catch (error) {
        res.redirect('/404')
    }
    
}













