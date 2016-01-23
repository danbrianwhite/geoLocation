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

app.listen(1337);



console.log('Server running at http://localhost:1337/');
console.log('Demo at http://demo.geo.localhost:1337/');