const express = require('express');
const sgMail = require('@sendgrid/mail')
const router = express.Router();
const config = require('../config/config');

sgMail.setApiKey(config.sendGridAPIKey);

router.post('/send', (req, res) => {
    const msg = {
        to: '97adarshvk@gmail.com',
        from: 'adarshvk98@gmail.com',
        subject: `Query from ${req.body.name ? req.body.name : 'Anonymous'}`,
        text: `${req.body.message}`,
        html: `<strong>
        Email Address :  ${req.body.email} <br><br>
        ${req.body.message}
        </strong>`,
    }
    sgMail
        .send(msg)
        .then(() => {
            const success = encodeURIComponent(`Your Query is successfully sended to our team. They will contact you soon !!`)
            return res.redirect('/contact?msg=' + success)
        })
        .catch((err) => {
            const error = encodeURIComponent(`Error on the sending mail. please try again`)
            return res.redirect('/contact?valid=' + error)
        })

});

module.exports = router;