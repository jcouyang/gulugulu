import * as firebase from 'firebase'
import * as Rx from '@reactivex/rxjs'
import { Subject } from '@reactivex/rxjs'
import * as React from 'react'
import { render } from 'react-dom'
import Most, { connect } from 'react-most'
import rxengine from 'react-most/lib/engine/rx'
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

let commentUpdate$: Rx.Subject<Comment> = new Rx.Subject
commentsRef.on('child_added', function(snapshot) {
  commentUpdate$.next(snapshot.val())
})

commentUpdate$.subscribe((v) => {

  console.log('done', v)
})
const h = React.createElement
interface Comment {
  text: string
  datetime: number
  y: number
}

const Bullet = React.createClass<any, any>({
  getInitialState() {
    return {
      fly: false
    }
  },
  componentDidMount() {
    let delay = this.props.comment.datetime % 10000
    console.log(delay)
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
const genY = time => time % window.innerHeight + 'px'
const Danmaku = connect((intent) => {
  return {
    update$: commentUpdate$
      .map(comment => ({
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
render(h(Most, { engine: rxengine }, h(Danmaku)), document.querySelector('#danmaku'))
// commentsRef.push().set({text: 'blahblah'})
let commentAdd = commentsRef.push().set


const shotToDanmaku = document.createElement('input') as HTMLInputElement
shotToDanmaku.id = 'danmaku-input'
shotToDanmaku.className = 'danmaku-input'
shotToDanmaku.placeholder = "您可以在这里输入弹幕吐槽哦~"
document.body.appendChild(shotToDanmaku)

Rx.Observable
  .fromEvent<KeyboardEvent>(shotToDanmaku, 'keyup')
  .filter((e) => e.keyCode === 13)
  .pluck('target', 'value')
  .flatMap(text => Rx.Observable.fromPromise(
    commentsRef.push().set({
      text,
      datetime: new Date().getTime(),
      y: window.scrollY,
    })))
  .subscribe((x) => {
    shotToDanmaku.value = ''
    console.log('saved..', x)
  })
