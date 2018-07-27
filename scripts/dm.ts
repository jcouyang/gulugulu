import { displayInput } from './shoot'
import { reletivePos } from './utils'
import database from './db'
import '../public/main.css'
let url = document.querySelector('#direct-message-to') as HTMLInputElement
let hash = window.location.hash.slice(1)
if (hash)
  url.value = hash

displayInput(() => database.ref(`comments/${btoa(url.value)}/`), () => window.scrollY, reletivePos)
