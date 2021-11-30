$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initArticleCate()
    // 获取列表数据
    function initArticleCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let cateString = template("tpl_table", res);
                $(' tbody').html(cateString)
            }
        })
    }

    let indexAdd = null;
    // 绑定点击事件  添加类别  弹出层
    $('#dialog_add').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类'
            ,
            area: ['500px', '250px'],
            content: $("#tpl_dialog").html(),
        });
    })

    // 通过代理  添加文章分类  用委托事件 给弹出层的提交按钮绑定点击提交事件
    $("body").on("submit", "#form_add", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $('#form_add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败！');
                }
                initArticleCate()
                layer.msg('添加文章分类成功！')
                layer.close(indexAdd);
            }

        })
    })

    let indexEdit = null;
    //通过代理  文章编辑功能   事件委托
    $("tbody").on("click", '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类'
            ,
            area: ['500px', '250px'],
            content: $("#tpl_edit").html(),
        });

        let id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败！');
                }
                // 快速填充表单
                form.val("form_edit", res.data);
            }

        })
    })

    // 通过代理  提交编辑内容
    $("body").on("submit", '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit);
                initArticleCate()
            }

        })
    })

    let indexDelete
    // 通过代理  给删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function () {
        let id = $(this).attr("data-id");
        console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败！")
                    }
                    console.log(res);
                    initArticleCate();
                    layer.msg("删除文章分类成功！");
                }
            })
            layer.close(index);
        });
    })
})