import React, { useState } from "react";
import html2canvas from "html2canvas";
import firebase from "firebase/app";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import { useHistory } from "react-router-dom";

//setting avatar and background
import AvatarOne from "./avatars/avatar-1-smile.js";
import AvatarTwo from "./avatars/avatar-2.js";
import AvatarThree from "./avatars/avatar-3.js";
import AvatarFour from "./avatars/avatar-4.js";
import AvatarFive from "./avatars/avatar-5.js";
import AvatarSix from "./avatars/avatar-6.js";
import AvatarSeven from "./avatars/avatar-7.js";
import AvatarEight from "./avatars/avatar-8.js";
import AvatarNine from "./avatars/avatar-9.js";
import AvatarTen from "./avatars/avatar-10.js";
import AvatarEleven from "./avatars/avatar-11.js";
import AvatarTwelve from "./avatars/avatar-12.js";

const Contact = ({ formData, navigation }) => {
	const { previous, next } = navigation;

	var [chatBg, setChatBg] = useState(0);
	var [Gifs, setBgs] = useState([
		"https://i.imgur.com/QMvoNpW.gif",
		"https://i.imgur.com/MtJMy50.gif",
		"https://i.imgur.com/arP4rT5.gif",
		"https://i.imgur.com/lqCa4Fo.gif",
		"https://i.imgur.com/IIPRolA.gif",
		"https://i.imgur.com/uTvbVKm.gif",
		"https://i.imgur.com/F6V8JBO.gif"
	]);
	var [chatAvatar, setChatAvatar] = useState(0);
	var [chatColor, setChatColor] = useState(0);
	const history = useHistory();
	/*avatar setting from chatRoom - start*/
	
	let colorArr = [
		"#FF766D",
		"#FF84D6",
		"#65D72C",
		"#7BC0FF",
		"#FFA620",
		"#BEAFFA",
		"#FAD824",
		"#55A3B5",
		"#A5FAFF",
		"#D375FF",
		"#A6FAAA",
		"#A1BCFF"
	];
	const fnAvatar = (height, width) => {
		// let avatarNum = 0
		switch (chatAvatar){
			case 0: 
				return <AvatarOne height = {height?height:'45'} width = {width? width: '45'} />
			case 1:
				return <AvatarTwo height = {height?height:'45'} width = {width? width: '45'} />
			case 2: 
				return <AvatarThree height = {height?height:'45'} width = {width? width: '45'} />
			case 3: 
				return <AvatarFour height = {height?height:'45'} width = {width? width: '45'} />
			case 4: 
				return <AvatarFive height = {height?height:'45'} width = {width? width: '45'} />
			case 5: 
				return <AvatarSix height = {height?height:'47'} width = {width? width: '45'} />
			case 6: 
				return <AvatarSeven height = {height?height:'45'} width = {width? width: '45'} />
			case 7: 
				return <AvatarEight height = {height?height:'45'} width = {width? width: '45'} />
			case 8: 
				return <AvatarNine height = {height?height:'45'} width = {width? width: '45'} />
			case 9: 
				return <AvatarTen height = {height?height:'45'} width = {width? width: '45'} />
			case 10: 
				return <AvatarEleven height = {height?height:'45'} width = {width? width: '45'} />
			case 11: 
				return <AvatarTwelve height = {height?height:'45'} width = {width? width: '45'} />
			default: 
				return null
		}
	}
 	/*avatar setting from chatRoom - end*/
	
	function copyToClipboard(txt) {
		var textField = document.createElement("textarea");
		textField.innerText = txt;
		document.body.appendChild(textField);
		textField.select();
		document.execCommand("copy");
		textField.remove();
	}
// console.log(window.getSelection.isCollapsed(true))

	var roomID = formData.roomId;
	function copyRoomID() {
		// console.log("https://hkwft.csb.app/room/" + roomID);
		copyToClipboard("https://zeri0.csb.app/room/" + roomID + `?avatarNum=${chatAvatar}&avatarColor=${chatColor}&chatBg=${chatBg}`);
		// console.log(chatBg)

		html2canvas(document.getElementById("url-preview"), {
			allowTaint: true,
			//canvas: document.getElementById('exported'),
			useCORS: true
		}).then(function (canvas) {
			//document.body.appendChild(canvas);
			//setImg(canvas.toDataURL())
			var updates = {};
			updates["/rooms/" + roomID + "/urlPreview"] = canvas.toDataURL();
			firebase.database().ref().update(updates);
		});
		const linkCopy = document.querySelector(".linkCopied");
		linkCopy.style.visibility = "visible";
		let timerID = setTimeout(() => {
			linkCopy.style.visibility = "hidden";
		}, 3000);
	}
    firebase
      .database()
      .ref("/ChatBackgrounds")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          //console.log(snapshot.val());
          var arr = Object.values(snapshot.val());
        //   console.log(arr);
          let obj = arr[Math.floor(Math.random() * arr.length)]
        //   console.log(obj);
          setBgs(arr);
        }
      });
	function joinRoom() {
		formData.bgGif = (Gifs[chatBg].url)
		history.push("/room/" + formData.roomId + `?avatarNum=${chatAvatar}&avatarColor=${chatColor}&chatBg=${chatBg}`);
		// console.log(history)
		firebase
			.database()
			.ref("rooms/" + roomID + "/")
			.update({ chatBg: chatBg })
	}
	return (
		<div className="copyLink-div" style={{ zIndex: 10 }}>
			<div className="corner">
				<svg
					className="prevIcon btnh"
					onClick={previous}
					style={{ margin: "0 18px" }}
					width="28"
					height="33"
					viewBox="0 0 30 40"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M3.31323 14.7004L15.0138 3L26.7142 14.7004"
						stroke="white"
						stroke-width="4.6751"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M3.31323 14.7004L15.0138 3L26.7142 14.7004"
						stroke="white"
						stroke-width="4.6751"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M15.3198 3.30649L15.3198 31.7791"
						stroke="white"
						stroke-width="4.6751"
						stroke-linecap="round"
					/>
					<path
						d="M15.3198 3.30649L15.3198 31.7791"
						stroke="white"
						stroke-width="4.6751"
						stroke-linecap="round"
					/>
				</svg>
				<h2 className="header2">litebub</h2>
			</div>
			<div className="form">
				<p className="header" style={{ 
						zIndex: 10
					}}
				>
					Here's the link!
					<span
						style={{
							fontSize: ".7em",
							display: "block",
							position: " relative",
							bottom: ".9vh"
						}}
					>
						{/* <br /> */}
						Lets get chatting
					</span>
				</p>
				{/* <div className="blur-bg"></div> */}
				<div>
					<div
						id="url-preview"
						style={{
							borderRadius: "50px",
							border: "2.7px solid #fff",
							background: "#000",
							backgroundImage: `url(${Gifs[chatBg].url})`,
							backgroundPosition: "center",
							backgroundSize: "cover",
							height: 325,
							width: 290,
							display: "grid",
							placeItems: "center",
							position: " relative",
							bottom: "1.8vh",
							zIndex: 10
						}}
					>
						
						<div
							className="bubble-chat speech-chat"
							style={{ position: "absolute", top: "5%" }}
						>
							<svg
								width="190"
								height="100"
								viewBox="0 0 449 186"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g filter="url(#filter0_d)">
									<path
										d="M445 117.77C445 125.635 441.856 133.177 436.26 138.739C430.665 144.3 423.075 147.425 415.161 147.425H67.1214C64.8779 147.425 62.6866 148.102 60.8342 149.367L21.4318 176.29C14.0348 181.344 4 176.047 4 167.088V31.1511C4 23.2862 7.14372 15.7433 12.7396 10.182C18.3354 4.62059 25.9251 1.49625 33.8388 1.49625H415.161C423.075 1.49625 430.665 4.62059 436.26 10.182C441.856 15.7433 445 23.2862 445 31.1511V117.77Z"
										fill="white"
									/>
									{/* </path> */}
									<g>
										<text
											x="18%"
											y="33%"
											font-family="Roboto"
											font-size="2.2em"
											font-weight="400"
											// letter-spacing=".05em"
											// text-rendering = "optimizeLegibility"
											fill="#000"
										>
											We're Chatting About:
										</text>
										<text
											x="12%"
											y="58%"
											fill="#FFA620"
											font-family="Roboto"
											font-size="2.7em"
											font-weight="700"
											letter-spacing=".05em"
											// text-rendering = "geometricPrecision"
											// shape-rendering =" crispEdges"
										>
											{formData.topic.length > 15
												? formData.topic.substring(
														0,
														15
												  ) + "..."
												: formData.topic}
										</text>
									</g>
									<path
										d="M443.32 117.77C443.32 125.186 440.356 132.3 435.076 137.547C429.796 142.795 422.633 145.744 415.161 145.744H67.1214C64.5396 145.744 62.018 146.524 59.8863 147.98L20.4839 174.902C14.2021 179.194 5.68016 174.696 5.68016 167.088V31.1511C5.68016 23.7351 8.64433 16.6208 13.924 11.3737C19.2039 6.12624 26.3673 3.17641 33.8388 3.17641H415.161C422.633 3.17641 429.796 6.12625 435.076 11.3737C440.356 16.6208 443.32 23.7351 443.32 31.1511V117.77Z"
										stroke="black"
										stroke-width="3.36032"
										stroke-linejoin="round"
									/>
								</g>

								<defs>
									<filter
										id="filter0_d"
										x="0.0666196"
										y="0.512901"
										width="448.867"
										height="184.622"
										filterUnits="userSpaceOnUse"
										color-interpolation-filters="sRGB"
									>
										<feFlood
											flood-opacity="0"
											result="BackgroundImageFix"
										/>
										<feColorMatrix
											in="SourceAlpha"
											type="matrix"
											values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
										/>
										<feOffset dy="2.95003" />
										<feGaussianBlur stdDeviation="1.96669" />
										<feColorMatrix
											type="matrix"
											values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
										/>
										<feBlend
											mode="normal"
											in2="BackgroundImageFix"
											result="effect1_dropShadow"
										/>
										<feBlend
											mode="normal"
											in="SourceGraphic"
											in2="effect1_dropShadow"
											result="shape"
										/>
									</filter>
								</defs>
							</svg>
						</div>
						<div
							// wrapped
							// ui={false}
							// crossorigin="anonymous"
							style={{
								background:colorArr[chatColor],
								position: "absolute",
								height: 50,
								width: 50,
								top: "35%",
								left: "15%",
								border: "3px solid #fff",
								borderRadius: "30px",
								// elevation: 5
							}} >
						{/* <AvatarOne/> */}
						{fnAvatar()}
						</div>
						<div
							onClick={joinRoom}
							className="btn-join-chat btnh btnOutline"
							style={{
								position: "absolute",
								top: "65%",
								backgroundColor: "#6800EC",
								justifyContent: "center",
								display: "flex",
								alignItems: "center",
								fontSize: "1.5em",
								borderRadius: 15,
								fontSize: 25,
								height: 30
							}}
						>
							Join Chat!
						</div>
					</div>
				</div>
				<div className="circular-btns noSelect" style={{ zIndex: 10 }}>
					<div className="avatarBtn" style={{ width: "50%" }}>
						<span
							style={{
								width: "35%",
								textAlign: "right"
							}}
						>
							{" "}
							Next buddy
						</span>
						<div
							onClick={() => {
								if (chatAvatar == 11) {
									setChatAvatar(0);
								} else {
									setChatAvatar(chatAvatar + 1);
									
								}
								setChatColor(Math.floor(Math.random()*12))
								// if (window.getSelection) {
									// document.selection.empty();
								// 	window.getSelection().empty()
								// }
							}}
							className="avatarBtn-icon btnh btnOutline"
							// src={Avatars[chatAvatar]}
							// alt="img"
							// height="20"
							// wrapped
							// ui={false}
							// crossorigin="anonymous"
							style={{
								height: 67,
								width: 67,
								// border:"3px solid #fff",
								borderRadius: "50%",
								background: colorArr[chatColor]
							}}
						>
							{fnAvatar('55','55')}
						</div>
					</div>
					<div className="nextGif btnh">
						<div
						className = "btnOutline"
							style={{
								height: 67,
								width: 67,
								// border:"3px solid #fff",
								borderRadius: "50%",
								background: "#A6FAAA"
						}}>
							<svg 
								width="35" 
								height="35" 
								viewBox="0 0 48 48" 
								fill="none" 
								xmlns="http://www.w3.org/2000/svg"
								onClick={() => {
									if (chatBg + 1 >= Gifs.length) {
										// console.log("if of chatBg gif btn")
										setChatBg(0);
									} else {
										setChatBg(chatBg + 1);
									}
								}}>
								<path d="M48 42.6667V5.33333C48 2.4 45.6 0 42.6667 0H5.33333C2.4 0 0 2.4 0 5.33333V42.6667C0 45.6 2.4 48 5.33333 48H42.6667C45.6 48 48 45.6 48 42.6667ZM14.6667 28L21.3333 36.0267L30.6667 24L42.6667 40H5.33333L14.6667 28Z" fill="#48BDFF" />
							</svg>
							
						{/* /> */}
						</div>
						<span
							style={{
								width: "25%",
								textAlign: "left",
								marginRight: 10,
							}}
						>
							Next GIF
						</span>
					</div>
				</div>
				<button
					className="ui circular massive  button copyHover"
					onClick={() => copyRoomID()}
					style={{
						color: "#fff",
						background:"transparent",
						transform: "translateX(2%)",
						width: "inherit",
						marginTop: ".5em",
						boxShadow: "0px 0px 0px 2px #fff inset"
						// textTransform: "uppercase"
					}}
				>
					Copy Link
				</button>

				<h3
					className="ui header linkCopied"
					style={{
						padding: "10px 18px",
						// marginTop: "15em"
					}}
				>
					link copied!
				</h3>
			</div>
		</div>
	);
};

export default Contact;
