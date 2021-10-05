import React, { useEffect, useState } from "react";
import { Container, Grid } from "semantic-ui-react";
// import "semantic-ui-css/semantic.min.css";
import "./css/styles.css";
import "./css/mobileRes.css";
import "./css/tabletRes.css";
import firebase from "firebase/app";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MultiStepForm from "./MultiStepForm";
import ChatRoom from "./pages/ChatRoom";
import ErrorBoundary from "./components/ErrorBoundary"

export default function App() {
  var [bgs, setbgs] = useState([])
  useEffect(() => {
    firebase
      .database()
      .ref("/backgrounds")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          today = mm + "/" + dd + "/" + yyyy;
          var arr = Object.values(snapshot.val());
          let obj = arr.find((o) => o.date === today);
          setbgs(obj);
          // console.log("saved", bgs.url);
        }
      });
  }, []);
  return (
		<Router>
			<Switch>
				<Route exact path='/'>
					<div className='app'>

							<div
								className='wrapper'
								style={{
									backgroundImage: "url(" + bgs.url + ")",
									opacity: 1,
									backgroundPosition: "center",
									backgroundSize: "cover",
									objectFit: "cover",
								}}>
								<MultiStepForm />
								
							</div>
						</div>
						<a
							href={bgs.artistURL}
							target='_blank'
							className='artistLink'>
							<span
								role='img'
								aria-label='camera to define artist who made the background gif'>
								📷
							</span>{" "}
							{bgs.artist}
						</a>
				</Route>
				<ErrorBoundary>
					<Route path='/room/:id' children={<ChatRoom />}></Route>
				</ErrorBoundary>
			</Switch>
		</Router>
  );
}
