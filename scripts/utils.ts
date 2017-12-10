export function firstPage(comment) {
  // display danmaku in first 5% of the page
  return pos(comment) <= 5
}
export function genY(time) {
  return time % (window.innerHeight - 52) + 'px'
}

export function pos(comment) {
  return comment.pos || comment.y * 100 / window.document.body.offsetHeight
}

export function nearPos(y, comment) {
  let currentPos = y / window.document.body.offsetHeight * 100
  return currentPos <= pos(comment) + 1 && currentPos >= pos(comment) - 1
}

export function reletivePos() {
  return window.scrollY / window.document.body.offsetHeight * 100;
}
