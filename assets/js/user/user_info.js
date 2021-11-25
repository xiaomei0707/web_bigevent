$(function () {
    // 表单验证
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6位字符之间';
            }
        },
    })
    initUserInfo()

    // 获取用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.mag('获取用户信息失败')
                }
                // 将用户信息自动写入表单中
                form.val("formUserInfo", res.data)
            }
        })
    }

    // 重置表单
    $('#btnReset').on('click', function (e) {
        // 阻止重置按钮的默认行为：清空表单所有内容
        e.preventDefault();
        initUserInfo()
    })

    // 点击提交按钮更新用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                // 调用父页面的方法  getUserInfo 更新信息   在user_info中，ifram相当于window，所以index页面则是window.parent
                window.parent.getUserInfo()
            }
        })
    })

})