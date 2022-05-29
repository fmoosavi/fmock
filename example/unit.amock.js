// [GET,...,All] /unit
fmock({
    path:"/unit",
    response:{
        code:"1",
        msg:"success",
        data:"hello fmock"
    },
    filter:function(req,req){
        return req;
    }
})