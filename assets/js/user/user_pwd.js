$(function () {
    // 表单验证
    let form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '请密码必须是6~12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码输入不一致'
            }
        }
    })

    // 点击提交按钮  发起ajax请求更新数据  并且重置表单
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功');
                $('.layui-form')[0].reset();
            }
        })
    })



})