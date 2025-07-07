const Customer = require('../models/customer')
const bcrypt = require('bcrypt')
const{generateAccessToken,generateRefreshToken,verifyRefreshToken} = require('../service/auth')
const jwt = require('jsonwebtoken')

async function handleCreateNewCustomer(req,res) {
    const { fullName, email, password} = req.body;
    //hasing password
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = await Customer.create({
        fullName: fullName,
        email: email,
        password: hashedPassword,
      });
      return res.status(201).json({ msg: "Signup Successfully", id: result._id });
    } catch (error) {
      res.status(500).json({ error: "Please give unique values.", message: error.message });
    } 
}

async function handleLogin(req, res) {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email });
    console.log(customer);
    
    if (!customer) {
      return res.status(401).json({ msg: "invalid email" });
    }
    const isValidPassword = await bcrypt.compare(password, customer.password);
    console.log(isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ msg: "invalid password" });
    }
    const accessToken = generateAccessToken(customer);
    console.log(accessToken);
    
    const refreshToken = generateRefreshToken(customer);
    console.log(refreshToken);
    
    //send refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 10 * 60 * 1000, // 7 days
    });
    return res.status(200).json({
      accessToken,
      customer: {
        _id: customer._id,
        email: customer.email,
        role: customer.role,
        fullName: customer.fullName,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Something went wrong on the server",
        message: error.message,
      });
  }
}

async function handleRefreshToken(req,res) {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(401)
  try{
  const payload = verifyRefreshToken (refreshToken)
  const customer = await Customer.findById(payload._id)   
  if (!customer) return res.sendStatus(401);   

  const newAccessToken = generateAccessToken(customer)
  res.status(200).json({accessToken:newAccessToken})
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired refresh token" })
  }
  
}

async function  handleProtected(req, res) {
  //console.log(req.customer);
  
  res.json({ user:req.customer.fullName});
};

module.exports = { 
  handleCreateNewCustomer, 
  handleLogin,
  handleRefreshToken,
  handleProtected,
};