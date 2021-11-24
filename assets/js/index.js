$(function () {
    // 调用获取获取用户信息的函数
    getUserInfo();
    // 点击退出按钮实现退出功能
    let layer = layui.layer
    $("#btn_logout").on("click", function () {
        // 弹出确认框
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem("token");
            location.href = "/login.html"

            // 关闭确认框
            layer.close(index);
        });
    })
})

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers: { Authorization: localStorage.getItem("token") || "" },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！")
            } else {
                // 调用渲染用户头像函数
                renderAvatar(res.data);
            }
        },
        // 每次发起带/my的私人请求都要用到这个，所以直接写到baseAPI里面
        // 发起请求后判断请求成功还是请求失败
        // complete: function (res) {
        //     console.log(res);
        //     // 请求失败
        //     if (res.responseJSON.status === 1 || res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem("token");
        //         location.href = "/login.html"
        //     }
        // },
    })


}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名称
    let name = user.nickname || user.username;
    // 2.渲染欢迎文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    // 3.按需渲染用户头像
    if (user.user_pic) {
        // 3.1 渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text_avatar").hide()
    } else {
        // 3.2 渲染文本头像
        let first = name[0].toUpperCase();
        $(".text_avatar").html(first).show();
        $(".layui-nav-img").hide();
    }
}