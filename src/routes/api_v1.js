const { Express } = require('express');

const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./../database.js').get();

// create router instance
const router = express.Router();

/**
 * Router | POST /user/auth
 * this route is getting to receive user data and then make new access token send back to client
 */
router.post('/user/auth', (req, res) => {
    if('username' in req.body && 'password' in req.body) {
        // user request data
        let username = req.body.username.trim();
        let password = req.body.password.trim();

        // get sql data
        db.get(`SELECT id, password FROM users WHERE username = ?`, [username], (error, row) => {
            if(error) { // cannot request database
                return res.json({
                    type: 'error',
                    msg: 'ไม่สามารถติดต่อฐานข้อมูลได้'
                });
            }

            // compare between encrypted password and raw password
            let comparePassword = bcrypt.compareSync(password, row.password);
            if(comparePassword) {
                // generate new token by crypto module
                let token = crypto.randomBytes(12).toString('hex');
                db.run(`UPDATE users SET access_token = ? WHERE id = ?`, [token, row.id], (error) => {
                    if(error) {
                        res.json({
                            type: 'failed',
                            msg: 'ไม่สามารถติดต่อฐานข้อมูลได้'
                        });
                    } else {
                        res.json({
                            type: 'success',
                            msg: 'ระบบได้ทำการสร้างรหัสในการเข้าสู่ระบบให้คุณเรียบร้อยแล้ว',
                            access_token: token
                        });
                    }
                });
            } else {
                res.json({
                    type: 'failed',
                    msg: 'ไม่พบบัญชีผู้ใช้งานที่คุณต้องการ'
                });
            }
        });
    } else {
        res.json({
            type: 'failed',
            msg: 'คุณต้องส่ง Parameters username และ password ในการร้องขอการเชื่อมต่อครั้งนี้!'
        });
    }
});

/**
 * 
 * @param {Express} app 
 */
module.exports = (app) => app.use('/api/v1', router);