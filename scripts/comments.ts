import { Observable } from '@reactivex/rxjs/dist/cjs/Observable'
import { Subject } from '@reactivex/rxjs/dist/cjs/Subject'
import './operators'
import * as React from 'react'
import { render } from 'react-dom'
import X, { x } from 'xreact/lib/x'
import * as rx from 'xreact/lib/xs/rx'
import { genY } from './utils'
const h = React.createElement

function formatDate(unixTime) {
  let date = new Date(unixTime)
  return date.toDateString();
}

function toPosition(pos) {
  window.scrollTo(0, pos * window.document.body.offsetHeight / 100);
}

const Comment: React.SFC<any> = props => (
  h('div', {
    className: 'danmaku-comment',
    title: formatDate(props.comment.datetime)
  },
    props.comment.text,
    h('button', {
      className: 'danmaku-topos',
      title: Math.round(props.comment.pos) + '%',
      onClick: () => toPosition(props.comment.pos)
    }, "⤴")
  )
)
const CommentsView: React.SFC<any> = props => (
  h('div', { className: 'danmaku-comment-view' },
    h('h3', { title: "danmaku list" }, "弹幕列表"),
    props.comments.map((comment, key) =>
      h(Comment, { key, comment })))
)

CommentsView.defaultProps = { comments: [] }


const Comments = commentUpdate$ => x(intent$ => {
  return {
    update$: commentUpdate$.map(update => state => ({ comments: state.comments.concat([update]) }))
  }
})(CommentsView)

export function displayComments(commentUpdate$, el) {
  if (el) {
    render(h(X, { x: rx }, h(Comments(commentUpdate$))), el)
  }
}
