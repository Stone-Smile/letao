/**
 * Created by Jepson on 2018/6/29.
 */


$(function() {



  // 在进行搜索历史记录管理时, 需要维护一个数组, 这个数组需要存在本地存储中
  // 我们约定一个键名, 键名: search_list

  // 数据初始化, 准备假数据
  // var arr = [ "耐克", "阿迪", "阿迪王", "耐克王" ];
  // var str = JSON.stringify( arr );
  // localStorage.setItem( "search_list", str );

  /*
   * 短路运算符:
   * ||   A || B  只要 A 是 true, 返回 A, A 为 false, 返回 B
   *      应用: var obj = obj2 || {};
   *      一般用于进行参数处理, 设置默认值
   *
   * &&   A && B  只要 A 为 false, 就不看 B了, A 为 true, 返回 B
   *      应用: success && success();
   * */

  // 功能1: 搜索历史记录渲染功能
  // (1) 获取本地存储中存储的数据 jsonStr
  // (2) 转换成数组
  // (3) 将数组, 通过模板引擎渲染历史记录
  render();


  // 获取历史记录数组
  function getHistory() {
    var history = localStorage.getItem( "search_list" ) || '[]';
    var arr = JSON.parse( history );
    return arr;
  }

  // 读取历史记录, 进行页面渲染
  function render() {
    var arr = getHistory();
    var htmlStr = template( "history_tpl", { arr: arr } );
    $('.lt_history').html( htmlStr );
  }



  // 功能2: 清空历史记录功能
  // (1) 给清空按钮添加点击事件, 通过事件委托
  // (2) 将 search_list 从本地存储中删除  使用 removeItem
  // (3) 页面需要重新渲染
  $('.lt_history').on("click", ".icon_empty", function() {

    // 添加确认框
    // 参数1: 提示框的内容
    // 参数2: 提示框的标题
    // 参数3: 按钮的内容 (数组)
    // 参数4: 关闭提示框的回调函数
    mui.confirm( "你是否要清空全部的历史记录?", "温馨提示", ["取消", "确认"], function( e ) {
      if ( e.index === 1 ) {
        // 点击的确认, 执行清空操作
        localStorage.removeItem( "search_list" );
        render();
      }
    })
  });

  // 功能3: 删除一条记录的功能
  // (1) 点击删除按钮, 删除该条记录, 添加点击事件 (事件委托)
  // (2) 将 数组下标存储在 标签中, 将来用于删除
  // (3) 获取 下标, 根据下标删除数组的对应项  arr.splice( index, 1 );
  // (4) 将数组存储到本地历史记录中
  // (5) 重新渲染
  $('.lt_history').on("click", ".icon_delete", function() {
    var that = this;
    // mui 确认框
    mui.confirm("你确认要删除该条数据么", "温馨提示", ["取消", "确认"], function( e ) {
      if ( e.index === 1 ) {
        // 获取下标
        var index = $(that).data("index");
        // 获取数组
        var arr = getHistory();
        // 根据下标删除 数组对应项
        //arr.splice( 从哪开始, 删除几个, 替换的项1, 替换的项2, 替换的项3, .... )
        arr.splice( index, 1 );
        // 存储到本地存储中
        localStorage.setItem( "search_list", JSON.stringify( arr ) );
        // 重新渲染
        render();
      }
    })
  });



  // 功能4: 添加搜索记录功能
  // (1) 给搜索按钮添加点击事件
  // (2) 获取搜索关键字
  // (3) 获取数组
  // (4) 添加到数组最前面
  // (5) 存储到本地历史记录中
  // (6) 重新渲染

  $('.search_btn').click(function() {
    // 获取关键字
    var key = $(".search_input").val();
    if ( key === "" ) {
      // alert( "请输入搜索关键字" );
      // 默认两秒
      mui.toast( "请输入搜索关键字");
      return;
    }

    // 获取数组
    var arr = getHistory();

    // 需求:
    // 1. 不能有重复的项, 如果有, 将旧的删除
    // 2. 如果数组长度最多 10个
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      // 将重复的该项删除
      arr.splice( index, 1 )
    }
    if ( arr.length >= 10 ) {
      // 删除最后一项
      arr.pop();
    }
    // 添加到数组最前面
    arr.unshift( key );
    // 存储到本地历史中
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
    // 重新渲染
    render();

    // 清空搜索框
    $('.search_input').val("");


    // 进行页面跳转
    location.href = "searchList.html?key=" +  key;
  })

});