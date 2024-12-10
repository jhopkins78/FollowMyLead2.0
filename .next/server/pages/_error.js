(()=>{var e={};e.id=820,e.ids=[820,888,660],e.modules={1323:(e,t)=>{"use strict";Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},4258:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{config:()=>g,default:()=>p,getServerSideProps:()=>m,getStaticPaths:()=>h,getStaticProps:()=>f,reportWebVitals:()=>y,routeModule:()=>S,unstable_getServerProps:()=>x,unstable_getServerSideProps:()=>_,unstable_getStaticParams:()=>v,unstable_getStaticPaths:()=>P,unstable_getStaticProps:()=>b});var n=r(7093),s=r(5244),o=r(1323),l=r(2329),i=r.n(l),u=r(1063),d=r(4788),c=e([u]);u=(c.then?(await c)():c)[0];let p=(0,o.l)(d,"default"),f=(0,o.l)(d,"getStaticProps"),h=(0,o.l)(d,"getStaticPaths"),m=(0,o.l)(d,"getServerSideProps"),g=(0,o.l)(d,"config"),y=(0,o.l)(d,"reportWebVitals"),b=(0,o.l)(d,"unstable_getStaticProps"),P=(0,o.l)(d,"unstable_getStaticPaths"),v=(0,o.l)(d,"unstable_getStaticParams"),x=(0,o.l)(d,"unstable_getServerProps"),_=(0,o.l)(d,"unstable_getServerSideProps"),S=new n.PagesRouteModule({definition:{kind:s.x.PAGES,page:"/_error",pathname:"/_error",bundlePath:"",filename:""},components:{App:u.default,Document:i()},userland:d});a()}catch(e){a(e)}})},4788:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return u}});let a=r(5577),n=a._(r(6689)),s=a._(r(5156)),o={400:"Bad Request",404:"This page could not be found",405:"Method Not Allowed",500:"Internal Server Error"};function l(e){let{res:t,err:r}=e;return{statusCode:t&&t.statusCode?t.statusCode:r?r.statusCode:404}}let i={error:{fontFamily:'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',height:"100vh",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},desc:{lineHeight:"48px"},h1:{display:"inline-block",margin:"0 20px 0 0",paddingRight:23,fontSize:24,fontWeight:500,verticalAlign:"top"},h2:{fontSize:14,fontWeight:400,lineHeight:"28px"},wrap:{display:"inline-block"}};class u extends n.default.Component{render(){let{statusCode:e,withDarkMode:t=!0}=this.props,r=this.props.title||o[e]||"An unexpected error has occurred";return n.default.createElement("div",{style:i.error},n.default.createElement(s.default,null,n.default.createElement("title",null,e?e+": "+r:"Application error: a client-side exception has occurred")),n.default.createElement("div",{style:i.desc},n.default.createElement("style",{dangerouslySetInnerHTML:{__html:"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}"+(t?"@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}":"")}}),e?n.default.createElement("h1",{className:"next-error-h1",style:i.h1},e):null,n.default.createElement("div",{style:i.wrap},n.default.createElement("h2",{style:i.h2},this.props.title||e?r:n.default.createElement(n.default.Fragment,null,"Application error: a client-side exception has occurred (see the browser console for more information)"),"."))))}}u.displayName="ErrorPage",u.getInitialProps=l,u.origGetInitialProps=l,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},6793:(e,t)=>{"use strict";function r(e){let{ampFirst:t=!1,hybrid:r=!1,hasQuery:a=!1}=void 0===e?{}:e;return t||r&&a}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"isInAmpMode",{enumerable:!0,get:function(){return r}})},5156:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{defaultHead:function(){return u},default:function(){return f}});let a=r(5577),n=r(1271)._(r(6689)),s=a._(r(1537)),o=r(8039),l=r(1988),i=r(6793);function u(e){void 0===e&&(e=!1);let t=[n.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(n.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function d(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===n.default.Fragment?e.concat(n.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}r(5709);let c=["name","httpEquiv","charSet","itemProp"];function p(e,t){let{inAmpMode:r}=t;return e.reduce(d,[]).reverse().concat(u(r).reverse()).filter(function(){let e=new Set,t=new Set,r=new Set,a={};return n=>{let s=!0,o=!1;if(n.key&&"number"!=typeof n.key&&n.key.indexOf("$")>0){o=!0;let t=n.key.slice(n.key.indexOf("$")+1);e.has(t)?s=!1:e.add(t)}switch(n.type){case"title":case"base":t.has(n.type)?s=!1:t.add(n.type);break;case"meta":for(let e=0,t=c.length;e<t;e++){let t=c[e];if(n.props.hasOwnProperty(t)){if("charSet"===t)r.has(t)?s=!1:r.add(t);else{let e=n.props[t],r=a[t]||new Set;("name"!==t||!o)&&r.has(e)?s=!1:(r.add(e),a[t]=r)}}}}return s}}()).reverse().map((e,t)=>{let a=e.key||t;if(!r&&"link"===e.type&&e.props.href&&["https://fonts.googleapis.com/css","https://use.typekit.net/"].some(t=>e.props.href.startsWith(t))){let t={...e.props||{}};return t["data-href"]=t.href,t.href=void 0,t["data-optimized-fonts"]=!0,n.default.cloneElement(e,t)}return n.default.cloneElement(e,{key:a})})}let f=function(e){let{children:t}=e,r=(0,n.useContext)(o.AmpStateContext),a=(0,n.useContext)(l.HeadManagerContext);return n.default.createElement(s.default,{reduceComponentsToState:p,headManager:a,inAmpMode:(0,i.isInAmpMode)(r)},t)};("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},1537:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return o}});let a=r(6689),n=()=>{},s=()=>{};function o(e){var t;let{headManager:r,reduceComponentsToState:o}=e;function l(){if(r&&r.mountedInstances){let t=a.Children.toArray(Array.from(r.mountedInstances).filter(Boolean));r.updateHead(o(t,e))}}return null==r||null==(t=r.mountedInstances)||t.add(e.children),l(),n(()=>{var t;return null==r||null==(t=r.mountedInstances)||t.add(e.children),()=>{var t;null==r||null==(t=r.mountedInstances)||t.delete(e.children)}}),n(()=>(r&&(r._pendingUpdate=l),()=>{r&&(r._pendingUpdate=l)})),s(()=>(r&&r._pendingUpdate&&(r._pendingUpdate(),r._pendingUpdate=null),()=>{r&&r._pendingUpdate&&(r._pendingUpdate(),r._pendingUpdate=null)})),null}},5709:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"warnOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},1979:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{H:()=>d,a:()=>c});var n=r(997),s=r(6689),o=r(100),l=r(1163),i=e([o]);o=(i.then?(await i)():i)[0];let u=(0,s.createContext)(null),d=({children:e})=>{let[t,r]=(0,s.useState)(null),a=(0,l.useRouter)();(0,s.useEffect)(()=>{},[]);let i=async(e,t)=>{try{let{token:n,user:s}=(await (0,o.x4)({email:e,password:t})).data.data;localStorage.setItem("token",n),localStorage.setItem("user",JSON.stringify(s)),r(s),a.push("/dashboard")}catch(e){throw Error(e.response?.data?.message||"Login failed")}},d=async(e,t,n)=>{try{let{token:s,user:l}=(await (0,o.z2)({username:e,email:t,password:n})).data.data;localStorage.setItem("token",s),localStorage.setItem("user",JSON.stringify(l)),r(l),a.push("/dashboard")}catch(e){throw Error(e.response?.data?.message||"Registration failed")}};return n.jsx(u.Provider,{value:{user:t,login:i,register:d,logout:()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),r(null),a.push("/login")},isAuthenticated:!!t},children:e})},c=()=>{let e=(0,s.useContext)(u);if(!e)throw Error("useAuth must be used within an AuthProvider");return e};a()}catch(e){a(e)}})},1063:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{default:()=>d});var n=r(997),s=r(3963),o=r.n(s),l=r(1979);r(108);var i=r(6201),u=e([l,i]);function d({Component:e,pageProps:t}){return n.jsx(l.H,{children:(0,n.jsxs)("html",{lang:"en",suppressHydrationWarning:!0,children:[(0,n.jsxs)("head",{children:[n.jsx("meta",{charSet:"utf-8"}),n.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"})]}),(0,n.jsxs)("body",{className:o().className,children:[n.jsx(e,{...t}),n.jsx(i.Toaster,{position:"top-right"})]})]})})}[l,i]=u.then?(await u)():u,a()}catch(e){a(e)}})},100:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{Hm:()=>p,Wf:()=>m,Wr:()=>h,d1:()=>f,hh:()=>c,on:()=>g,x4:()=>u,z2:()=>d});var n=r(9648),s=e([n]);n=(s.then?(await s)():s)[0];let o=process.env.NEXT_PUBLIC_API_URL||"http://localhost:3000/api",l=process.env.NEXT_PUBLIC_INSIGHTS_API_URL||"https://cz0zmv145h.execute-api.us-west-1.amazonaws.com/prod",i=n.default.create({baseURL:o,headers:{"Content-Type":"application/json"}});i.interceptors.request.use(e=>{let t=localStorage.getItem("token");return t&&(e.headers.Authorization=`Bearer ${t}`),e});let u=async e=>(await i.post("/auth/login",e)).data,d=async e=>(await i.post("/auth/register",e)).data,c=async()=>(await i.get("/leads")).data,p=async e=>{let t=new FormData;return t.append("file",e),(await i.post("/leads/upload-csv",t,{headers:{"Content-Type":"multipart/form-data"}})).data},f=async e=>(await i.get(`/leads/${e}`)).data,h=async(e,t)=>(await i.patch(`/leads/${e}/status`,{status:t}),{data:{data:void 0}}),m=async(e,t)=>(await i.post(`/leads/${e}/notes`,{content:t},{headers:{"Content-Type":"application/json"}})).data,g=async()=>({data:{data:(await n.default.get(`${l}/insights`)).data}});i.interceptors.response.use(e=>e,e=>(e.response?.status===401&&(localStorage.removeItem("token"),window.location.href="/login"),Promise.reject(e))),a()}catch(e){a(e)}})},108:()=>{},5244:(e,t)=>{"use strict";var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},8039:(e,t,r)=>{"use strict";e.exports=r(7093).vendored.contexts.AmpContext},2785:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{"use strict";e.exports=require("react")},6405:e=>{"use strict";e.exports=require("react-dom")},997:e=>{"use strict";e.exports=require("react/jsx-runtime")},9648:e=>{"use strict";e.exports=import("axios")},6201:e=>{"use strict";e.exports=import("react-hot-toast")},7147:e=>{"use strict";e.exports=require("fs")},1017:e=>{"use strict";e.exports=require("path")},2781:e=>{"use strict";e.exports=require("stream")},9796:e=>{"use strict";e.exports=require("zlib")}};var t=require("../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[559,239,329],()=>r(4258));module.exports=a})();