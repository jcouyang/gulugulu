import * as firebase from 'firebase'
import { Observable } from '@reactivex/rxjs/dist/cjs/Observable'
import { Subject } from '@reactivex/rxjs/dist/cjs/Subject'
import '@reactivex/rxjs/dist/cjs/add/operator/filter'
import '@reactivex/rxjs/dist/cjs/add/operator/concatMap'
import '@reactivex/rxjs/dist/cjs/add/observable/fromEvent'
import '@reactivex/rxjs/dist/cjs/add/observable/fromPromise'
import '@reactivex/rxjs/dist/cjs/add/operator/debounceTime'
import '@reactivex/rxjs/dist/cjs/add/operator/pluck'
import * as React from 'react'
import { render } from 'react-dom'
import X, { x } from 'xreact/lib/x'
import * as rx from 'xreact/lib/xs/rx'
import '../public/main.css'
const config = {
  apiKey: "AIzaSyDHtULsenSRDeiUPDlAISVi1YJ1gM-wcPA",
  authDomain: "gulugulu-cbf48.firebaseapp.com",
  databaseURL: "https://gulugulu-cbf48.firebaseio.com",
  projectId: "gulugulu-cbf48",
  storageBucket: "gulugulu-cbf48.appspot.com",
  messagingSenderId: "256794078216"
};
firebase.initializeApp(config);
let database = firebase.database()
const refPath = `comments/${btoa(window.location.href)}/`;
var commentsRef = database.ref(refPath);

let commentUpdate$: Subject<Comment> = new Subject
commentsRef.on('child_added', function(snapshot) {
  commentUpdate$.next(snapshot.val())

})

const h = React.createElement
interface Comment {
  text: string
  datetime: number
  y: number
}
const now = new Date().getTime()
const Bullet = React.createClass<any, any>({
  getInitialState() {
    return {
      fly: false
    }
  },
  componentDidMount() {
    let datetime = this.props.comment.datetime
    let delay = datetime > now ? 0 : this.props.comment.datetime % 5000
    setTimeout(() => this.setState({ fly: true }), delay)
  },
  render() {
    return h('p', { className: 'gulu' + (this.state.fly ? ' fly' : ''), style: { top: this.props.comment.y } }, this.props.comment.text)
  }
})

const DanmakuView = React.createClass({
  render() {
    return h('div', { className: 'danmaku' },
      this.props.comments.map((comment, key) =>
        h(Bullet, { key, comment })))
  }
})

DanmakuView.defaultProps = {
  comments: []
}
const OFFSET = 3
const inArea = comment => window.scrollY <= (comment.y + OFFSET) && window.scrollY >= (comment.y - OFFSET)
const genY = time => time % window.innerHeight + 'px'
const Danmaku = x((intent) => {
  let firstScreen = commentUpdate$
    .filter(inArea)
  let liveUpdate = commentUpdate$
    .filter(comment => comment.datetime > now)
  let onScroll = commentUpdate$
    .concatMap(comment => {
      return Observable.fromEvent(window, 'scroll')
        .filter(() => inArea(comment))
        .debounceTime(1000)
        .map(() => comment)
    })

  return {
    update$: Observable.merge(firstScreen, liveUpdate, onScroll).map((comment: Comment) => ({
      text: comment.text,
      datetime: comment.datetime,
      y: genY(comment.datetime)
    }))
      .map(update => state => ({ comments: state.comments.concat([update]) }))
  }
})(DanmakuView)

const danmakuElement = document.createElement('div')
danmakuElement.id = 'danmaku'
document.body.appendChild(danmakuElement)
render(h(X, { x: rx }, h(Danmaku)), document.querySelector('#danmaku'))
let commentAdd = commentsRef.push().set


const shotToDanmaku = document.createElement('input') as HTMLInputElement
shotToDanmaku.id = 'danmaku-input'
shotToDanmaku.className = 'danmaku-input'
shotToDanmaku.autofocus = true
shotToDanmaku.placeholder = "💬您可以在这里输入弹幕吐槽哦~"

const shotDanmakuBox = document.createElement('div') as HTMLElement
shotDanmakuBox.className = 'danmaku-box'
shotDanmakuBox.appendChild(shotToDanmaku)
document.body.appendChild(shotDanmakuBox)

Observable
  .fromEvent<KeyboardEvent>(shotToDanmaku, 'keyup')
  .filter((e) => e.keyCode === 13)
  .pluck('target', 'value')
  .concatMap(text => Observable.fromPromise(
    commentsRef.push().set({
      text,
      datetime: new Date().getTime(),
      y: window.scrollY
    })))
  .subscribe((x) => {
    shotToDanmaku.value = ''
    console.log('saved..', x)
  })
