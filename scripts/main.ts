import database from './db'
import { Observable } from '@reactivex/rxjs/dist/cjs/Observable'
import { Subject } from '@reactivex/rxjs/dist/cjs/Subject'
import './operators'
import * as React from 'react'
import { render } from 'react-dom'
import X, { x } from 'xreact/lib/x'
import * as rx from 'xreact/lib/xs/rx'
import { displayInput } from './shoot'
import { displayComments } from './comments'
import { DanmakuView } from './view/danmaku'
import '../public/main.css'
const h = React.createElement
const refPath = `comments/${btoa(window.location.href)}/`;
const commentsRef = database.ref(refPath);
const whenMounted = new Date().getTime()
import { firstPage, genY, pos, nearPos, reletivePos } from './utils'
let commentUpdate$: Subject<Comment> = new Subject
commentsRef.on('child_added', function(snapshot) {
  commentUpdate$.next(snapshot.val())
})

interface Comment {
  text: string
  datetime: number
  y: number
  pos: number
}


function displayDanmakuBullets() {
  const danmakuElement = document.createElement('div')
  danmakuElement.id = 'danmaku'
  document.body.appendChild(danmakuElement)
  render(h(X, { x: rx }, h(Danmaku)), document.querySelector('#danmaku'))
}

const Danmaku = x((intent) => {
  let firstScreen = commentUpdate$.filter(firstPage)
  let liveUpdate = commentUpdate$
    .filter(comment => comment.datetime > whenMounted)
  let onScroll = commentUpdate$
    .mergeMap(comment => {
      return Observable.fromEvent(window, 'scroll')
        .filter(({ pageY }) => nearPos(pageY, comment))
        .throttleTime(5000)
        .map(() => comment)
    })

  return {
    update$: Observable
      .merge(firstScreen, liveUpdate, onScroll)
      .map((comment: Comment) => ({
        text: comment.text,
        datetime: comment.datetime,
        y: genY(comment.datetime)
      }))
      .map(update => state => ({ comments: state.comments.concat([update]) }))
  }
})(DanmakuView)

displayDanmakuBullets()
displayInput(() => commentsRef, () => window.scrollY, reletivePos)
displayComments(commentUpdate$, document.querySelector('#danmaku-comments'))
