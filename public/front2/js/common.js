/**
 * Created by Jepson on 2018/6/28.
 */

$(function() {

  // 通过 mui 的选择器初始化一个 mui 实例对象, 就可以调用 mui 的方法了
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, // flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false // 设置不显示滚动条
  });

  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
  });
});

function getSearch( name ) {
  var search = location.search;
  // 对中文解码, 得到 ?name=pp&age=18&desc=帅
  search = decodeURI( search );
  // 去掉问号, 得到 name=pp&age=18&desc=帅
  search = search.slice( 1 );

  var arr = search.split("&");  // 得到 ["name=pp", "age=18", "desc=帅"]
  var obj = {};
  arr.forEach(function( v, i ) {
    var key = v.split("=")[0];  // name
    var value = v.split("=")[1]; // pp
    obj[ key ] = value;
  });
  return obj[name];
}
