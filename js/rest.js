exports.tryLogin  = tryLogin;
exports.restQuery = restQuery;

var http = require('http');

function restQuery(method, host, port, queryPath, queryData, callback) {
   var options = {
      'method':   method,
      'hostname': host,
      'port':     port,
      'path':     queryPath,
      'headers': {
         'Content-Type': 'application/x-www-form-urlencoded',
         // 'Content-Type': 'application/json',
         'Accept': 'application/json'
      },
   };

   var req = http.request(options, function(res) {
      // console.log(55555555);

      var responseData = '';
      res.setEncoding('utf8');
      res.on('error', (err)   => { callback({error: ['REST problem', err]}); });
      res.on('data',  (chunk) => { responseData += chunk; });
      res.on('end',   ()      => {

         // console.log(222222222222222, res.headers, responseData);

         try         { callback(JSON.parse(responseData)); } 
         catch (err) { callback({error: ['REST data problem: ', responseData, 'error:', err]});  }
      });
   });

   // console.log (1112344511111111, options, '', queryData);
   
   req.end(queryData, 'utf8');
}

// restQuery('POST', 'chat-nodejs.dev.gbksoft.net', 28781, '/rest/v1/user/login', 'username=pavlo&password=pavlo&remember_me=0', console.log);

// restQuery('POST', 'localhost', 28780, '/rest/v1/user/login', 'username=pavlo&password=pavlo', console.log);


function tryLogin(dataNum, proto, host, port, path_, path2, data, callback) {
   restQuery('POST', host, port, path_ + path2, data, (response) => {
      
      console.log ('!!! tryLogin (response): ', response)
      
      if (response.result) {
         if (response.result.token) {
            callback(dataNum, response.result.token);
            return;

         } else if (response.result.accessToken && response.result.accessToken.token) {
            callback(dataNum, response.result.accessToken.token);
            return;
         
         } 
      }      
      console.error('/tryLogin (response): ', response);
   });
}
