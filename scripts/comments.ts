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
const CommentsView = React.createClass({
  render() {
    return h('div', { className: 'danmaku-comment-view' },
      this.props.comments.map((comment, key) =>
        h(Comment, { key, comment })))
  }
})
CommentsView.defaultProps = { comments: [] }
const genY = time => time % (window.innerHeight - 52) + 'px'
const Comments = commentUpdate$ => x(intent$ => {
  return {
    update$: commentUpdate$.map((comment) => ({
      text: comment.text,
      datetime: comment.datetime,
      y: genY(comment.datetime),
      pos: comment.pos || comment.y * 100 / window.document.body.offsetHeight
    })).map(update => state => ({ comments: state.comments.concat([update]) }))
  }
})(CommentsView)

export function displayComments(commentUpdate$, el) {
  if (el) {
    render(h(X, { x: rx }, h(Comments(commentUpdate$))), el)
  }
}
