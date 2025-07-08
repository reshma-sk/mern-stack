const express = require('express')
const {authMiddleware} = require('../middleware/auth')

const{handleCreateNewCustomer,handleLogin,handleRefreshToken,handleProtected,renderResponse} = require('../controller/customer')
const router = express.Router()
router.get('/',renderResponse)
router.post('/',handleCreateNewCustomer)
router.get('/protected', authMiddleware,handleProtected)
router.post('/login',handleLogin)
router.post('/refresh-token',handleRefreshToken)
module.exports = router;
