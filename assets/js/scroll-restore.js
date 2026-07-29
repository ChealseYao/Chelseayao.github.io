// 全站通用：记住每个页面的滚动位置，跳转离开再回来时停在原处（而不是顶部）
// 用法：在页面 </body> 前最后一个引入本文件
(function(){
  const key = "scroll:" + location.pathname;
  addEventListener("scroll", () => sessionStorage.setItem(key, scrollY), {passive:true});
  const y = sessionStorage.getItem(key);
  if (y) scrollTo(0, +y);
})();
