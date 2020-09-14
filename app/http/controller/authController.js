const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    return {
        login(req , res){
            res.render('auth/login')
        },
        postLogin(req,res,next){
            const { email, password } = req.body
            //validate equest 
            if(!email || !password) {
                req.flash('error','All fields required.!')
                return res.redirect('/login')
            }
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.logIn(user,(err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req,res,next)
        },
        register(req , res){
            res.render('auth/register')
        },
        async postRegister(req , res){
            const { name, email, password } = req.body
            //validate equest 
            if(!name || !email || !password) {
                req.flash('error','All fields required.!')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            // check if email exist
            User.exists({ email: email}, (err, result)=>{
                if(result){
                    req.flash('error','Email Allready taken')
                    req.flash('name',name)
                    req.flash('email',email)
                    return res.redirect('/register')
                }
            })
            //hash Password
            const hashPassword = await bcrypt.hash(password , 10)
            // Create User
            const user = new User({
                name,
                email,
                password:hashPassword
            })

            user.save().then((user)=>{
                // req.flash('success','Register Success .!')
                //Login
                req.logIn(user,(err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
                return res.redirect('/')
            }).catch(err => {
                console.log(err)
                req.flash('error','Something went wrong.!')
                return res.redirect('/register')
            })
        },
        logout(req,res){
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController