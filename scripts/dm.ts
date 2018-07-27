import { displayInput } from './shoot'
import database from './db'
import '../public/main.css'
let url = document.querySelector('#direct-message-to') as HTMLInputElement
let y = document.querySelector('#direct-message-y') as HTMLInputElement
let hash = window.location.hash.slice(1)
if (hash)
  y.value = hash

displayInput(() => database.ref(`comments/${btoa(y.value)}/`), () => window.scrollY, () => parseInt(y.value))
