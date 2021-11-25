// 每次发起  $.get()  $.post()  $.ajax()   请求时
// 都会提前调用   $.ajaxPrefilter()   这个函数
$.ajaxPrefilter(function (option) {
    // 调用ajax前，拼接根路径和接口
    option.url = "http://api-breakingnews-web.itheima.net" + option.url;
    // 统一为有权限的接口，这只headers 请求头
    if (option.url.indexOf("/my")) {
        option.headers = { Authorization: localStorage.getItem("token") || "" };
    };
    // 全局统一挂载complete 回调函数
    option.complete = function (res) {
        // 请求失败
        if (res.responseJSON.status === 1 || res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem("token");
            location.href = "/login.html"
        }
    };
})