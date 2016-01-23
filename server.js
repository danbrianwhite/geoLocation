var http = require('http');
var geoLocation = require('./geo.js');

var app = http.createServer(handler);

function handler (req, res) {

    var _hosts = req.headers.host.split('.');
    if(_hosts.length > 0 && _hosts[0] !== 'demo' && _hosts[0] !== 'geo' &&

        (isNaN(parseInt(_hosts[0])) || parseInt(_hosts[0]).toString().length !== _hosts[0].length)
    )
    {
        res.statusCode = 302;
        res.setHeader("Location", "http://demo.geo."+req.headers.host+"/");
        res.end();
    }


};


geoLocation(app);

app.listen((process.env.PORT || 1337));



console.log('Server running at on port ' + (process.env.PORT || 1337));