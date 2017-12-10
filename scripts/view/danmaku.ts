import * as React from 'react'
const h = React.createElement
import { Bullet } from '../bullet'
export const DanmakuView = React.createClass({
  render() {
    return h('div', { className: 'danmaku' },
      this.props.comments.map((comment, key) =>
        h(Bullet, { key, comment })))
  }
})

DanmakuView.defaultProps = {
  comments: []
}
