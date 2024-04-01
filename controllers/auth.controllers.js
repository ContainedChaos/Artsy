const User = require("../dataModels/User.model");
const resettoken = require("../dataModels/resettoken.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer=require('nodemailer');
var crypto = require('crypto');

const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect("/error");
    }
    // const accessToken = req.body.access_token;

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      console.log("Login Request Received");
      console.log("Session:", req.session);
      res.redirect("/welcome");
    });
  })(req, res, next);
};

const getRegister = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "register.html");
  res.sendFile(filePath);
};

const postRegister = async (req, res, next) => {
  const { email, password } = req.body;
  const name = req.body.username;

  console.log(name);
  console.log(email);
  console.log(password);

  const errors = [];

  // Email validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Invalid email address!");
  }

  // Password validation using regex
  // Requires at least 8 characters, at least one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    errors.push("Invalid password! It must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one number.");
  }

  if (!name || !email || !password) {
    errors.push("All fields are required!");
  }

  if (errors.length > 0) {
    res.status(400).json({ error: errors });
  } else {
    // Create New User
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("User already exists with this email!");
        res.status(400).json({ error: errors });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            errors.push(err);
            res.status(400).json({ error: errors });
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                errors.push(err);
                res.status(400).json({ error: errors });
              } else {
                const newUser = new User({
                  name,
                  email,
                  password: hash,
                });
                newUser
                  .save()
                  .then(() => {
                    res.redirect("/login");
                  })
                  .catch(() => {
                    errors.push("Please try again");
                    res.status(400).json({ error: errors });
                  });
              }
            });
          }
        });
      }
    });
  }
};

const getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    // Additional logic or response can be added here if needed
    res.redirect('/login'); // Redirect to the home page or any other desired route
  });
};


var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    
  });

const getForgotPass = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "forgotpassword.html");
  res.sendFile(filePath);
};

const forgotpassword = async(req, res) => {
    // console.log(req.body)

    const {email} = req.body;

    try {
        const userfind = await User.findOne({email:email});

        console.log(process.env.FROM_EMAIL)

        // const userToken = await resettoken.findOne({ userId: userfind._id });
        //     if (userToken) await userToken.remove();

        const otp = crypto.randomBytes(2).toString("hex");
        const rtoken = new resettoken({ userId: userfind._id, token: otp});
        const setusertoken = await rtoken.save();

        console.log("here")

        if(setusertoken){
            const mailOptions = {
                from: '"Team Artsy" <teamartsy@gmail.com>',
                to:email,
                subject:"Password Reset",
                html:`<h2>Please use this OTP to reset your password</h2>
                <h1>${otp}</h1>`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("error",error);
                    res.send({message:"Could not send email"})
                }else{
                    console.log("Email sent",info.response);
                    res.redirect("/passreset")
                }
            })

        }

    } catch (error) {
        res.send({message:"Invalid user"})
    }
};

const getPassReset = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "passreset.html");
  res.sendFile(filePath);
};

const passreset = async(req,res)=>{

    const {otp, password} = req.body;

    try {
        const validtoken = await resettoken.findOne({token: otp});
        
        const validuser = await User.findOne({_id: validtoken.userId})

        if(validuser && validtoken){
            const newpassword = await bcrypt.hash(password,10);

            // const setnewuserpass = await User.updateOne({_id:validuser._id},{password:newpassword});
            await User.updateOne({_id: validuser._id}, {$set: {password: newpassword}})

            // setnewuserpass.save();
            res.send({message:"Password has been reset"})

        }else{
            res.send({message:"User does not exist"})
        }
    } catch (error) {
        res.send({error})
    }
}


module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  getLogout,
  forgotpassword,
  getForgotPass,
  getPassReset,
  passreset,
};
