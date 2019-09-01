var position = require('../view/position.html');
var position_item = require('../view/position-item.html');
var artTemplate = require("../libs/template-web");
const BScroll = require('better-scroll').default
import fetch from '../models/fetch';


var currentPageNo = 1;
var datalist = [];
var url = `/api/listmore.json?pageNo=${currentPageNo}&pageSize=15`;

const render = async () => {
  var result = await fetch.get(url);
  var data = result.content.data.page.result;
  $("#main").html(position);
  datalist = datalist.concat(data);
  let context = artTemplate.render(position_item, { data: datalist })
  $("#position-list").html(context)


  var bScroll = new BScroll('#main', {
    probeType: 2
  });

  // 初始化位置
  bScroll.scrollTo(0, -40)

  let head = $(".refresh");
  let foot = $('.more');
  let topImgHasClass = $(".refresh").hasClass("up");
  let bottomImgHasClass = $('.more').hasClass("down");

  bScroll.on('scroll', function () {
    let y = this.y
    let maxY = this.maxScrollY - y

    // 下拉，当隐藏的loading完全显示的时候触发
    if (y >= 0) {
      !topImgHasClass && head.addClass('up')
      return
    }

    // 上拉，当滚动到最底部时候触发
    if (maxY >= 0) {
      !bottomImgHasClass && foot.addClass('down')
      return
    }
  })


  bScroll.on('scrollEnd', async function () {
    // 下拉刷新处理
    if (this.y >= -40 && this.y < 0) {
      this.scrollTo(0, -40)
      head.removeClass('up')
    } else if (this.y >= 0) {
      head.find("img").attr('src', '/images/ajax-loader.gif')
      //加载异步数据

      var result = await fetch.get(url);
      datalist = result.content.data.page.result;
      let context = artTemplate.render(position_item, { data: datalist })
      $("#position-list").html(context)

      bScroll.refresh()
      // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      bScroll.scrollTo(0, -40)
      head.removeClass('up')
      head.find("img").attr('src', '/images/arrow.png')

    }

    // 下拉加载处理
    let maxY = this.maxScrollY - this.y
    if (maxY > -40 && maxY < 0) {
      this.scrollTo(0, this.maxScrollY + 40);
      foot.removeClass('down')
    } else if (maxY >= 0) {
      foot.find("img").attr('src', '/images/ajax-loader.gif')

      // 异步加载数据
      currentPageNo++;
      url = `/api/listmore.json?pageNo=${currentPageNo}&pageSize=15`;
      var result = await fetch.get(url);
      debugger;
      datalist = datalist.concat(result.content.data.page.result);
      let context = artTemplate.render(position_item, { data: datalist })
      $("#position-list").html(context)


      this.refresh() // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      this.scrollTo(0, this.maxScrollY + 40)
      head.removeClass('down')
      head.find('img').attr('src', '/images/arrow.png')
    }

  })






}


export default { render };