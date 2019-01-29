
module.exports=Accesstoken;
function Accesstoken(){
}

Accesstoken.init=function(){
    if (!Accesstoken._init){
        Accesstoken._token={};
        Accesstoken._init=true;
    }
}

Accesstoken.getAccessToken =function(){
    return Accesstoken._token;
}

Accesstoken.saveAccessToken =function(data){
    Accesstoken._token=data;
}

Accesstoken.init();


