(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{1650:function(e,a,t){"use strict";t.d(a,"f",function(){return o}),t.d(a,"c",function(){return c}),t.d(a,"a",function(){return m}),t.d(a,"d",function(){return u}),t.d(a,"e",function(){return d}),t.d(a,"b",function(){return h});var n=t(15),r=t.n(n),i=t(1),s=t.n(i),l=s.a.API_ENPOINT+"/public/api/",o=function(e){var a=l+"register";return r.a.post(a,e)},c=function(e){var a={params:{userName:e.username}};console.log(a);var t=l+"username";return r.a.put(t,null,a)},m=function(e){var a={params:{email:e.email}};console.log(a);var t=l+"email";return r.a.put(t,null,a)},u=function(e){var a=s.a.API_ENPOINT+"/public/api/forgot-password";return r.a.post(a,e)},d=function(e){return r.a.put("http://localhost:8993/nimpe/public/api/OTP",e)},h=function(e){var a=s.a.API_ENPOINT+"/public/api/OTP/register";return r.a.put(a,e)}},1877:function(e,a,t){"use strict";t.r(a);var n=t(5),r=t(366),i=t(25),s=t(26),l=t(40),o=t(41),c=t(0),m=t.n(c),u=t(1),d=t.n(u),h=t(1337),p=t(1335),g=t(1333),f=t(1487),v=t(92),b=t(6),w=t(32),E=t(1650),k=t(1452),P=t(76),y=function(e){Object(l.a)(t,e);var a=Object(o.a)(t);function t(){var e;Object(i.a)(this,t);for(var s=arguments.length,l=new Array(s),o=0;o<s;o++)l[o]=arguments[o];return(e=a.call.apply(a,[this].concat(l))).state={email:"",token:"",newPassword:"",confirmNewPassword:"",emailCorrect:!1},e.handleChange=function(a){a.persist(),e.setState(Object(r.a)({},a.target.name,a.target.value))},e.handleFormSubmit=function(a){e.props.t;e.state.emailCorrect?Object(E.e)(Object(n.a)({},e.state)).then(function(a){console.log(a),200===a.data.code?(k.b.success("Thay \u0111\u1ed5i m\u1eadt kh\u1ea9u th\xe0nh c\xf4ng"),setTimeout(function(){e.props.history.push(d.a.ROOT_PATH+"session/signin")},1e3)):k.b.error("Th\xf4ng tin kh\xf4ng ch\xednh x\xe1c")}).catch(function(e){k.b.error(e.message)}):Object(E.d)({email:e.state.email}).then(function(a){console.log(a),k.b.success("Ki\u1ec3m tra OTP trong email \u0111\u0103ng k\xfd"),e.setState({emailCorrect:!0})}).catch(function(e){var a;400===(null===(a=e.response)||void 0===a?void 0:a.status)?k.b.error("Email kh\xf4ng t\u1ed3n t\u1ea1i"):k.b.error("C\xf3 l\u1ed7i x\u1ea3y ra"),console.log(e.message)})},e}return Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;f.ValidatorForm.addValidationRule("isPasswordMatch",function(a){return a===e.state.newPassword})}},{key:"componentWillUnmount",value:function(){f.ValidatorForm.removeValidationRule("isPasswordMatch")}},{key:"render",value:function(){var e=this,a=this.state,t=a.email,n=a.emailCorrect,r=a.newPassword,i=a.confirmNewPassword,s=a.token;return m.a.createElement("div",{className:"signup flex flex-center w-100 h-100vh"},m.a.createElement("div",{className:"p-8"},m.a.createElement(h.a,{className:"signup-card position-relative y-center",style:{top:"25vh"}},m.a.createElement(p.a,{container:!0},m.a.createElement(p.a,{item:!0,lg:5,md:5,sm:5,xs:12},m.a.createElement("div",{className:"p-32 flex flex-center flex-middle h-100"},m.a.createElement("img",{src:"/assets/images/logos/logo_nimpe.jpg",alt:""}))),m.a.createElement(p.a,{item:!0,lg:7,md:7,sm:7,xs:12},m.a.createElement("div",{className:"p-24 h-100 bg-light-gray position-relative"},m.a.createElement("p",{style:{fontSize:"16px",paddingBottom:"20px"}},"M\u1eddi b\u1ea1n nh\u1eadp email \u0111\u1ec3 l\u1ea5y l\u1ea1i m\u1eadt kh\u1ea9u: "),m.a.createElement(f.ValidatorForm,{ref:"form",onSubmit:function(a){return e.handleFormSubmit(a)}},m.a.createElement(f.TextValidator,{size:"small",className:"mb-24 w-100",variant:"outlined",label:"Email",onChange:this.handleChange,type:"email",name:"email",value:t,validators:["required","isEmail"],errorMessages:["this field is required","email is not valid"]}),n&&m.a.createElement(m.a.Fragment,null,m.a.createElement(f.TextValidator,{size:"small",className:"mb-24 w-100",variant:"outlined",label:"OTP",onChange:this.handleChange,type:"text",name:"token",value:s,validators:["required"],errorMessages:["this field is required"]}),m.a.createElement(f.TextValidator,{size:"small",className:"mb-24 w-100",variant:"outlined",label:"M\u1eadt kh\u1ea9u",onChange:this.handleChange,type:"password",name:"newPassword",value:r,validators:["required","matchRegexp:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"],errorMessages:["this field is required","M\u1eadt kh\u1ea9u c\xf3 8 k\xfd t\u1ef1 bao g\u1ed3m: Ch\u1eef hoa, ch\u1eef th\u01b0\u1eddng, s\u1ed1 v\xe0 k\xfd t\u1ef1 \u0111\u1eb7c bi\u1ec7t"]}),m.a.createElement(f.TextValidator,{size:"small",className:"mb-24 w-100",variant:"outlined",label:"Nh\u1eadp l\u1ea1i m\u1eadt kh\u1ea9u",onChange:this.handleChange,type:"password",name:"confirmNewPassword",value:i,validators:["isPasswordMatch","required"],errorMessages:["M\u1eadt kh\u1ea9u kh\xf4ng kh\u1edbp","this field is required"]})),m.a.createElement("div",{className:"flex flex-middle"},m.a.createElement(c.Suspense,{fallback:m.a.createElement("h1",null,"loading")},m.a.createElement(g.a,{variant:"contained",color:"primary",type:"button",onClick:this.handleFormSubmit},"L\u1ea5y l\u1ea1i m\u1eadt kh\u1ea9u"))),m.a.createElement("p",{className:"text-muted",style:{position:"absolute",bottom:"0",left:"40%",transform:"translateX(-40%)"}},"B\u1ea1n \u0111\xe3 c\xf3 t\xe0i kho\u1ea3n?",m.a.createElement(P.a,{to:"/session/signin",className:"text-primary font-weight-bold ml-10"},"\u0110\u0103ng nh\u1eadp")))))))),m.a.createElement(k.a,null))}}]),t}(c.Component);a.default=Object(w.g)(Object(v.b)(function(e){return{resetPassword:b.PropTypes.func.isRequired,login:e.login}},{resetPassword:E.e})(y))}}]);
//# sourceMappingURL=48.4854071d.chunk.js.map