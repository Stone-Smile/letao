/**
 * Created by Jepson on 2018/6/26.
 */
$(function() {
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页多少条

  // 声明变量, 标记当前选中的用户
  var currentId;
  var isDelete;

  // 1. 一进入页面, 发送 ajax 请求, 从后台获取数据, 通过模板引擎渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        // 参数1: 模板id
        // 参数2: 数据对象
        // 在模板中, 可以任意使用数据对象中的属性
        var htmlStr = template( "tpl", info );
        $('tbody').html( htmlStr );


        // 分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, // 需要定义版本号, 在结构中使用  ul
          // 总共多少页
          totalPages: Math.ceil( info.total / info.size ),
          // 当前第几页
          currentPage: info.page,
          // 配置按钮点击事件, page 表示当前点击的页码
          onPageClicked(a, b, c, page) {
            console.log( page );
            // 更新当前页
            currentPage = page;

            // 重新调用 render
            render();
          }
        })

      }
    });
  }



  // 2. 启用禁用功能, 点击按钮, 弹出模态框(复用, 用的是同一个模态框)
  //    通过事件委托来注册点击事件, 效率更高
  $('tbody').on("click", ".btn", function() {
    // 让模态框显示
    $('#userModal').modal("show");
    // 点击时候, 将当前选中的用户 id 记录在 全局 currentId
    currentId = $(this).parent().data("id");
    // 点击禁用按钮, 让用户变成禁用状态, 让 isDelete变成 0 => 将来传给后台就传 0
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  });


  // 3. 点击确认按钮, 需要根据 id 和 isDelete 发送 ajax 请求, 修改用户状态
  $('#submitBtn').click(function() {

    console.log( "currentId:" + currentId );
    console.log( "isDelete: " + isDelete );

    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        // 1. 关闭模态框
        $('#userModal').modal("hide");

        // 2. 重新渲染数据
        render();
      }
    })

  })



})
