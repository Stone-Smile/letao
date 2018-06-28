/**
 * Created by Jepson on 2018/6/25.
 */


// 5. 如果当前用户没有登录, 需要拦截到登陆页面
//    前端是不知道用户是否登陆了的, 但是后台知道, 想知道, 问后台, (访问后台接口即可)
//    注意: 需要将登录页, 排除在外面, 就是登录页可以不登录就访问的

if ( location.href.indexOf("login.html") === -1 ) {
  // 如果索引为 -1, 说明在地址栏参数中没有 login.html 需要登陆拦截
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function( info ) {
      //console.log( info );
      if ( info.error === 400 ) {
        // 当前用户没登陆, 拦截到登陆页
        location.href = "login.html";
      }

      if ( info.success ) {
        // 当前用户已登录, 不需要拦截, 啥事都不用干, 让用户访问页面
        //console.log( "当前用户已登陆" );
      }
    }
  });
}






// 实现进度条功能 (给 ajax 请求加), 注意需要给所有的 ajax 都加
// 发送 ajax 开启进度条, ajax结束, 关闭进度条

// 开启进度条
//NProgress.start();
//
//setTimeout(function() {
//  // 关闭进度条
//  NProgress.done();
//}, 500);


// ajax 全局事件
// .ajaxComplete()  每个ajax完成时调用, (不管成功还是失败)
// .ajaxSuccess()   每个ajax成功时调用
// .ajaxError()     每个ajax失败时调用
// .ajaxSend()      每个ajax发送前调用

// .ajaxStart()     第一个ajax发送时调用
// .ajaxStop()      所有的ajax请求都完成时调用

// 第一个ajax发送时, 开启进度条
$(document).ajaxStart(function() {
  NProgress.start();
});

// 所有的ajax请求完成时调用, 关闭进度条
$(document).ajaxStop(function() {

  // 模拟网络延迟
  setTimeout(function() {
    NProgress.done();
  }, 500)
});


// 公共功能
$(function() {
  // 1. 左侧二级菜单切换显示
  $('.lt_aside .category').click(function() {
    $('.lt_aside .child').stop().slideToggle();
  });

  // 2. 左侧整个侧边栏显示隐藏功能
  $('.lt_topbar .icon_menu').click(function() {
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
  });


  // 3. 点击头部退出按钮, 显示退出模态框
  $('.lt_topbar .icon_logout').click(function() {
    // 显示模态框
    $('#logoutModal').modal("show");
  });

  // 4. 点击模态框中的退出按钮, 需要进行退出操作(ajax)
  $('#logoutBtn').click(function() {

    // 发送ajax请求进行退出操作, 让后台销毁当前用户的登陆状态
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function( info ) {
        console.log( info )
        if ( info.success ) {
          // 跳转到登录页面
          location.href = "login.html";
        }
      }
    })

  });
});



