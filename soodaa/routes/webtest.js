var express = require('express');
var router = express.Router();
var gcm = require('../etc/gcm');
var async = require('async');
var logger = require('../etc/logger');
var crypto = require('../etc/crypto');
var picture = require('../etc/picture');
var facebook = require('../etc/facebook');


router.get('/', function (req, res) {

    res.render('webtest/index')
})

router.get('/test', function(req, res) {
    //var list = [
    //    {
    //        name: 'song'
    //    },
    //    {
    //        name: 'kim'
    //    },
    //    {
    //        name: 'tim'
    //    }
    //]


    var data = [
        {
            name: 'name1',
            url: 'http://52.68.92.194/images/uploads/review/review_2015-06-17_soodaa_1434545599_1434545730277-thumbnail.jpg',
            product: 'product1'
        },
        {
            name: 'name2',
            url: 'http://52.68.92.194/images/uploads/review/review_2015-06-17_soodaa_1434545599_1434545730277-thumbnail.jpg',
            product: 'product2'
        },
        {
            name: 'name3',
            url: 'http://52.68.92.194/images/uploads/review/review_2015-06-17_soodaa_1434545599_1434545730277-thumbnail.jpg',
            product: 'product3'
        },
        {
            name: 'name4',
            url: 'http://52.68.92.194/images/uploads/review/review_2015-06-17_soodaa_1434545599_1434545730277-thumbnail.jpg',
            product: 'product4'
        },

    ]
    res.json(data);
});




module.exports = router;