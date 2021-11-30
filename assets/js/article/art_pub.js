$(function () {
    let layer = layui.layer;
    let form = layui.form;

    initCate()


    // 定义一个初始化文章分类函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("初始化文章分类失败！")
                }
                let htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 因为选项框里面的内容时动态生成的，所以要重新渲染 
                form.render()
            }

        })
    }


    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 绑定封面上传的点击事件
    $("#btnChooseImage").on("click", function () {
        $("[name=cover_img]").click()

        // 监听文件的变化事件
        $("[name=cover_img]").on("change", function (e) {
            // 1.拿到用户选择的文件
            let files = e.target.files;
            if (files.length === 0) {
                return
            }

            // 2.根据选择的文件，创建一个对应的url
            let newImgURL = URL.createObjectURL(files[0])

            // 3.先销毁旧的裁剪区域，再重新设置新的图片路径，之后再创建新的裁剪区域
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域


        })

    })


    let art_state = "已发布";
    $("#btnSave2").on("click", function () {
        art_state = "草稿";
    })

    $("#form-pub").on("submit", function (e) {
        e.preventDefault();
        let fd = new FormData($(this)[0]);
        fd.append("state", art_state)
        // 4.将裁剪后的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                publishArticle(fd)

            })

        // 发起ajax请求


        fd.forEach(function (v, k) {
            console.log(k, v);
        })

    })
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("文章发布失败！")
                }
                layer.msg("文章发布成功！")
                location.href = "/article/article_list.html"
            }
        })
    }

})