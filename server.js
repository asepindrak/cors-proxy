var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express()
require('dotenv').config()
var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '100kb'
console.log('Using limit: ', myLimit)

app.use(bodyParser.json({ limit: myLimit }))

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE")
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'))

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send()
    } else {
        var targetURL = process.env.URL
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' })
            return
        }

        let headers = null
        let json = null
        if (req.header('Authorization')) {
            headers = {
                'Authorization': req.header('Authorization')
            }
        }
        if (req.body) {
            json = req.body
        }
        request({ url: targetURL + req.url, method: req.method, json, headers },
            function (error, response, body) {
                if (error) {
                    console.log(error)
                    console.error('error: ' + response?.statusCode)
                }
                // console.log(body)
            }).pipe(res)
    }
})

app.set('port', process.env.PORT || 3050)

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port') + ' with targetURL ' + process.env.URL)
})