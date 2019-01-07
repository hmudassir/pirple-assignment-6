var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var cluster = require('cluster');

var config = require('./config');

var httpServer = http.createServer(function(req, res){

    if(cluster.isMaster){
        var parsedUrl = url.parse(req.url, true);
        var path = parsedUrl.pathname;
        var trimedPath = path.replace(/^\/+|\/+$/g, '');
        var queryStringObj = parsedUrl.query;
        var method = req.method.toLocaleLowerCase();
        var headers = req.headers;
        var decoder = new StringDecoder('utf-8');
        var buffer = '';
        req.on('data', function(data){
            buffer += decoder.write(data);
        });
        req.on('end', function(){
            buffer += decoder.end();

            var chosenHandler = typeof(router[trimedPath]) != 'undefined' ? router[trimedPath] : handlers.notFound;

            var data = {
                'trimedPath': trimedPath,
                'queryStringObj': queryStringObj,
                'method': method,
                'headers': headers,
                'payload': buffer
            };
            chosenHandler(data, function(statusCode, payload){
                statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
                payload = typeof(payload) == 'object' ? payload : {};
                var payloadString = JSON.stringify(payload);
                // To return response as json
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(statusCode);
                res.end(payloadString);
            });
        }); 
    }

});

httpServer.listen(config.httpPort, function(){
    console.log("server started at==>>", config.httpPort);
});

//request route handler
var handlers = {};

// /hello request handler
handlers.hello = function(data, callback){

    //To send data with status 200
    callback(200, {'assignment_number': 'Assignment 6', 'message': 'Welcome For Assignments under Node Learning course by Priple.'});
}

//handler Not Found
handlers.notFound = function(data, callback){
    callback(404);
}

//request router
var router = {
    'hello': handlers.hello
};