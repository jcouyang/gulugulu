import { renderInput } from './shoot'
import database from './db'
import '../public/main.css'
let url = document.querySelector('#direct-message-to') as HTMLInputElement
let y = document.querySelector('#direct-message-y') as HTMLInputElement

url.value = window.location.hash
window.addEventListener("hashchange", function() {
  url.value = window.location.hash
}, false);

function commentsRef() {
  let refPath = `comments/${btoa(url.value)}/`;
  return {
    db: database.ref(refPath),
    y: y
  }
}

renderInput(commentsRef)
