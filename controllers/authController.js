const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors');
const jwt = require('jsonwebtoken');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const register = async (req, res) => {
   const { email, name, password } = req.body;
    // check if email exist
   const emailAlreadyExists = await User.findOne({email});
   if(emailAlreadyExists){
        throw new CustomAPIError.BadRequestError('Email already exists')
   }
   
    //first registered user is an admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? 'admin' : 'user'
    
    const user = await User.create({name, email, password, role});

    const tokenUser = createTokenUser(user)

    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ user: tokenUser });

}

const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        throw new CustomAPIError.BadRequestError('Please add email and password');
    }

    const user = await User.findOne({ email });

    if(user && (await user.comparePassword(password))){
       
        const tokenUser = createTokenUser(user)
    
        attachCookiesToResponse({ res, user: tokenUser });
    
        res.status(StatusCodes.OK).json({ user: tokenUser });

    }else{
        throw new CustomAPIError.UnauthenticatedError('Invalid email or password')
    }

    // compare password
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(StatusCodes.OK).json({
        message: 'User Logged out successfully'
    })
}

module.exports = {
    register,
    login,
    logout,
};
  
