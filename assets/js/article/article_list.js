$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    // 定义一个补零函数
    function padzero(n) {
        return n > 9 ? n : "0" + n;
    }

    // 定义一个事件过滤器
    template.defaults.imports.dataFormat = function (date) {
        let dt = new Date(date);

        let y = padzero(dt.getFullYear());
        let m = padzero(dt.getMonth());
        let d = padzero(dt.getDate());

        let hh = padzero(dt.getHours());
        let mm = padzero(dt.getMinutes());
        let ss = padzero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    }

    // 定义一个变量q(查询的意思)  存放对象数据
    // 每次发起ajax请求时，就使用此数据
    let q = {
        pagenum: 1, //文章列表页码，默认1
        pagesize: 2, //每页显示的文章数量，默认2条/页
        cate_id: "", //文章分类的 Id
        state: "", //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()
    // 绑定点击筛选按钮的提交监听事件
    $("#form-filter").on("submit", function (e) {
        e.preventDefault();
        q.cate_id = $("[name=cate_id]").val();
        q.state = $("[name=state]").val();
        console.log(q.cate_id, q.state);
        initTable(q)

    })


    // 文章列表初始化
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！")
                }
                console.log(res);
                let htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr)

                // 调用分页渲染函数
                renderPage(res.total)
            }

        })
    }

    // 获取文章分类列表菜单
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！")
                }
                let htmlStr = template("tpl-cate", res);
                $("[name=cate_id").html(htmlStr)
                // 动态添加选择框内容，需要重新加载layui渲染
                form.render();
                layer.msg("获取文章分类成功！")
            }
        })
    }

    // 定义一个渲染分页的函数
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7],
            jump: function (obj, first) {
                q.pagesize = obj.limit;
                q.pagenum = obj.curr;
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 事件委托 绑定一个删除按钮的点击事件
    $("tbody").on("click", ".btn-delete", function () {
        let id = $(this).attr("data-id");
        let len = $(".btn-delete").length;
        // 点击删除弹出层
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求删除数据
            $.ajax({
                method: "GET",
                // :id  表示id是动态数据
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败！")
                    }
                    // 当删除数据时  要判断当前页面数据是否有剩余 通过删除按钮的类名获取页面数据数量
                    // 如果剩余数量等于1（删除后就没了），此时页码值就要减一（减一前判断当前页码，不能是1）
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.msg("删除文章成功！")
                }
            })
            layer.close(index);
        });
    })

    // 事件委托  绑定编辑的点击事件
    // 视频没有教，自己也不会做，难点是如何编辑跳转之后的页面内容
    // $("tbody").on("click", ".btn-edit", function () {
    //     let id = $(this).attr("data-id");
    //     console.log(id);
    //     $.ajax({
    //         method: "GET",
    //         url: "/my/article/" + id,
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg("获取文章详情失败！")
    //             }
    //             console.log(res);
    //             location.href = "/article/art_pub.html"; form.val("form-pub", res.data)
    //             form.render();
    //             layer.msg("获取文章详情成功！")
    //         }
    //     })
    // })




})