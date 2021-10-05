import React from "react";
import ReactDOM from "react-dom";
import "./css/styles.css";
import "./css/mobileRes.css";
import "./css/tabletRes.css";
import firebase from "firebase/app";

import App from "./App";

var firebaseConfig = {
  apiKey: "AIzaSyB89VmX2azNYhk8VCKhASw5_KyyG2oQiSo",
  authDomain: "litebub-d2551.firebaseapp.com",
  databaseURL: "https://litebub-d2551-default-rtdb.firebaseio.com",
  projectId: "litebub-d2551",
  storageBucket: "litebub-d2551.appspot.com",
  messagingSenderId: "1045081459060",
  appId: "1:1045081459060:web:bdb6376bf40225afa38421",
  measurementId: "G-V8M4FPN4L8"
};
firebase.initializeApp(firebaseConfig);

function ExportedApp() {
  return <App />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<ExportedApp />, rootElement);
