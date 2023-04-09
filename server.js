const http = require("http");
const fs = require("fs");

const Port = 1025;
const Ip = "127.0.0.1";

const sendResponse = (filename,statusCode,response) => {
    fs.readFile(`./html/${filename}.html`,(error,data)=>{
        if (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end("Sorry internal error");
        } else {
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
        } else {
            sendResponse(`404${selector}`,404,response);
        }
    } 
    else {

    };
});

server.listen(Port,Ip,()=>{
    console.log(`Server is running at http://${Ip}:${Port}`);
});
