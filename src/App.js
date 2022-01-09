import React, { useEffect, useState, createContext } from 'react';
import './css/styles.css';
import './css/mobileRes.css';
import './css/tabletRes.css';
import firebase from 'firebase/app';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MultiStepForm from './pages/MultiStepForm';
import ChatRoom from './pages/ChatRoom';
import ErrorBoundary from './components/ErrorBoundary';

export const FormContext = createContext(null);

export default function App() {
	var [bgs, setbgs] = useState([]);
	let [formData, setFormData] = useState({
		topic: '',
		roomId: '',
		bgGif: ''
	})
	useEffect(() => {
		firebase
			.database()
			.ref('/backgrounds')
			.once('value')
			.then((snapshot) => {
				if (snapshot.val()) {
					var today = new Date();
					var dd = String(today.getDate()).padStart(2, '0');
					var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
					var yyyy = today.getFullYear();
					today = mm + '/' + dd + '/' + yyyy;
					var arr = Object.values(snapshot.val());
					let obj = arr.find((o) => o.date === today);
					setbgs(obj);
				}
			});
	}, []);
	return (
		<Router>
			<Switch>
				<FormContext.Provider
					value={{
						formData,
						setFormData
					}}
				>
					<Route exact path='/'>
						<div className='app'>

							<div
								className='wrapper'
								style={{
									backgroundImage: 'url(' + bgs.url + ')',
									opacity: 1,
									backgroundPosition: 'center',
									backgroundSize: 'cover',
									objectFit: 'cover',
								}}>
								<MultiStepForm />
								
							</div>
						</div>
						<a
							href={bgs.artistURL}
							target='_blank'
							className='artistLink' rel="noreferrer">
							<span
								role='img'
								aria-label='camera to define artist who made the background gif'>
								📷
							</span>{' '}
							{bgs.artist}
						</a>
					</Route>
					<ErrorBoundary>
						<Route path='/room/:id'>
							<ChatRoom />
						</Route>
					</ErrorBoundary>
				</FormContext.Provider>
			</Switch>
		</Router>
	);
}