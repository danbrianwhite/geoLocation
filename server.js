var http = require('http');
var geoLocation = require('./geo.js');

var app = http.createServer(handler);

function handler (req, res) {

    if(req.headers.host.split('.').length === 1)
    {
        debugger;
        res.statusCode = 302;
        res.setHeader("Location", "http://demo.geo.localhost:1337/");
        res.end();
    }


};


geoLocation(app);

app.listen((process.env.PORT || 1337));



console.log('Server running at on port ' + (process.env.PORT || 1337));