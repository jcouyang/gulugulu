import { displayInput } from './shoot'
import database from './db'
import '../public/main.css'
let url = document.querySelector('#direct-message-to') as HTMLInputElement
let y = document.querySelector('#direct-message-y') as HTMLInputElement

displayInput(() => database.ref(`comments/${btoa(window.location.hash.slice(1))}/`), () => window.scrollY, () => parseInt(y.value))
