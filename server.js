var Crawler = require("crawler");
var inlineScriptsFound = 0;
var noJavascriptFound = 0;
var javascriptFound = 0;
var nonSecureScripts = 0;
var secureScripts = 0;
var nonSecureImage = 0;
var secureImage = 0;
var baseUrl = "http://www.google.com";
var resourcesParsed = [];

var c = new Crawler({
"maxConnections":10,
// This will be called for each crawled page
"callback": function (error, result, $) {
    // $ is a jQuery instance scoped to the server-side DOM of the page
    $("script").each(function(index, a) {
      if (a !== null && a !== undefined && a.attribs.src !== null && a.attribs.src !== undefined) {
          if (a.attribs.type == 'text/javascript') {
                javascriptFound++;
          }
          else {
              noJavascriptFound++;
          }
      } else {
          inlineScriptsFound++;
      }
    });
    
    $("a").each(function(index, a) {
        if (a !== null && a !== undefined && a.attribs.href !== null && a.attribs.href !== undefined) {
            if (a.attribs.href.indexOf(baseUrl) > -1) {
                if (resourcesParsed.indexOf(a.attribs.href) == -1) {
                    resourcesParsed.push(a.attribs.href);
                    c.queue(a.attribs.href);
                }
            }
            
            if (a.attribs.href.indexOf('/') == 0) {
                var url = baseUrl + a.attribs.href;
                if (resourcesParsed.indexOf(url) == -1) {
                    resourcesParsed.push(url);
                    c.queue(url);
                }
            }
            
            if (a.attribs.href.indexOf("https://"))
                    secureScripts++;
                else 
                    nonSecureScripts++;
            
            
        }
    });
    
    $("img").each(function(index, a) {
        if (a !== null && a !== undefined && a.attribs.src !== null && a.attribs.src !== undefined) {
            if (a.attribs.src.indexOf(baseUrl) > -1) {
                c.queue(a.src);
                
                if (a.attribs.src.indexOf("https://"))
                    secureImage++;
                else 
                    nonSecureImage++;
            }
            
            
        }
    });
},
"onDrain": function() {
    console.log("Javascript Found:" + javascriptFound);
    console.log("No Javascript Found:" + noJavascriptFound);
    console.log("Inline Scripts Found:" + inlineScriptsFound);
    console.log("SecureScripts Found:" + secureScripts);
    console.log("Non SecureScripts Found:" + nonSecureScripts);
    console.log("Secure Images Found:" + secureImage);
    console.log("Non Images Found:" + nonSecureImage);
    
    console.log("Parsed resources :" + resourcesParsed.length);
}
});

// Queue just one URL, with default callback
c.queue(baseUrl);
