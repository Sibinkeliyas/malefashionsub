const brand_helpers = require('../../helpers/admin-helpers/admin-brand-helpers')
const { ObjectID } = require('bson');

exports.admin_add_brands_get = (req,res) => {
    if(req.session.admin){
        res.render('add-brands')
    }else{
        res.redirect('/login')
    }
   
}

exports.admin_add_brands_post = (req,res) => {
    try{
        brand_helpers.add_brand(req.body)
    } catch{
        res.redirect('/404')
    }
   
}


exports.admin_display_brands_get = async(req,res) => {
    try{
        if(req.session.admin){
            let data = await brand_helpers.all_brands()
            res.render('display-brandes',{data})
        }
    } catch{
        res.redirect('/404')
    }
    
   
}











