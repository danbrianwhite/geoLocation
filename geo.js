var url = require('url');
var cookie = require('cookie');


var checkGeolocation = function () {

    var _sub = window.location.host.split('.');
    var _stamp = _sub.shift();
    var _redirect = '//' + _sub.join('.');

    navigator.geolocation.getCurrentPosition(
        function (position) {
            _redirect += '?stamp=' + _stamp + '&lat=' + position.coords.latitude + '&long=' + position.coords.longitude;
            window.location.replace(_redirect);
        },
        function (err) {
            _redirect += '?error=yes';
            window.location.replace(_redirect);
        }
    );

};
var _script = '(' + checkGeolocation.toString() + ')();';


var iFrame = function (callback, url) {
    var iframe = document.createElement('iframe');
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    var geoEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[geoEventMethod];
    var messageEvent = geoEventMethod == "attachEvent" ? "onmessage" : "message";

    var eventFunction = function (e) {
        document.body.removeChild(iframe);
        var geoRemoveEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
        var eventerRemove = window[geoRemoveEventMethod];
        eventerRemove(messageEvent, eventFunction);

        callback(e.data);
    };

    eventer(messageEvent, eventFunction, false);

};

var _iFrameFunction = iFrame.toString();

var _html = '<html><head><script>' + _script + '</script></head><body></body></html>';


var message = function (error, lat, long) {
    var _message = error ? {error: error} : {latitude: lat, longitude: long};
    parent.postMessage(_message, '*');
};

var _messageFunction = message.toString();


var geoLocation = function(srv)
{

    srv.addListener("request", function(req, res)
    {
        var cookies = req.headers.cookie;
        var cookieStamp = cookie.parse(cookies ? cookies : '').stamp;

        var _sub = req.headers.host.split('.');
        if (_sub.length > 1 && _sub[0].toLowerCase() === 'demo' && _sub[1].toLowerCase() === 'geo') {

            var _url = '//' + req.headers.host.replace('demo.geo', 'geo') + '/?script=geo';

            var _iframeHTML = '<html><head></head><body><button onclick="requestGeolocation()">Request GeoLocation</button><script src="' + _url + '"></script></body></html>';


            res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': _iframeHTML.length});
            res.end(_iframeHTML);
        }
        else if (_sub[0].toLowerCase() === 'geo') {

            var _querystring = url.parse(req.url, true).query;
            if (_querystring.script) {
                var _url = '//' + req.headers.host;
                var _script = 'var requestGeolocation = function(callback, url){callback = callback ? callback : function(message){alert(JSON.stringify(message));}; url = url ? url : "' + _url + '"; (' + _iFrameFunction + ')(callback, url)};';
                res.writeHead(200, {'Content-Type': 'application/javascript', 'Content-Length': _script.length});
                res.end(_script);
            }
            else if (_querystring.stamp && _querystring.lat && _querystring.long) {
                var _message = '<html><head></head><body><script>(' + _messageFunction + ')(null, ' + _querystring.lat + ',' + _querystring.long + ')</script></body></html>';
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Content-Length': _message.length,
                    'Set-Cookie': 'stamp=' + _querystring.stamp,
                });
                res.end(_message);
                console.log('latitude: ' + _querystring.lat + ' longitude: ' + _querystring.long);
            }
            else if (_querystring.error) {
                var _message = '<html><head></head><body><script>(' + _messageFunction + ')("error")</script></body></html>';
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Content-Length': _message.length,
                    'Set-Cookie': 'stamp=error',
                });
                res.end(_message);
                console.log('cancel/error');
            }
            else {
                var _geoDate = (cookieStamp && cookieStamp !== 'error') ? cookieStamp : Date.now().toString();

                var _redirect = '//' + _geoDate + '.' + req.headers.host;
                res.writeHead(302, {
                    'Location': _redirect
                });
                res.end();
            }


        }
        else if (_sub.length > 1 && _sub[0].toLowerCase() !== 'demo' && _sub[1].toLowerCase() === 'geo') {
            res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': _html.length});
            res.end(_html);
        }
    });

};


module.exports = function(srv)
{
    geoLocation(srv);
};