import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyDxOmxKIetOsNEQ2XTZzmwEfY5apyeTum4",
    authDomain: "chatapp-cd34b.firebaseapp.com",
    databaseURL: "https://chatapp-cd34b.firebaseio.com",
    projectId: "chatapp-cd34b",
    storageBucket: "chatapp-cd34b.appspot.com",
    messagingSenderId: "881696225635"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
