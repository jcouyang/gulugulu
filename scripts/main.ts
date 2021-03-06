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
const refPath = `comments/${btoa(window.location.href.replace(window.location.hash, ''))}/`;
const commentsRef = database.ref(refPath);
const whenMounted = new Date().getTime()
import { firstPage, genY, pos, nearPos, reletivePos } from './utils'
let commentUpdate$: Subject<Comment> = new Subject
commentsRef.on('child_added', function(snapshot) {
    commentUpdate$.next(snapshot.val())
})
displayInput(() => commentsRef, () => window.scrollY, reletivePos)

interface Comment {
    text: string
    datetime: number
    y: number
    pos: number
}

interface CommentU {
    text: string
    datetime: number
    y: string
    pos: number
}

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

let danmakuUpdate = Observable
    .merge(firstScreen, liveUpdate, onScroll)

let switchableCommentUpdate$: Observable<Comment> = Observable.fromEvent(document.querySelector('#danmaku-enable'), 'change')
    .map(({ target }) => {
        console.log(target.checked)
        if (target.checked) {
            return danmakuUpdate as Observable<Comment>
        } else {
            return (Observable.empty() as Observable<Comment>)
        }
    }).switch()



function displayDanmakuBullets() {
    const danmakuElement = document.createElement('div')
    danmakuElement.id = 'danmaku'
    document.body.appendChild(danmakuElement)
    render(h(X, { x: rx }, h(Danmaku)), document.querySelector('#danmaku'))
}

const posit = (comment: Comment) => ({
    text: comment.text,
    datetime: comment.datetime,
    y: genY(comment.datetime),
    pos: comment.pos || comment.y * 100 / window.document.body.offsetHeight
})

const Danmaku = x((intent) => {

    return {
        update$: switchableCommentUpdate$
            .map(posit)
            .map(update => state => ({ comments: state.comments.concat([update]) }))
    }
})(DanmakuView)

displayDanmakuBullets()

displayComments(switchableCommentUpdate$.map(posit), document.querySelector('#danmaku-comments'))
