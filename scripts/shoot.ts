import { Observable } from '@reactivex/rxjs/dist/cjs/Observable'
import '@reactivex/rxjs/dist/cjs/add/operator/filter'
import '@reactivex/rxjs/dist/cjs/add/operator/mergeMap'
import '@reactivex/rxjs/dist/cjs/add/observable/fromEvent'
import '@reactivex/rxjs/dist/cjs/add/observable/fromPromise'
import '@reactivex/rxjs/dist/cjs/add/operator/debounceTime'
import '@reactivex/rxjs/dist/cjs/add/operator/pluck'

export function renderInput(getdb, gety) {
  const shotToDanmaku = document.createElement('input') as HTMLInputElement
  shotToDanmaku.id = 'danmaku-input'
  shotToDanmaku.className = 'danmaku-input'
  const n = navigator as any
  const language = n.languages
    ? n.languages[0]
    : (navigator.language || n.userLanguage)
  if (language == 'zh-CN')
    shotToDanmaku.placeholder = "💬 您可以在这里输入弹幕吐槽哦~"
  else
    shotToDanmaku.placeholder = "💬 Type here to 突っ込み(Tsukkomi) on 弾幕(Danmaku)~"

  const shotDanmakuBox = document.createElement('div') as HTMLElement
  shotDanmakuBox.className = 'danmaku-box'
  shotDanmakuBox.appendChild(shotToDanmaku)
  document.body.appendChild(shotDanmakuBox)

  Observable
    .fromEvent<KeyboardEvent>(shotToDanmaku, 'keyup')
    .filter((e) => e.keyCode === 13)
    .pluck('target', 'value')
    .mergeMap(text => Observable.fromPromise(
      getdb().push().set({
        text,
        datetime: new Date().getTime(),
        y: gety()
      })))
    .subscribe((x) => {
      shotToDanmaku.value = ''
      console.log('saved..', x)
    })
}
