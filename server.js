//read me
//RUN hello.js in TERMINAL 
//RUN [launch.json]'s["url"] word in bowser 

const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const Port = 1025;
const Ip = "127.0.0.1";

const sendResponse = (filename,statusCode,response) => {
    fs.readFile(`./html/${filename}.html`,(error,data)=>{
        if (error) {
            console.log("1");
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end("Sorry internal error");
        } else {
            console.log("2");
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "text/html");
            response.end(data);
        }
    });
};

const server = http.createServer((request,response)=>{
    //console.log(request.url,request.method);
    const method = request.method;
    let url = request.url;
    //const urlpathName = request.url.urlpathName;

    if(method === "GET"){
        const requestUrl = new URL(url,`http://${Ip}:${Port}`);
        url = requestUrl.pathname;
        console.log(url);
        console.log(requestUrl);
        const lang = requestUrl.searchParams.get("lang");
        let selector;

        if (lang===null || lang === "en") {
            selector="";
        }else if (lang === "zh"){
            selector="-zh";
        } else {
        selector = "";
        }

        if(url==="/"){
            sendResponse(`index${selector}`,200,response);
        } else if (url==="/about"){
            sendResponse(`about${selector}`,200,response);
        } else if (url==="/login"){
            sendResponse(`login${selector}`,200,response);
        } else if (url==="/LoginSuccess"){
            sendResponse(`LoginSuccess${selector}`,200,response);
        } else if (url==="/LoginFail"){
            sendResponse(`LoginFail${selector}`,200,response);
            console.log("3");
        } else {
            sendResponse(`404${selector}`,404,response);
            console.log("4");
        }
    } else {
        if (url==="/process-longin"){
            let body = [];

            request.on("data",(chunk)=>{
                body.push(chunk);
            });
            request.on("end",(chunk)=>{
                body=Buffer.concat(body).toString();
                body = qs.parse(body);
                console.log(body);

                if(body.username ==="li" && body.password === "chenglong"){
                    response.statusCode = 301;
                    response.setHeader("Location","/LoginSuccess");
                }else{
                    response.statusCode = 301;
                    response.setHeader("Location","/LoginFail");
                }
                response.end();
            });
        }
    };
});

server.listen(Port,Ip,()=>{
    console.log(`Server is running at http://${Ip}:${Port}`);
});
