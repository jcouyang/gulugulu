import * as React from 'react'
const h = React.createElement
import { Bullet } from '../bullet'
export const DanmakuView: React.SFC<any> = props => {
  console.log(props)
  return h('div', { className: 'danmaku' },
    props.comments.map((comment, key) => h(Bullet, { key, comment })))
}

DanmakuView.defaultProps = {
  comments: []
}
