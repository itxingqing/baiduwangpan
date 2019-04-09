var httpserver = require("http");
var qs = require("querystring");
var url = require("url");
var fs = require("fs");
const bdp = require('./lib/baidupan');

httpserver.createServer(onRequest).listen(9900);

function onRequest(request,response)
{
    var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received.");

    if(pathname=="/") {
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("index.html","utf-8",function(e,data){
			
            response.write(data);
            response.end();
        });
    }else if(pathname=="/queryAction"){
		var urlstr = "";
		var baiduCode = "";
		var baiduUrl = "";
        request.addListener("data",function(postdata){
            urlstr+=postdata; 
            var jsondata = qs.parse(urlstr);      
			baiduUrl = jsondata.baiduUrl;
        });
		
        request.addListener("end",function(){
            bdp.getPanKey(baiduUrl).then((d) => {
				if (d.status) {
					
					 response.writeHead(200,{"Content-Type":"text/html"});
		   		 var html =  '<!DOCTYPE html>'+
                '<html>'+
			'<head>'+
			'<meta charset="UTF-8">'+
			'<title>Insert title here</title></head><body>'+
			'<form id="baidu_form" action="queryAction" method="post">'+
			'百度网盘共享地址：<input type="text" name="baiduUrl" size = "100"/>密码：<input type="text" value="'+(d.access_code)+'"/>'+
		        '<input type="submit" value="查询"/>'+
		        '</form>' +
		        '</body></html>';
			    response.end(html);
				}
				 
				
			}).catch(err => console.log(err.message.magenta));
			
        });
    }else {
        response.writeHead(200,{"Content-Type":"text/plain"});
        response.write("error");
        response.end();
    }
}

