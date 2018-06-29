/**
 * Created by Jepson on 2018/6/29.
 */

$(function() {

  // 1. 一进入页面, 解析地址栏参数, 将值设置给input, 再进行页面渲染
  // 获取搜索关键字
  var key = getSearch("key");
  $('.search_input').val( key );

  render();

  // 方法实现的功能: 获取搜索框的值, 发送ajax请求, 进行页面渲染
  function render() {
    $('.lt_product').html('<div class="loading"></div>');

    // 三个必传的参数
    var params = {};
    params.proName = $('.search_input').val();
    params.page = 1;
    params.pageSize = 100;

    // 还有两个可传的参数 price 和 num
    // 根据当前高亮的 a 来决定按什么排序,  1升序，2降序
    var $current = $('.lt_sort .current');
    if ( $current.length > 0 ) {
      // 说明有高亮的, 需要排序
      var sortName = $current.data("type");  // 排序名称
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;  // 排序的值
      params[ sortName ] = sortValue;
    }
    console.log(params);

    // 模拟网络延迟
    setTimeout(function() {

      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function( info ) {
          var htmlStr = template( "productTpl", info );
          $('.lt_product').html( htmlStr );
        }
      })

    }, 500);

  }

  // 2. 点击搜索按钮, 进行搜索功能, 历史记录管理
  $('.search_btn').click(function() {
    // 搜索成功, 需要更新历史记录
    var key = $('.search_input').val();
    if ( key === "" ) {
      mui.toast("请输入搜索关键字");
      return;
    }

    // 调用 render 方法, 重新根据搜索框的值进行页面渲染
    render();

    // 获取数组
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse( history );

    // 1. 不能重复
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      arr.splice( index, 1 );
    }
    // 2. 不能超过 10 个
    if ( arr.length >= 10 ) {
      arr.pop();
    }
    // 添加到数组最前面
    arr.unshift( key );
    // 存到 localStorage 里面去
    localStorage.setItem( "search_list", JSON.stringify( arr ) );

    // 清空搜索框
    $('.search_input').val("");
  });


  // 3. 添加排序功能
  // (1) 添加点击事件
  // (2) 如果没有current, 就要加上current, 并且其他 a 需要移除 current
  //     如果有 current, 切换小箭头方向即可
  // (3) 页面重新渲染
  $('.lt_sort a[data-type]').click(function() {

    if ( $(this).hasClass("current") ) {
      // 如果有 current, 切换小箭头方向
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    else {
      // 没有 current, 加上 current
      $(this).addClass("current").siblings().removeClass("current");
    }
    // 调用 render 进行重新渲染
    render();
  })




})
