import database from './db'
import { Observable } from '@reactivex/rxjs/dist/cjs/Observable'
import { Subject } from '@reactivex/rxjs/dist/cjs/Subject'
import '@reactivex/rxjs/dist/cjs/add/operator/filter'
import '@reactivex/rxjs/dist/cjs/add/operator/mergeMap'
import '@reactivex/rxjs/dist/cjs/add/observable/fromEvent'
import '@reactivex/rxjs/dist/cjs/add/observable/fromPromise'
import '@reactivex/rxjs/dist/cjs/add/operator/debounceTime'
import '@reactivex/rxjs/dist/cjs/add/operator/pluck'
import * as React from 'react'
import { render } from 'react-dom'
import X, { x } from 'xreact/lib/x'
import * as rx from 'xreact/lib/xs/rx'
import { renderInput } from './shoot'
import '../public/main.css'

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
      fly: false,
      render: true,
    }
  },
  componentDidMount() {
    let datetime = this.props.comment.datetime
    let delay = datetime > now ? 0 : this.props.comment.datetime % 5000
    setTimeout(() => this.setState({ fly: true }), delay)
    setTimeout(() => this.setState({ render: false }), 12000 + delay)
  },
  render() {
    let max = 80
    let left = this.state.fly ? `-${this.props.comment.text.length}em` : '100%'
    if (!this.state.render) return null
    return h('p', {
      className: 'gulu',
      style: {
        top: this.props.comment.y,
        left
      }
    }, this.props.comment.text)
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
const genY = time => time % (window.innerHeight - 52) + 'px'
const Danmaku = x((intent) => {
  let firstScreen = commentUpdate$
    .filter(inArea)
  let liveUpdate = commentUpdate$
    .filter(comment => comment.datetime > now)
  let onScroll = commentUpdate$
    .mergeMap(comment => {
      return Observable.fromEvent(window, 'scroll')
        .filter(({ pageY }) => pageY <= comment.y + 5 && pageY >= comment.y - 5)
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

renderInput(() => commentsRef, () => window.scrollY)
