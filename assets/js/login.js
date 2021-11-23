$(function () {
    // 绑定点击事件 “去登录” 
    $("#link_login").on("click", function () {
        $(".login_box").show();
        $(".reg_box").hide();
    })
    // 绑定点击事件 “去注册”
    $("#link_reg").on("click", function () {
        $(".reg_box").show();
        $('.login_box').hide();
    })
    // 从lay中获取form对象
    let form = layui.form;
    let layer = layui.layer;
    // 通过form.verify()方法
    form.verify({
        // 自定义pwd表单验证
        pwd: [
            // \S 除了空格以外的所有输入取反（如果输入为空）
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 自定义 密码确认 表单验证
        repwd: function (value) {
            // 形参是确认密码的值
            // 获取输入密码的值
            // 将确认密码和输入密码进行等于判断
            let pwd = $('.reg_box [name=password]').val();
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    })
    // 绑定注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        // 1.阻止表单默认事件
        e.preventDefault();
        // 2.发起ajax请求
        let data = { username: $('.reg_box [name=username]').val(), password: $('.reg_box [name=password]').val() };
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                $("#link_login").click();
            }
        })
    })
    // 绑定登录表单提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("登录失败！")
                };
                layer.msg("登录成功！");
                // 将token数据以键值对的形式保存在localStorage
                localStorage.setItem('token', res.token);
                location.href = "/index.html";

            },
        })
    })

})