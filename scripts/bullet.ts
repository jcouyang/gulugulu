import * as React from 'react'
const h = React.createElement
const whenMounted = new Date().getTime()
export const Bullet = React.createClass<any, any>({
  getInitialState() {
    return {
      fly: false,
      render: true,
    }
  },
  componentDidMount() {
    let datetime = this.props.comment.datetime
    let delay = datetime > whenMounted ? 0 : this.props.comment.datetime % 5000
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
