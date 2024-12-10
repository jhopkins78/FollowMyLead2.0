(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[667],{8445:function(e,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/Login",function(){return t(816)}])},6485:function(e,r,t){"use strict";t.d(r,{z:function(){return o}});var s=t(5893),a=t(7294),n=t(1465),i=t(2003),d=t(9186);let l=(0,i.j)("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-blue-600 text-white hover:bg-blue-700",destructive:"bg-red-500 text-white hover:bg-red-600",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),o=a.forwardRef((e,r)=>{let{className:t,variant:a,size:i,asChild:o=!1,...c}=e,u=o?n.g7:"button";return(0,s.jsx)(u,{className:(0,d.cn)(l({variant:a,size:i,className:t})),ref:r,...c})});o.displayName="Button"},4942:function(e,r,t){"use strict";t.d(r,{Zb:function(){return i}});var s=t(5893),a=t(7294),n=t(9186);let i=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",t),...a})});i.displayName="Card",a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("flex flex-col space-y-1.5 p-6",t),...a})}).displayName="CardHeader",a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("h3",{ref:r,className:(0,n.cn)("text-2xl font-semibold leading-none tracking-tight",t),...a})}).displayName="CardTitle",a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("p",{ref:r,className:(0,n.cn)("text-sm text-muted-foreground",t),...a})}).displayName="CardDescription",a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("p-6 pt-0",t),...a})}).displayName="CardContent",a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,n.cn)("flex items-center p-6 pt-0",t),...a})}).displayName="CardFooter"},6489:function(e,r,t){"use strict";t.d(r,{I:function(){return i}});var s=t(5893),a=t(7294),n=t(9186);let i=a.forwardRef((e,r)=>{let{className:t,type:a,...i}=e;return(0,s.jsx)("input",{type:a,className:(0,n.cn)("flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",t),ref:r,...i})});i.displayName="Input"},8732:function(e,r,t){"use strict";t.d(r,{_:function(){return i}});var s=t(5893),a=t(7294),n=t(9186);let i=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("label",{ref:r,className:(0,n.cn)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",t),...a})});i.displayName="Label"},9186:function(e,r,t){"use strict";t.d(r,{cn:function(){return n}});var s=t(512),a=t(8388);function n(){for(var e=arguments.length,r=Array(e),t=0;t<e;t++)r[t]=arguments[t];return(0,a.m6)((0,s.W)(r))}},816:function(e,r,t){"use strict";t.r(r);var s=t(5893);t(7294);var a=t(1163),n=t(7536),i=t(6501),d=t(6485),l=t(6489),o=t(8732),c=t(4942),u=t(8792);r.default=()=>{let e=(0,a.useRouter)(),{login:r}=(0,u.a)(),{register:t,handleSubmit:f,formState:{errors:m}}=(0,n.cI)(),p=async t=>{try{await r(t.email,t.password),i.Am.success("Successfully logged in!"),e.push("/dashboard")}catch(e){i.Am.error("Failed to login. Please check your credentials.")}};return(0,s.jsx)("div",{className:"flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8",children:(0,s.jsxs)(c.Zb,{className:"w-full max-w-md space-y-8 p-8",children:[(0,s.jsx)("div",{children:(0,s.jsx)("h2",{className:"mt-6 text-center text-3xl font-bold tracking-tight text-gray-900",children:"Sign in to your account"})}),(0,s.jsxs)("form",{className:"mt-8 space-y-6",onSubmit:f(p),children:[(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)(o._,{htmlFor:"email",children:"Email address"}),(0,s.jsx)(l.I,{id:"email",type:"email",autoComplete:"email",...t("email",{required:"Email is required",pattern:{value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:"Invalid email address"}})}),m.email&&(0,s.jsx)("p",{className:"mt-1 text-sm text-red-600",children:m.email.message})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)(o._,{htmlFor:"password",children:"Password"}),(0,s.jsx)(l.I,{id:"password",type:"password",autoComplete:"current-password",...t("password",{required:"Password is required",minLength:{value:6,message:"Password must be at least 6 characters"}})}),m.password&&(0,s.jsx)("p",{className:"mt-1 text-sm text-red-600",children:m.password.message})]})]}),(0,s.jsx)(d.z,{type:"submit",className:"w-full",children:"Sign in"})]})]})})}}},function(e){e.O(0,[536,553,774,888,179],function(){return e(e.s=8445)}),_N_E=e.O()}]);