import { renderInput } from './shoot'
import database from './db'
import '../public/main.css'
let url = document.querySelector('#direct-message-to') as HTMLInputElement
let y = document.querySelector('#direct-message-y') as HTMLInputElement

renderInput(() => database.ref(`comments/${btoa(window.location.hash.slice(1))}/`), () => y)
