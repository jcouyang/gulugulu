const horizon = Horizon()("gulu");
const patch = snabbdom.init([snabbdom_props, snabbdom_style])
const genY = item => item.datetime.getMilliseconds() % window.innerHeight + 'px'
const genDanmu = data =>
  h('div', {},
    data.map(item =>
             h('p.gulu',{style: {top: item.y}}, [
          item.text])))

let initDan = genDanmu([])
const container = document.getElementById('app')
patch(container, initDan)
const log = x => y => console.log(x, y)

Rx.Observable
    .fromEvent(document.querySelector('input'), 'keyup')
    .filter((e)=>e.keyCode === 13)
    .pluck('target', 'value')
    .flatMap(value => horizon.store({
        id: uuid(),
        text: value,
        datetime: new Date(),
        y: window.scrollY,
    }))
    .subscribe(log('saved..'))

horizon.order('datetime').watch()
    .map(items => items.map(item=>({
        id: item.id,
        text: item.text,
        y: genY(item)
    })))
    .map(genDanmu)
    .reduce(patch, initDan)
    .subscribe(log('new...'))


function uuid() {
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
          .toString(16);
      }
      return uuid;
}
