// 每次发起  $.get()  $.post()  $.ajax()   请求时
// 都会提前调用   $.ajaxPrefilter()   这个函数
$.ajaxPrefilter(function (option) {
    // 调用ajax前，拼接根路径和接口
    option.url = "http://api-breakingnews-web.itheima.net" + option.url;
})