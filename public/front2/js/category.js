/**
 * Created by Jepson on 2018/6/28.
 */

$(function() {

  // 1. 一进入页面, 通过 ajax 请求一级分类的数据, 通过模板引擎渲染左侧列表
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function( info ) {
      console.log( info );
      var htmlStr = template( "tpl", info );
      $('.lt_category_left ul').html( htmlStr );

      // 应该根据第一个一级分类的 id, 进行渲染二级分类
      renderSecondById( info.rows[0].id );
    }
  });



  // 2. 点击左侧按钮, 获取当前点击的 一级分类id, 让二级列表重新渲染
  //    用事件委托给 a 注册点击事件
  $('.lt_category_left').on("click", "a", function() {
    var id = $(this).data("id");
    renderSecondById( id );

    // 让当前点击的 a 加上 current, 让其他的 a 移除 current
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
  });


  // 发送 ajax 请求, 请求对应二级分类数据, 进行二级分类渲染
  // 传参, 就是一级分类的 id
  function renderSecondById( id ) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template( "rightTpl", info );
        $('.lt_category_right ul').html( htmlStr );
      }
    })
  }


})
