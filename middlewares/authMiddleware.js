const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
let token;
if(req?.headers?.authorization?.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
    try{
         if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const findUser = await User.findById(decoded?.id)
            req.user = findUser
            console.log(decoded);
            next()
         }
    }
    catch (error){
    throw new Error("Not Authroized token expires, Please login again");
    }
}
else{
    throw new Error("there is not any token attached to header");
}
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    console.log(req.user);
    const adminuser = await User.findOne({ email });
    console.log("adminuser", adminuser.role);
    if (adminuser.role !== "Admin") {
      throw new Error("You are not an admin");
    } else {
      next();
    }
  }); 


module.exports = {authMiddleware, isAdmin}