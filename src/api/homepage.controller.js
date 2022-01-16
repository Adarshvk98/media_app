const express = require('express');
const router = express.Router();
const iplocate = require("node-iplocate");
const publicIp = require('public-ip');
const axios = require('axios');
const NewsListSchema = require('../models/newslist.model');

const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        try {
            publicIp.v4().then(ip => {
                iplocate(ip).then((results) => {
                    resolve(results.city);
                });
            });
        } catch (error) {
            reject(error)
        }
    })

}
const getWeatherReport = () => {
    return new Promise((resolve, reject) => {
        try {
            getUserLocation().then((cityName) => {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=19425eeb7123a1ca89567f7ab95fb18d`;
                axios.get(url)
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(err => {
                        reject(err)
                    });
            })
        } catch (error) {
            reject(error);
        }
    })
}

const getNewsList = () => {
    return new Promise((resolve, reject) => {
        NewsListSchema.find({})
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (err) reject(err)
                if (docs.length <= 4) {
                    resolve({
                        latestNews: docs,
                        newsList: []
                    });
                } else {
                    resolve({
                        latestNews: docs.slice(0, 5),
                        newsList: docs.slice(5)
                    })
                }
            });
    })

}

router.get('/', (req, res) => {
    getWeatherReport().then((report) => {
        getNewsList().then((docs) => {
            res.render('index', { weather: { ...report.main, location: report.name }, ...docs })
        })
    })

})

module.exports = router;

