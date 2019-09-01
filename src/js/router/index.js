import index from '../controller/position';
import search from '../controller/search';
import my from '../controller/my'

export default class router {
  constructor() {
    this.mode = 'hash';//history hash
    this.routers = {
      '/position': index,
      '/search': search,
      '/profile': my
    };
    //this.initEvent();
    this.init();
  }
  init() {
    index.render();
    this.setActive();
    window.addEventListener('hashchange', () => {
      this.loadView();
    }, false);
    // window.addEventListener('popstate', () => {
    //   this.loadView()
    // }, false);
  }

  loadView() {
    if (this.mode === 'hash') {
      let hash = location.hash || '#position';
      let url = hash.replace('#', '/');
      this.routers[url].render();
    } else {
      console.log(history.state);
    }
    this.setActive();
  }

  setActive() {
    $('nav a').filter(`[href="${location.hash}"]`).parent('li').addClass('active').siblings().removeClass('active')
  }

  initEvent() {
    $('nav a').on('click', function (event) {
      var href = $(this).attr('href').split("#")[1];
      history.pushState({ url: href }, '', '?' + href);
      history.forward();
      //event.preventDefault();
    })
  }

} 