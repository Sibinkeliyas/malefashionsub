const admin_login_helpers = require('../../helpers/admin-helpers/admin-login-helpers')



//........................................................ object converter ..............................................................................................

let emailStatus  = false
let passStatus = false



exports.admin_login_get = (req,res)=>{
    try {
        if(req.session.user){
            res.redirect('/')
        }else if(req.session.admin){
                res.redirect('/admin')
        }else{
            res.render('admin-login',{emailStatus,passStatus})
            emailStatus  = false
            passStatus = false
        }
    } catch (error) {
        res.redirect('/404')
    }
    
}


exports.admin_login_post = (req,res)=>{ 
    try {
        admin_login_helpers.admin_login(req.body).then((data)=>{
            if(data.status === true){
            req.session.admin = data.admin
            res.redirect('/admin/')
            }else if(data.emailStatus === true){         
                emailStatus = true
                res.redirect('/admin/login')
            }else if(data.status === false){
                passStatus = true
                res.redirect('/admin/login')
            }
            })
    } catch (error) {
        res.redirect('/404')
    }
    
}

exports.admin_signUp_get = ( req , res ) => {
    try {
        if(req.session.user){
            res.redirect('/')
        }else if(req.session.admin){
                res.redirect('/admin')
        }else{
            res.render('adminsignup',{emailStatus,passStatus})
            emailStatus  = false
            passStatus = false
        }
    } catch (err) {
        res.redirect('/404')
    }
}

exports.admin_signup_post = (req,res)=>{ 
    try {
        admin_login_helpers.admin_signup(req.body).then((data)=>{
            console.log(data);
            res.redirect('/admin/login')
            }).catch((err) => {
                res.redirect('/admin/sign-up')
            })
    } catch (error) {
        res.redirect('/404')
    }
    
}