const { json } = require('express');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwttocken');
const { validateMongoDbId } = require('../utils/validatemongoid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');

// register an user
const createUser = asyncHandler(async (req, res) => {

    const email = req.body.email;
    const findUser = await User.findOne({email: email});

    if(!findUser){
        const newUser = await User.create(req.body);
        res.json(newUser);
        console.log("userCreated");
      } 
    else{
        throw new Error("User Already Exits")
    }
  });

// login an user
  const loginUserCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const findUser = await User.findOne({email})
    if(findUser && (await findUser.isPasswordMatched(password))){

      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateRefreshToken = await User.findByIdAndUpdate(findUser.id, {
        refreshToken : refreshToken
      },
      {
        new: true
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 70 * 60 * 60 * 1000
      });

      res.json({
        _id : findUser?._id,
        firstname : findUser?.firstname,
        lastname : findUser?.lastname,
        mobile:findUser?.mobile,
        email:findUser?.email,
        token: generateToken(findUser?._id)
      });
    }
    else{
      throw new Error("Invalid Credentials")
    }
  });

// refresh Token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    console.log(cookie);
    if(!cookie?.refreshToken) throw new Error("no refresh Token in Cookies");
    const refreshToken = cookie.refreshToken
    // console.log("refreshToken 2", refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error("no referesh token is present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if(err || user.id !== decoded.id){
        throw new Error("Therer is something wrong with refresh token")
      }
      const accessToken = generateRefreshToken(user?._id);
      res.json({accessToken});
    })
});

// logout feauture

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true
    });
    return res.sendStatus(204);
  }

  console.log("User is found");
  
  await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: "" });
  
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true
  });

  return res.sendStatus(204);
});


// fetch an All users
const getAllUsers = asyncHandler(async (req, res) => {
  try{
  const getusers = await User.find()
  res.json({getusers})
  }
  catch{
    throw new Error(error);
  }
});

// fetch an single user by id
const getuser = asyncHandler(async (req, res) => {
  try{
    const {id} = req.params
    validateMongoDbId(id);
  const singleuser = await User.findById(id)
  res.json({singleuser})
  }
  catch{
    throw new Error(error);
  }
});

// update an single user by id
const updateUser = asyncHandler(async (req, res) => {
  console.log("update is working");
  try{
    const {id} = req.params
    validateMongoDbId(id);
  const singleuser = await User.findByIdAndUpdate(id, {
    firstname : req?.body?.firstname,
    lastname : req?.body?.lastname,
    mobile: req?.body?.mobile,
    email: req?.body?.email,
  },
  {
    new: true,
  })
  res.json({singleuser})
  }
  catch{
    throw new Error(error);
  }
});

// delete an single user by id
const deluser = asyncHandler(async (req, res) => {
  try{
    const {id} = req.params
    validateMongoDbId(id);
  const deleteuser = await User.findByIdAndDelete(id)
  res.json({deleteuser})
  }
  catch{
    throw new Error(error);
  }
})

// block user
const block_user = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDbId(id);
  try{
    const blockuser = await User.findByIdAndUpdate(id, {
      isBlocked :true
    },
    {
    new: true
  }
  );
  res.json({"user" :"Blocked"});
  }
  catch(error){
    throw new Error(error)
  }
});

// unblock user
const unblock_user = asyncHandler(async (req, res) => {
const {id} =  req.params
validateMongoDbId(id);
  try{
    const unblockuser = await User.findByIdAndUpdate(id, {
      isBlocked :false
    },
    {
    new: true
  }
  )
  res.json({"user" :"unBlocked"});
  }
  catch(error){
    throw new Error(error)
  }
});


const updatePassword = asyncHandler(async (req, res) => {
  console.log("updatePassword is working");

  const {_id} = req.user
  const {password} = req.body
  validateMongoDbId(_id)

  const user = await User.findById(_id);
  if(password){
    user.password = password
    const updatePassword = await user.save()
    res.json(updatePassword);
  }else{
    res.json(user)
  }
})

module.exports = {createUser, loginUserCtrl, getAllUsers, getuser, deluser, updateUser, block_user, unblock_user, handleRefreshToken, logout, updatePassword};