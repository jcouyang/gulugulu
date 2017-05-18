import * as firebase from 'firebase'
import * as Rx from '@reactivex/rxjs'

const config = {
    apiKey: "AIzaSyDHtULsenSRDeiUPDlAISVi1YJ1gM-wcPA",
    authDomain: "gulugulu-cbf48.firebaseapp.com",
    databaseURL: "https://gulugulu-cbf48.firebaseio.com",
    projectId: "gulugulu-cbf48",
    storageBucket: "gulugulu-cbf48.appspot.com",
    messagingSenderId: "256794078216"
};
firebase.initializeApp(config);

let database = firebase.database()
const refPath = `comments/${encodeURIComponent(window.location.href).replace('.','%2E')}/`;
// var commentsRef = firebase.database().ref(refPath);

// commentsRef.push().set({text: 'blahblah'})

// database.ref(refPath).on('value', function(snapshot){
//     console.log(snapshot.val(),'on value')
// })
let v = database.ref(refPath).on
let on = Rx.Observable.bindCallback(database.ref(refPath).on).bind(database.ref(refPath));

on('value')
.map(x=>{
    console.log(x.val())
})
.subscribe(() => console.log('done'))
    // .filter((e)=>e.keyCode === 13)
    // .pluck('target', 'value')
    // .flatMap(value => horizon.store({
    //     id: uuid(),
    //     text: value,
    //     datetime: new Date(),
    //     y: window.scrollY,
    // }))
    // .subscribe(log('saved..'))
