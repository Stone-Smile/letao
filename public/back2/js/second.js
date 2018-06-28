/**
 * Created by Jepson on 2018/6/26.
 */

$(function() {

  // 1. 一进入页面, 发送 ajax 请求, 获取数据, 进行页面渲染
  var currentPage = 1;
  var pageSize = 5;
  render();

  function render() {
    // 发送 ajax
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        // 通过 template 方法生成 html字符串
        var htmlStr = template( "tpl", info );
        $('tbody').html( htmlStr );

        // 分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil( info.total / info.size ),
          currentPage: info.page,
          // 添加点击事件
          onPageClicked: function( a, b, c, page ) {
            // 更新 currentPage
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })

  }


  // 2. 点击添加分类按钮, 显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal("show");

    // 发送 ajax 请求, 获取下拉菜单的数据, 进行渲染下拉菜单
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      // 通过加载第一页, 100条数据, 模拟获取所有的一级分类数据
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });


  // 3. 给 dropdown-menu 注册委托事件, 让 a 可以被点击
  $('.dropdown-menu').on("click", "a", function() {

    // 获取选中的文本, 设置给上面按钮中的内容
    var txt = $(this).text();
    $('#dropdownTxt').text( txt );

    // 获取 id, 设置 name="categoryId" 的 input 框
    var id = $(this).data("id");
    $('[name="categoryId"]').val( id );

    // 用户选择了一级分类后, 需要将 name="categoryId" input 框的校验状态置成 VALID
    // 参数1: 字段名, 参数2: 设置成什么状态, 参数3: 回调(配置提示信息)
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
  });


  // 4. 进行 jquery-fileupload 实例化, 里面配置图片上传后的回调函数
  $("#fileupload").fileupload({
    // 返回的数据类型格式
    dataType:"json",

    // 图片上传完成的回调函数
    // e：事件对象
    // data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data.result.picAddr);
      var picUrl = data.result.picAddr; // 上传后得到的图片地址

      // 设置图片地址给 图片
      $('#imgBox img').attr("src", picUrl)

      // 将图片地址存在 name="brandLogo" 的 input 框中
      $('[name="brandLogo"]').val( picUrl );

      // 手动将表单校验状态重置成 VALID
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });



  // 5. 通过表单校验插件实现表单校验功能
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    //   默认不校验 隐藏域的 input, 我们需要重置 excluded 为 [], 恢复对 隐藏域的校验
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置字段
    fields: {
      //categoryId 用户选择一级分类 id
      //brandName  用户输入二级分类名称
      //brandLogo  上传的图片地址
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });



  // 6. 注册表单校验成功事件, 阻止默认提交, 通过 ajax 提交
  $('#form').on("success.form.bv", function( e ) {
    e.preventDefault();

    // 通过 ajax 进行提交
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 添加成功
          // 关闭模态框
          $('#addModal').modal("hide");
          // 重置表单内容
          $('#form').data("bootstrapValidator").resetForm(true);
          // 重新渲染第一页
          currentPage = 1;
          render();

          // 由于下拉框和图片不是表单, 所以需要手动重置
          $('#dropdownTxt').text("请选择一级分类");
          $('#imgBox img').attr("src", "images/none.png");
        }
      }
    })

  })

})
