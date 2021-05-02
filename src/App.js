import React, { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./styles.css";
import firebase from "firebase/app";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MultiStepForm from "./MultiStepForm";
import ChatRoom from "./ChatRoom";

export default function App() {
  var [bgs, setbgs] = useState([])
  useEffect(() => {
    firebase
      .database()
      .ref("/backgrounds")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          // console.log(snapshot.val());
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          today = mm + "/" + dd + "/" + yyyy;
          // console.log(today);
          var arr = Object.values(snapshot.val());
          // console.log(arr);
          let obj = arr.find((o) => o.date === today);
          // console.log(obj);
          setbgs(obj);
          // console.log("saved", bgs.url);
        }
      });
  }, []);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="app">
            <div
              className="wrapper"
              style={{
                backgroundImage: "url(" + bgs.url + ")",
                opacity: 1,
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: "100vh"
              }}
            >
              <Container textAlign="center" >
                <MultiStepForm />
              </Container>
              
              <a href = {bgs.artistURL} target ="_blank" className = "artistLink">
                <span role = "img" aria-label = "camera to define artist who made the background gif">📷</span> {bgs.artist}</a>
            </div>
          </div>
        </Route>
        <Route path="/room/:id" children={<ChatRoom />}></Route>
      </Switch>
    </Router>
  );
}
