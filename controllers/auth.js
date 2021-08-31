require('dotenv').config()
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js')

const hash = (password) =>{
  const first = crypto.createHmac('sha256', process.env.SECRET)
  .update(password)
  .digest('hex')
  .split('')
  .reverse()
  return crypto.createHmac('sha256', process.env.SECRET)
  .update(first)
  .digest('hex')
  .join('')
}
module.exports.hash = hash
const register(req,res)=>{
  const hashedPassword = hash(req.body.password);
  req.body.password = bcrypt.hashSync(hashedPassword,bcrypt.genSaltSync(10))
  try{
    const createdUser= await User.create(req.body)
    const token = jwt.sign({
      username: createdUser.username
    },SECRET)
    res.status(200).json({user:createdUser, token})
  }
  catch(err){
    console.error(err)
    res.status.400.json({msg:err.message})
  }
}

module.exports.register = register
