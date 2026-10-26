"use strict";(()=>{var e=self.Ultraviolet,t=["cross-origin-embedder-policy","cross-origin-opener-policy","cross-origin-resource-policy","content-security-policy","content-security-policy-report-only","expect-ct","feature-policy","origin-isolation","strict-transport-security","upgrade-insecure-requests","x-content-type-options","x-download-options","x-frame-options","x-permitted-cross-domain-policies","x-powered-by","x-xss-protection"],r=["GET","HEAD"],i=class extends e.EventEmitter{constructor(t=__uv$config){super(),t.prefix||(t.prefix="/service/"),this.config=t,this.bareClient=new e.BareClient}route({request:e}){return!!e.url.startsWith(location.origin+this.config.prefix)}async fetch({request:i}){let a;try{if(!i.url.startsWith(location.origin+this.config.prefix))return await fetch(i);let c=new e(this.config);"function"==typeof this.config.construct&&this.config.construct(c,"service");let d=await c.cookie.db();c.meta.origin=location.origin,c.meta.base=c.meta.url=new URL(c.sourceUrl(i.url));let u=new o(i,c,r.includes(i.method.toUpperCase())?null:await i.blob());if("blob:"===c.meta.url.protocol&&(u.blob=!0,u.base=u.url=new URL(u.url.pathname)),i.referrer&&i.referrer.startsWith(location.origin)){let h=new URL(c.sourceUrl(i.referrer));(u.headers.origin||c.meta.url.origin!==h.origin&&"cors"===i.mode)&&(u.headers.origin=h.origin),u.headers.referer=h.href}let p=await c.cookie.getCookies(d)||[],m=c.cookie.serialize(p,c.meta,!1);u.headers["user-agent"]=navigator.userAgent,m&&(u.headers.cookie=m);let f=new n(u,null,null);if(this.emit("request",f),f.intercepted)return f.returnValue;let b=await this.bareClient.fetch(a=u.blob?"blob:"+location.origin+u.url.pathname:u.url,{headers:u.headers,method:u.method,body:u.body,credentials:u.credentials,mode:u.mode,cache:u.cache,redirect:u.redirect}),g=new s(u,b),y=new n(g,null,null);if(this.emit("beforemod",y),y.intercepted)return y.returnValue;for(let w of t)g.headers[w]&&delete g.headers[w];if(g.headers.location&&(g.headers.location=c.rewriteUrl(g.headers.location)),["document","iframe"].includes(i.destination)){let v=g.getHeader("content-disposition");if(!/\s*?((inline|attachment);\s*?)filename=/i.test(v)){let x=/^\s*?attachment/i.test(v)?"attachment":"inline",[k]=new URL(b.finalURL).pathname.split("/").slice(-1);g.headers["content-disposition"]=`${x}; filename=${JSON.stringify(k)}`}}if(g.headers["set-cookie"]&&(Promise.resolve(c.cookie.setCookies(g.headers["set-cookie"],d,c.meta)).then(()=>{self.clients.matchAll().then(function(e){e.forEach(function(e){e.postMessage({msg:"updateCookies",url:c.meta.url.href})})})}),delete g.headers["set-cookie"]),g.body)switch(i.destination){case"script":g.body=c.js.rewrite(await b.text());break;case"worker":{let C=[c.bundleScript,c.clientScript,c.configScript,c.handlerScript].map(e=>JSON.stringify(e)).join(",");g.body=`if (!self.__uv) {
                                ${c.createJsInject(c.cookie.serialize(p,c.meta,!0),i.referrer)}
                            importScripts(${C});
                            }
`,g.body+=c.js.rewrite(await b.text())}break;case"style":g.body=c.rewriteCSS(await b.text());break;case"iframe":case"document":if(g.getHeader("content-type")&&g.getHeader("content-type").startsWith("text/html")){let $=await b.text();if(Array.isArray(this.config.inject)){let H=$.indexOf("<head>"),E=$.indexOf("<HEAD>"),S=$.indexOf("<body>"),U=$.indexOf("<BODY>"),q=new URL(a),T=this.config.inject;for(let _ of T)RegExp(_.host).test(q.host)&&("head"===_.injectTo?(-1!==H||-1!==E)&&($=$.slice(0,H)+`${_.html}`+$.slice(H)):"body"===_.injectTo&&(-1!==S||-1!==U)&&($=$.slice(0,S)+`${_.html}`+$.slice(S)))}g.body=c.rewriteHtml($,{document:!0,injectHead:c.createHtmlInject(c.handlerScript,c.bundleScript,c.clientScript,c.configScript,c.cookie.serialize(p,c.meta,!0),i.referrer)})}}return"text/event-stream"===u.headers.accept&&(g.headers["content-type"]="text/event-stream"),crossOriginIsolated&&(g.headers["Cross-Origin-Embedder-Policy"]="require-corp"),this.emit("response",y),y.intercepted?y.returnValue:new Response(g.body,{headers:g.headers,status:g.status,statusText:g.statusText})}catch(j){return["document","iframe"].includes(i.destination)?(console.error(j),l(j,a)):new Response(void 0,{status:500})}}static Ultraviolet=e};self.UVServiceWorker=i;var s=class{constructor(e,t){for(let r in this.request=e,this.raw=t,this.ultraviolet=e.ultraviolet,this.headers={},t.rawHeaders)this.headers[r.toLowerCase()]=t.rawHeaders[r];this.status=t.status,this.statusText=t.statusText,this.body=t.body}get url(){return this.request.url}get base(){return this.request.base}set base(e){this.request.base=e}getHeader(e){return Array.isArray(this.headers[e])?this.headers[e][0]:this.headers[e]}},o=class{constructor(e,t,r=null){this.ultraviolet=t,this.request=e,this.headers=Object.fromEntries(e.headers.entries()),this.method=e.method,this.body=r||null,this.cache=e.cache,this.redirect=e.redirect,this.credentials="omit",this.mode="cors"===e.mode?e.mode:"same-origin",this.blob=!1}get url(){return this.ultraviolet.meta.url}set url(e){this.ultraviolet.meta.url=e}get base(){return this.ultraviolet.meta.base}set base(e){this.ultraviolet.meta.base=e}},n=class{#a;#b;constructor(e={},t=null,r=null){this.#a=!1,this.#b=null,this.data=e,this.target=t,this.that=r}get intercepted(){return this.#a}get returnValue(){return this.#b}respondWith(e){this.#b=e,this.#a=!0}};function a(e,t){return`<!DOCTYPE html>
        <html>
        <head>
        <meta charset='utf-8' />
        <title>Error</title>
        <style>
        * { background-color: white }
        </style>
        </head>
        <body>
        <h1 id='errorTitle'>Error processing your request</h1>
        <hr />
        <p>Failed to load <b id="fetchedURL"></b></p>
        <p id="errorMessage">Internal Server Error</p>
        <textarea id="errorTrace" cols="40" rows="10" readonly></textarea>
        <p>Try:</p>
        <ul>
        <li>Checking your internet connection</li>
        <li>Verifying you entered the correct address</li>
        <li>Clearing the site data</li>
        <li>Contacting <b id="uvHostname"></b>'s administrator</li>
        <li>Verify the server isn't censored</li>
        </ul>
        <p>If you're the administrator of <b id="uvHostname"></b>, try:</p>
        <ul>
        <li>Restarting your server</li>
        <li>Updating Ultraviolet</li>
        <li>Troubleshooting the error on the <a href="https://github.com/titaniumnetwork-dev/Ultraviolet" target="_blank">GitHub repository</a></li>
        </ul>
        <button id="reload">Reload</button>
        <hr />
        <p><i>Ultraviolet v<span id="uvVersion"></span> (build <span id="uvBuild"></span>)</i></p>
        <script src="${"data:application/javascript,"+encodeURIComponent(`
        errorTrace.value = ${JSON.stringify(e)};
        fetchedURL.textContent = ${JSON.stringify(t)};
        for (const node of document.querySelectorAll("#uvHostname")) node.textContent = ${JSON.stringify(location.hostname)};
        reload.addEventListener("click", () => location.reload());
        uvVersion.textContent = ${JSON.stringify("3.2.10")};
        uvBuild.textContent = ${JSON.stringify("92d9075")};
    `)}"></script>
        </body>
        </html>
        `}function l(e,t){let r={"content-type":"text/html"};return crossOriginIsolated&&(r["Cross-Origin-Embedder-Policy"]="require-corp"),new Response(a(String(e),t),{status:500,headers:r})}})();
