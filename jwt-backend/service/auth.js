const jwt = require('jsonwebtoken')
require ('dotenv').config();

function generateAccessToken (customer){
    return jwt.sign(
        {
            _id:customer._id,
            email:customer.email,
            name:customer.fullName,
            role:customer.role,
        },
        process.env.ACCESS_SECRET,
        {expiresIn:'5m'}
    )
}

function generateRefreshToken (customer)  {
  return jwt.sign(
    {
        _id: customer._id, 
        fullName: customer.fullName 
    },
    process.env.REFRESH_SECRET, // New env var
    { expiresIn: "10m" }
  );
};

function verifyRefreshToken (token) {
    const decode = jwt.verify(token,process.env.REFRESH_TOKEN)
    return decode;
}

function verifyAccessToken(token) {
    if (!token) return null;
    try {
      const decode =  jwt.verify(token, process.env.ACCESS_SECRET);
      return decode;
    } catch (err) {
      console.error("Invalid token:", err.message);
      return null;
    }
  }
module.exports={
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
}
    