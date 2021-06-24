import React, { useState, useEffect, useCallback } from "react";
import "semantic-ui-css/semantic.min.css";
import "./styles.css";
import "./leaveRoom.css";
import "./diffRes.css";
import { useParams, useHistory } from "react-router-dom";
import firebase from "firebase/app";
import { animateScroll } from "react-scroll";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import {PageVisibility} from "react-page-visibility";
// import { Helmet } from "react-helmet";

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

const cookies = new Cookies();

const noNameGiven = () => {
  toast("Hey! Where is your Name?");
};
const avatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
//starting function
export default function ChatRoom() {
  var [isValid, setValidity] = useState(true);
  var [message, setMessageText] = useState("");
  var [messages, setMessages] = useState([]);
  var [userName, setUserName] = useState("");
  var [userNameText, setUserNameText] = useState("");
  var [mobileDevice, setDevice] = useState(false);
  var [topic, setTopic] = useState("");
  var [chatColor, setColor] = useState("");
  var [chatAvatar, setAvatar] = useState("");
  var [chatPrev, setPreview] = useState("");
  var [participants, setParticipants] = useState(0);
  var [replyingTo, setReplyingTo] = useState(0);
  var [likeColor, setlikeColor] = useState([""]);
  var [notifications, setNotification] = useState([]);
  var [leavingRoom, setislEaving] = useState(false);
  var [bgs, setbgs] = useState([]);
  // var [isSystem, setIsSystem] = useState(true);
  var [selfReply, isSelfReply] = useState(0);
  var [currMessages, setCurrMessages] = useState(0);
  var [newMessageCount, setNewMessageCount] = useState(0);
  var [thwackNotif, setThwackNotif] = useState(false);

  //history for enterNamePage
  const history = useHistory();
  const { id } = useParams();
  const useQuery = () =>{
    return new URLSearchParams(history.location.search)
  }

  useEffect(() => {
    getValidity();
    getUser();
    getUpdate();
    setDevice(detectMob());
    getCredentials();
    
  }, []);
  useEffect(() => {
    setInterval(
      animateScroll.scrollToBottom({
        containerId: "chat-area",
        duration: 700
      }),
      1000
    );
  });
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);
  useEffect(() => {
    let query = useQuery();
    let bgGifNo = 0
    if(query.get("chatBg")){
      bgGifNo = query.get("chatBg")
    }else{
      firebase.database().ref("rooms/" + id).on("value", snapshot => {
        bgGifNo = snapshot.val().chatBg
      })
    }
    
    firebase
      .database()
      .ref("/ChatBackgrounds")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          var arr = Object.values(snapshot.val());
          let obj = arr[bgGifNo]
          setbgs(obj);
        }
      });
  }, []);

  // useEffect(() => {
  //   document.addEventListener("visibilitychange",() => {
  //     if(document.visibilityState === "hidden"){
  //       console.log("hidden")
  //         // && (newMessageCount > currMessages)
  //       console.log(newMessageCount)
  //       console.log(currMessages)
  //       console.log(newMessageCount-currMessages)
  //       document.title = `(${(newMessageCount - currMessages).toString()}) Litebub`;
  //     }
  //   })
    
  // }, [currMessages, newMessageCount]);
    
  useEffect(() => {
  //   if(document.visibilityState !== "hidden"){
      firebase.database().ref("/chats/" + id).on("value", snapshot => {
        if (snapshot.val()) {
          setMessages(Object.values(snapshot.val()))
          setCurrMessages(newMessageCount)
          document.title = "Litebub"

        }
      })
  //   }
  }, [currMessages, newMessageCount])
  
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setReplyingTo(0);
    }
  },[])
  function detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }
  function getValidity() {
    firebase
      .database()
      .ref("/rooms/" + id)
      .once("value")
      .then((snapshot) => {
        var isvalidRoom = snapshot.val();
        if (isvalidRoom) {
          var currentTime = +new Date(Date.now());
          if (isvalidRoom.expiration > currentTime) {
            setValidity(true);
            setTopic(isvalidRoom.chatTopic);
            setParticipants(isvalidRoom.participantCount);
            getMessages(id);
            setPreview(isvalidRoom.urlPreview);
            setChatCredential();
            
          } else {
            setValidity(false);
          }
        } else {
          setValidity(false);
        }
      });
  }
  
  function getUser() {
    var user = cookies.get("user");
    if (user) {
      setUserName(user);
      setChatCredential();
    }
  }
  function getCredentials() {
    var Ccolor = cookies.get("chatColor");
    var cavatar = cookies.get("chatAvatar");
    setColor(Ccolor);
    setAvatar(cavatar);
  }
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
  function setChatCredential() {
    let query = new URLSearchParams(
      history.location.search)
    const rootUser = {
      qavatar: query.get('avatarNum'),
      qColor: query.get('avatarColor'),
    }
    let colorIterator = Math.floor(Math.random() * colorArr.length);
    let color = 
    rootUser.qColor?
    colorArr[parseInt(rootUser.qColor,10)]
    :colorArr[colorIterator];
    let avatarIterator = Math.floor(Math.random() * avatars.length);
    let randomAvatar = rootUser.qavatar?avatars[parseInt(rootUser.qavatar,10)]:avatars[avatarIterator];
    if (!chatColor) {
      
      setColor(color);
    }
    if (!chatAvatar) {
      
      setAvatar(randomAvatar);
    }

  }
  function getMessages(id) {
    firebase
      .database()
      .ref("/chats/" + id)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setCurrMessages(Object.keys(snapshot.val()).length)
          setNewMessageCount((Object.keys(Object.values(snapshot.val()))).length);
          animateScroll.scrollToBottom({
            containerId: "chat-area"
          });
        }
      });
      // console.log(messages.length)
  }
  function getUpdate() {
    firebase
    .database()
    .ref("thwacks/" + id + "/" + cookies.get("user") + "/")
    .on("value", snap => {
      if(snap.val()){
        let thwacks = snap.val().thwacks;
        if (thwacks >= 3) {
          console.log(thwacks)
          document.querySelector(".newRoom").style.filter = "blur(10px)";
          setThwackNotif(true);
          setTimeout(() => {
            setUserName("");
            cookies.set("user", "", { path: "/" });
          }, 3000)
        }
      }
    });
    
  }
  function onKeyPress(e) {
    if (!mobileDevice) {
      if (e.keyCode === 13 && e.shiftKey) {
        e.preventDefault();
        setMessageText((prevState) => prevState + "\n");
        // console.log(setMessageText);
      } else if (e.keyCode === 13) {
        // block enter
        e.preventDefault();
        let mid = +new Date(Date.now());
        // console.log(mid);
        if (replyingTo > 0) {
          if (selfReply > 0) {
            var path = "chats/" + id + "/" + selfReply + "/replies/" + replyingTo + "/replies/" + mid + "/"
          } else {
            var path = "chats/" + id + "/" + replyingTo + "/replies/" + mid + "/"
          }
          firebase
            .database()
            .ref(path)
            .set({
              text: message.replaceAll("/n", "//n"),
              time: mid,
              user: userName,
              color: chatColor,
              avatar: chatAvatar,
              isReply: true,
              isDeeperReply: selfReply > 0 ? true : false,
              parent: selfReply > 0 ? selfReply : replyingTo,
              mainParent: selfReply > 0 ? replyingTo : null,
              likes: 0,
              thwacks: 0
            });
        } else {
          firebase
            .database()
            .ref("chats/" + id + "/" + mid)
            .set({
              text: message.replaceAll("/n", "//n"),
              time: mid,
              user: userName,
              color: chatColor,
              avatar: chatAvatar,
              likeColor: likeColor,
              likes: 0,
              thwacks: 0
            });
        }

        setMessageText("");
        setReplyingTo(0);
        setlikeColor([""]);
        isSelfReply(0)
      }
    }
  }
  function chatAreaNotifications(msg) {
    // console.log(msg);
    let textMsg = "";
    switch (msg) {
      case "join":
        textMsg = " joined chat!";
        break;
      case "leave":
        textMsg = " left"
        break;
    }
    let mid = +new Date(Date.now());
    firebase
      .database()
      .ref("chats/" + id + "/" + mid)
      .set({
        text: textMsg,
        time: mid,
        user: msg === "join" ? userNameText : userName,
        color: chatColor,
        avatar: chatAvatar,
        // likeColor: likeColor,
        // likes: 0,
        // thwacks: 0,
        sysAdd: true
      });
  }
  function notificationMsg(notifMsg) {
    // console.log(notifMsg);
    return (
      <div
        className="msg-msg"
        style={{
          backgroundColor: "#FFF",
          boxShadow: `0 0 0 1px #000`,
          alignItems: "center",
          borderRadius:
            notifMsg.length > 100
              ? notifMsg.length / 1.25
              : 30,
          height: "17%",
          padding: notifMsg.text.length > 100 ? 10 : 0,
          paddingRight: 20,
          fontSize: ".7em"
        }}
      >
        <span className="icon" style={{
          backgroundColor: notifMsg.color,
          margin: "4px 4px 4px 6px",
          width: 25,
          height: 25,
          borderRadius: "50%"
        }}>
          {renderAvatar(notifMsg.avatar, '25', '25')}
        </span>

        <p
          style={{
            margin: "7px 0",
            whiteSpace: "pre-wrap",
          }}
        >
          {
            <>
              <span style={{
                color: notifMsg.color,
                fontWeight: "600"
              }}>
                {notifMsg.user}
              </span>
              {notifMsg.text === " got thwacked" ?
                <>
                  {notifMsg.text}
                  <svg
                    width="23"
                    height="15"
                    viewBox="0 0 15 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.8839 21.8431L12.573 16.7947L6.81582 21.398L10.4378 14.223L4.05593 8.17166L11.1602 11.4466L15.5149 2.45204L14.1079 12.2025L19.5464 9.7748L17.6357 14.0075L24.8635 19.4327L15.8225 16.0409L16.8839 21.8431Z"
                      stroke="#FF0000"
                      stroke-width="1.39649"
                    />
                  </svg>
                </> : notifMsg.text
              }
            </>
          }
        </p>
      </div>
    )
  }
  function joinChat() {
    if (userNameText.length) {
      setUserName(userNameText);
      chatAreaNotifications("join");
      setThwackNotif(false);
      // setIsSystem(true);
      cookies.set("user", userNameText, { path: "/" });
      cookies.set("chatColor", chatColor, { path: "/" });
      cookies.set("chatAvatar", chatAvatar, { path: "/" });
      // console.log(cookies.cookies)

      var updates = {};
      updates["/rooms/" + id + "/participantCount"] = participants + 1;
      firebase.database().ref().update(updates);
      // document.querySelector('.chat-container').style.filter = "blur(0px)"
    } else {
      noNameGiven();
    }
  }
  function renderAvatar(mavatar, height, width) {
    if (mavatar == 1) {
      return <AvatarOne height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 2) {
      return <AvatarTwo height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 3) {
      return <AvatarThree height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 4) {
      return <AvatarFour height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 5) {
      return <AvatarFive height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 6) {
      return <AvatarSix height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 7) {
      return <AvatarSeven height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 8) {
      return <AvatarEight height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 9) {
      return <AvatarNine height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 10) {
      return <AvatarTen height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 11) {
      return <AvatarEleven height={height ? height : '45'} width={width ? width : '45'} />;
    } else if (mavatar == 12) {
      return <AvatarTwelve height={height ? height : '45'} width={width ? width : '45'} />;
    }
  }
  function hideDisplayBtns(val) {

    const clearBtn = document.querySelector('.nameCrossBtn')
    if (val) {
      clearBtn.style.visibility = "visible"

    } else {
      clearBtn.style.visibility = "hidden"
    }
  }
  function sendMsg() {
    let mid = +new Date(Date.now());
    // console.log(mid);
    if (replyingTo > 0) {
      if (selfReply > 0) {
        var path = "chats/" + id + "/" + selfReply + "/replies/" + replyingTo + "/replies/" + mid + "/"
      } else {
        var path = "chats/" + id + "/" + replyingTo + "/replies/" + mid + "/"
      }
      firebase
        .database()
        .ref(path)
        .set({
          text: message.replaceAll("/n", "//n"),
          time: mid,
          user: userName,
          color: chatColor,
          avatar: chatAvatar,
          isReply: true,
          isDeeperReply: selfReply > 0 ? true : false,
          parent: selfReply > 0 ? selfReply : replyingTo,
          mainParent: selfReply > 0 ? replyingTo : null,
          likes: 0,
          thwacks: 0
        });
    } else {
      firebase
        .database()
        .ref("chats/" + id + "/" + mid)
        .set({
          text: message.replaceAll("/n", "//n"),
          time: mid,
          user: userName,
          color: chatColor,
          avatar: chatAvatar,
          likeColor: likeColor,
          likes: 0,
          thwacks: 0
        });
    }

    setMessageText("");
    setReplyingTo(0);
    setlikeColor([""]);
    isSelfReply(0)
  }
  function reply(item, isSelf) {
    setReplyingTo(item.time);
    isSelfReply(isSelf ? isSelf.time : 0)
    document.querySelector(".message-input").focus();
    // console.log(item);
    //here i am setting the id of the message
    //user replying to
    //we will pass the id from where user clicks
  }
  function likeMsg(item) {
    // console.log(chatColor);
    console.log(item.isDeeperReply, item.isReply)
    if (item.likeCount) {
      var prevD = Object.values(item.likeCount).includes(userName);
      var prev = Object.values(item.likeCount);
    } else {
      var prev = [];
    }
    console.log(prevD)
    if (prevD) {
      if (item.isReply && !item.isDeeperReply) {
        firebase
          .database()
          .ref(
            "chats/" + id + "/" + item.parent + "/replies/" + item.time + "/"
          )
          .update({
            likeColor: item.prevlikeColor ? item.prevlikeColor : "transparent",
            likes: item.likes - 1
          });

        var filteredAry = prev.filter((e) => e !== userName);
        firebase
          .database()
          .ref(
            "chats/" + id + "/" + item.parent + "/replies/" + item.time + "/"
          )
          .update({ likeCount: filteredAry });
      } else if (item.isDeeperReply) {
        firebase
          .database()
          .ref(
            "chats/" + id + "/" + item.parent + "/replies/" + item.mainParent + "/replies/" + item.time + "/"
          )
          .update({
            likeColor: item.prevlikeColor ? item.prevlikeColor : "transparent",
            likes: item.likes - 1
          });

        var filteredAry = prev.filter((e) => e !== userName);
        // console.log(filteredAry);
        firebase
          .database()
          .ref(
            "chats/" + id + "/" + item.parent + "/replies/" + item.mainParent + "/replies/" + item.time + "/"
          )
          .update({ likeCount: filteredAry });
      } else {
        firebase
          .database()
          .ref("chats/" + id + "/" + item.time)
          .update({
            likeColor: item.prevlikeColor ? item.prevlikeColor : "transparent",
            likes: item.likes - 1
          });

        var filteredAry = prev.filter((e) => e !== userName);
        firebase
          .database()
          .ref("chats/" + id + "/" + item.time)
          .update({ likeCount: filteredAry });
      }
    } else {
      if (item.isReply && !item.isDeeperReply) {
        firebase
          .database()
          .ref(
            "chats/" + id + "/" + item.parent + "/replies/" + item.time + "/"
          )
          .update({
            likeColor: chatColor,
            likes: item.likes + 1,
            prevlikeColor: item.likeColor ? item.likeColor : "transparent"
          });

        firebase
          .database()
          .ref(
            "chats/" + id + "/" + item.parent + "/replies/" + item.time + "/"
          )
          .update({ likeCount: { ...prev, userName } });
      } else if (item.isDeeperReply) {
        firebase
          .database()
          .ref(
            "chats/" + id + "/" + item.parent + "/replies/" + item.mainParent + "/replies/" + item.time + "/"
          )
          .update({
            likeColor: chatColor,
            likes: item.likes + 1,
            prevlikeColor: item.likeColor ? item.likeColor : "transparent"
          });
        firebase
          .database()
          .ref(
            "chats/" + id + "/" + item.parent + "/replies/" + item.mainParent + "/replies/" + item.time + "/"
          )
          .update({ likeCount: { ...prev, userName } });
      } else {
        firebase
          .database()
          .ref("chats/" + id + "/" + item.time)
          .update({
            likeColor: chatColor,
            likes: item.likes + 1,
            prevlikeColor: item.likeColor ? item.likeColor : "transparent"
          });

        firebase
          .database()
          .ref("chats/" + id + "/" + item.time)
          .update({ likeCount: { ...prev, userName } });
      }
    }
  }

  function thwackMsg(item) {
    if (userName !== item.user) {
      if (item.thwacks) {
        var prevD = Object.values(item.thwacksCount).includes(userName);
        var prev = Object.values(item.thwacksCount);
        // console.log(prevD)
        // console.log(prev)
      }
      else {
        var prev = [];
        firebase
          .database()
          .ref("thwacks/" + id + "/"+ item.user +"/")
          .set({
              thwacks: item.thwacks
          })
      }
      if (prevD) {
        console.log("remove thwack")
        if (item.isReply && !item.isDeeperReply) {
          var filteredAry = prev.filter((e) => e !== userName);
          firebase
            .database()
            .ref(
              "chats/" + id + "/" + item.parent + "/replies/" + item.time + "/"
            )
            .update({ thwacksCount: filteredAry, thwacks: item.thwacks - 1 });
        } else if (item.isDeeperReply) {

          var filteredAry = prev.filter((e) => e !== userName);
          // console.log(filteredAry);
          firebase
            .database()
            .ref(
              "chats/" + id + "/" + item.parent + "/replies/" + item.mainParent + "/replies/" + item.time + "/"
            )
            .update({ thwacksCount: filteredAry, thwacks: item.thwacks - 1 });
        } else {

          var filteredAry = prev.filter((e) => e !== userName);
          firebase
            .database()
            .ref("chats/" + id + "/" + item.time)
            .update({ thwacksCount: filteredAry, thwacks: item.thwacks - 1 });
        }
        firebase
          .database()
          .ref("thwacks/" + id + "/" + item.user + "/")
          .update({
            thwacks: item.thwacks - 1
          })
      } else {
        // console.log("add thwack")
        if (item.isReply && !item.isDeeperReply) {
          var filteredAry = prev.filter((e) => e !== userName);
          firebase
            .database()
            .ref(
              "chats/" + id + "/" + item.parent + "/replies/" + item.time + "/"
            )
            .update({
              thwacksCount: { ...prev, userName },
              thwacks: item.thwacks + 1
            });
        } else if (item.isDeeperReply) {

          var filteredAry = prev.filter((e) => e !== userName);
          firebase
            .database()
            .ref(
              "chats/" + id + "/" + item.parent + "/replies/" + item.mainParent + "/replies/" + item.time + "/"
            )
            .update({
              thwacksCount: { ...prev, userName },
              thwacks: item.thwacks + 1
            });
        } else {

          var filteredAry = prev.filter((e) => e !== userName);
          firebase
            .database()
            .ref("chats/" + id + "/" + item.time)
            .update({
              thwacksCount: { ...prev, userName },
              thwacks: item.thwacks + 1
            });
          
        }
        firebase
          .database()
          .ref("thwacks/" + id + "/" + item.user + "/")
          .update({
            thwacks: item.thwacks + 1
          })
        
        let mid = +new Date(Date.now());
        firebase
          .database()
          .ref("chats/" + id + "/" + mid)
          .set({
            text: " got thwacked",
            time: mid,
            user: item.user,
            color: item.color,
            avatar: item.avatar,
            likes: 0,
            thwacks: 0,
            sysAdd: true
          });
      }
      getUpdate();
    } else {
      return;
    }

  }
   const setMessageInput = (value) => {
    // console.log(value);
    setMessageText(value.target.value);
  };
  function copyToClipboard(txt) {
    var textField = document.createElement("textarea");
    textField.innerText = txt;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  function copyRoomID() {
    // console.log("https://nz45o.csb.app/room/" + id);
    copyToClipboard("https://dlblk.csb.app/room/" + id);
    const linkCopy = document.querySelector(".linkCopied");
		linkCopy.style.visibility = "visible";
		let timerID = setTimeout(() => {
			linkCopy.style.visibility = "hidden";
		}, 2000);
  }
  function replyingWhom(id) {
    if (selfReply > 0) {
      for (var i in messages) {
        if (messages[i].time === selfReply) {
          for (var n in messages[i].replies) {
            if (messages[i].replies[n].time === replyingTo) {
              return messages[i].replies[n].user;
              break;
            }
          }
        }
      }
    } else {
      for (var i in messages) {
        if (messages[i].time == id) {
          return messages[i].user;
          break;
        }
      }
    }
  }
  function replyingColor(id) {
    if (selfReply > 0) {
      for (var i in messages) {
        if (messages[i].time === selfReply) {
          for (var n in messages[i].replies) {
            if (messages[i].replies[n].time === replyingTo) {
              return messages[i].replies[n].color;
              break;
            }
          }
        }
      }
    } else {
      for (var i in messages) {
        if (messages[i].time == id) {
          return messages[i].color;
          break;
        }
      }
    }
  }
  const displayEnterBtn = () => {
    if (message) {
      return "visible";
    } else {
      return "hidden";
    }
  };
  function leaveRoom() {
		document.querySelector(".newRoom").style.filter = "blur(10px)";
		setislEaving(true);
	}
  function leaveQuote(){
    var qarr = ["is this goodbye?", "exit noisily?", "get me out of here?", "leave chat?", "is this the end?","run away?"];
    var rand = qarr[Math.floor(Math.random() * qarr.length)];
    return rand;
  }
  if (isValid) { 
    if (userName) {
      return (
        <div 
          class="roomContainer"
          style = {{
					  display: "flex",
            justifyContent: "center",
            width: "100vw"
				  }}>
					{leavingRoom ? (
            <div>
              <div className = "blackBg" onClick = {() => {
                setislEaving(false);
                document.querySelector(".newRoom").style.filter = "blur(0px)";
              }}></div>
						<div
							className="solDiv"
							style={{
								filter: "blur(0)",
								position: "absolute",
                zIndex: 50,
                // border: "2px solid #fff"
							}}
						>
							<h1>{leaveQuote()}</h1>
							<div className="btnsHolder">
								<button
									style={{
										fontSize: 20,
										margin: 0,
										borderTopLeftRadius: 0,
										borderBottomLeftRadius: 0
									}}
									className=" ui button btnStay"
									onClick={() => {
										setislEaving(false);
										document.querySelector(
											".newRoom"
										).style.filter = "blur(0px)";
									}}
								>
									STAY
								</button>
								<button
									style={{ fontSize: 20, margin: 0 }}
									className=" ui button btnYes"
									onClick={() => {
										setUserName("");
                    chatAreaNotifications("leave")
										setislEaving(false);
										document.querySelector(
											".newRoom"
										).style.filter = "blur(0px)";
									}}
								>
									YES
								</button>
							</div>
						</div>
            </div>
					) : null}
          {thwackNotif ? (
            <div>
              <div className="blackBg"></div>
              <div
                className="solDiv"
                style={{
                  filter: "blur(0)",
                  position: "absolute",
                  zIndex: 50,
                  height: "25%",
                  display: "flex",
                  flexDirection: "column",
                  
                  justifyContent: "center"
                  // border: "2px solid #fff"
                }}
              >
                <p
                  style={{
                    fontSize: "1.5em",
                  // border:"2px solid #000",
                  // height:"10%"
                  }}>you've been 
                  <span style={{
                    // border:"1px solid #000"
                    }}>
                    <svg
                      width="25"
                      height="23"
                      viewBox="0 0 30 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.8839 21.8431L12.573 16.7947L6.81582 21.398L10.4378 14.223L4.05593 8.17166L11.1602 11.4466L15.5149 2.45204L14.1079 12.2025L19.5464 9.7748L17.6357 14.0075L24.8635 19.4327L15.8225 16.0409L16.8839 21.8431Z"
                        stroke= "#FF2020"
                        stroke-width="1.39649"
                      />
                    </svg>
                  </span>  
                  3 times</p>
                <p style={{
                  fontSize:"2.5em",
                  fontWeight:"bold",
                  // border:"2px solid #000",
                }}>Be kind in the future.</p>
                <span style={{ 
                  color: "#AAA", 
                  fontWeight: "bold",
                  fontSize: "1.3em"
                  // border: "2px solid #000"
                  }}>goodbye</span>
              </div>
            </div>
          ) : null}
					<div
						style={{ backgroundColor: "white", width: "100%" }}
						className="newRoom"
					>
						{/* start */}
						<div className="rBtns">
							<div
								onClick={() => {
									leaveRoom();
								}}
								className="crossSvg"
							>
								<svg
									width="100"
									height="100"
									viewBox="0 0 119 119"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="copy"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M80.5796 38.4536C78.8385 36.7125 76.0153 36.7127 74.2739 38.4541L59.5672 53.1608L45.1429 38.7365C43.4018 36.9954 40.5786 36.9956 38.8371 38.737C37.0957 40.4785 37.0955 43.3017 38.8366 45.0428L53.2609 59.4671L38.5533 74.1747C36.8119 75.9162 36.8116 78.7394 38.5528 80.4805C40.2939 82.2216 43.1171 82.2214 44.8585 80.48L59.5661 65.7724L73.9932 80.1995C75.7344 81.9406 78.5576 81.9404 80.299 80.1989C82.0404 78.4575 82.0407 75.6343 80.2995 73.8932L65.8724 59.4661L80.5791 44.7594C82.3205 43.0179 82.3208 40.1948 80.5796 38.4536Z"
										fill="#EDEDED"
									/>
								</svg>
							</div>

            <div
              style={{ position: "absolute", height: 100, left: 15 }}
              
              className="copySvg"
            >
              <svg
                width="75"
                height="75"
                viewBox="0 0 47 94"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="copy"
                onClick={() => {
                  copyRoomID();
                }}
              >
                <path
                  d="M23.5 8.93C31.537 8.93 38.07 15.463 38.07 23.5L38.07 42.3L47 42.3L47 23.5C47 10.528 36.472 -4.60193e-07 23.5 -1.02722e-06C10.528 -1.59424e-06 -4.60193e-07 10.528 -1.02722e-06 23.5L-1.84899e-06 42.3L8.93 42.3L8.93 23.5C8.93 15.463 15.463 8.93 23.5 8.93ZM18.8 28.2L18.8 65.8L28.2 65.8L28.2 28.2L18.8 28.2ZM47 70.5L47 51.7L38.07 51.7L38.07 70.5C38.07 78.537 31.537 85.07 23.5 85.07C15.463 85.07 8.93 78.537 8.93 70.5L8.93 51.7L-2.25988e-06 51.7L-3.08165e-06 70.5C-3.64868e-06 83.472 10.528 94 23.5 94C36.472 94 47 83.472 47 70.5Z"
                  fill="#EDEDED"
                />
              </svg>
              
            </div>
              <h3
          className="ui header linkCopied lcChatRoom"
          style = {{
            padding: "10px 18px",
            border: "2px solid #000"
          }}
				>
					link copied!
				</h3>
          </div>
          {/* end */}
          <div className="chat-container">
            <h3 className="chat-topic" style={{ padding: "1em 0" }}>
              litebub
              <span className="chatting-about" style={{ padding: "0 5px" }}>
                chatting about <span className="topic">{topic}</span>
              </span>
            </h3>
            <div
              id="chat-area"
              style={{
                height: (window.innerHeight * 72) / 100,
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
            >
              <ToastContainer position="bottom-right" autoClose={5000} />
              {messages.map((item) => {
                // console.log(item.text)
                return (
                  <div className="chatContainer">
                    <div className="msg-container">
                      <p className="msg-user-name" style={{ marginTop: "5px" }}>
                        {item.user}
                      </p>
                      {item.sysAdd?notificationMsg(item):
                      <div
                        className="msg-msg"
                        style={{
                          alignItems: "center",
                          borderRadius:
                            item.text.length > 100
                              ? item.text.length / 1.25
                              : 30,
                          padding: item.text.length > 100 ? 10 : 0,
                          paddingRight: 20,
                          backgroundColor: item.color
                        }}
                      >
                        <span className="icon">
                          {renderAvatar(item.avatar, '45', '45')}
                        </span>

                          <p
                            style={{
                              margin: "7px 0"
                            }}
                          >
                            {item.text}
                          </p>
                      </div>
                      } 
                      
                      {!item.sysAdd?
                        <div className="msg-btn-container">
                          <div
                            onClick={() => reply(item)}
                            className="btnRContainer"
                            style={{ marginLeft: ".3vw" }}
                          >
                            <svg
                              className="btnR"
                              width="27"
                              height="14"
                              viewBox="0 0 29 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g style={{ mixBlendMode: "multiply" }}>
                                <path
                                  d="M24.5734 6.88871L22.2171 4.58349C21.7831 4.15885 21.7831 3.47034 22.2171 3.04569C22.6512 2.62105 23.3549 2.62105 23.789 3.04569L28.9047 8.05064C28.9651 8.14161 29 8.24868 29 8.36328C29 8.47867 28.9647 8.58642 28.9035 8.67778L23.789 13.6815C23.3549 14.1062 22.6512 14.1062 22.2171 13.6815C21.7831 13.2569 21.7831 12.5684 22.2171 12.1437L25.0315 9.39032H18.1522C17.367 9.4461 16.5845 9.30985 15.8045 8.98157C14.5491 8.43948 13.5316 7.37688 12.7518 5.7937L12.2018 4.5865C11.7512 3.64586 11.1939 3.04117 10.5299 2.7724C10.203 2.63189 9.88274 2.55001 9.56921 2.52677C9.56831 2.52671 9.56754 2.5274 9.56754 2.52828C9.56754 2.52913 9.56685 2.52981 9.56598 2.52981H1.29291C0.578857 2.52981 0 1.96349 0 1.2649C0 0.566324 0.578857 0 1.29291 0H9.56754C10.2632 0.00304185 10.9572 0.155922 11.6498 0.458577C12.8347 0.97214 13.7805 1.89816 14.487 3.23665L15.3214 4.98336C15.7562 5.84973 16.2906 6.41119 16.9244 6.66773C17.1436 6.75643 17.3625 6.8188 17.5811 6.85476L17.5823 6.85524C17.5831 6.85576 17.5836 6.85663 17.5836 6.8576C17.5836 6.85919 17.5849 6.86049 17.5865 6.86049H17.6151C17.6167 6.86049 17.6183 6.86061 17.6199 6.86084C17.78 6.8849 17.94 6.89481 18.0998 6.89057L18.1003 6.89041L18.1008 6.88964C18.1008 6.88913 18.1012 6.88871 18.1017 6.88871H24.5734Z"
                                  fill="#DDDDDD"
                                />
                              </g>
                            </svg>
                          </div>
                          <div
                            onClick={() => likeMsg(item)}
                            className="btnLContainer"
                          >
                            <svg
                              className="btnL"
                              width="18"
                              height="17"
                              viewBox="0 0 20 19"
                              fill={
                                item.likeColor == "" || !item.likeColor ? "none" : item.likeColor
                              }
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.87348 2.61469C8.73638 1.35561 10.5945 1.35562 11.4574 2.61469L12.8734 4.68075C13.1558 5.09292 13.5718 5.39511 14.0511 5.5364L16.4536 6.24461C17.9177 6.6762 18.4919 8.44339 17.5611 9.65312L16.0337 11.6382C15.729 12.0343 15.5701 12.5232 15.5838 13.0227L15.6527 15.5265C15.6947 17.0523 14.1914 18.1445 12.7532 17.633L10.3933 16.7938C9.9225 16.6264 9.40838 16.6264 8.93758 16.7938L6.57764 17.633C5.13948 18.1445 3.63622 17.0523 3.67819 15.5265L3.74705 13.0227C3.76079 12.5232 3.60192 12.0343 3.29721 11.6382L1.76982 9.65312C0.839026 8.44338 1.41322 6.6762 2.87732 6.24461L5.27981 5.5364C5.7591 5.39511 6.17504 5.09292 6.45752 4.68075L7.87348 2.61469Z"
                                stroke={
                                  item.likeColor == "" || !item.likeColor
                                    ? "#DBDBDB"
                                    : item.likeColor
                                }
                                stroke-width="2"
                              />
                            </svg>
                          </div>
                          {/* {console.log(item.thwacks)} */}
                          <div
                            onClick={() => thwackMsg(item)}
                            className="btnTContainer"
                          >
                            <svg
                              className="btnT"
                              width="25"
                              height="27"
                              viewBox="0 0 25 27"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.8839 21.8431L12.573 16.7947L6.81582 21.398L10.4378 14.223L4.05593 8.17166L11.1602 11.4466L15.5149 2.45204L14.1079 12.2025L19.5464 9.7748L17.6357 14.0075L24.8635 19.4327L15.8225 16.0409L16.8839 21.8431Z"
                                stroke={item.thwacks > 0 ? "#FF2020" : "#DBDBDB"}
                                stroke-width="1.39649"
                              />
                            </svg>
                          </div>
                        </div>: null}
                        {/* {item.thwacks >= 3?thwackComponent():null} */}
                      
                      {/* end */}
                    </div>
                    {item.replies
                      ? Object.values(item.replies).map((itm) => {
                          return (
                            <div>
                              <div
                                className="msg-container"
                                style={{ marginLeft: 50 }}
                              >
                                <p
                                  className="msg-user-name"
                                  style={{ marginTop: "5px" }}
                                >
                                  {itm.user}
                                </p>
                                {/* start */}
                                <div
                                  className="msg-msg"
                                  style={{
                                    alignItems: "center",
                                    borderRadius:
                                      itm.text.length > 100
                                        ? itm.text.length / 1.25
                                        : 30,
                                    padding: itm.text.length > 100 ? 10 : 0,
                                    paddingRight: 20,
                                    backgroundColor: itm.color
                                  }}
                                >
                                  <span className="icon">
                                    {renderAvatar(itm.avatar,'45','45')}
                                  </span>

                                  {itm.text.split("//n").map((itm) => (
                                    <p
                                      style={{
                                        margin: "7px 0"
                                      }}
                                    >
                                      {itm}
                                      {/* {console.log(item)} */}
                                    </p>
                                  ))}
                                </div>
                                {/* <button
                                className="ui circular"
                                onClick={() => reply(item)}
                              ></button> */}
                                <div
                                  className="msg-btn-container"
                                  style={{ marginLeft: ".4vw" }}
                                >
                                  <div
                            onClick={() => reply(itm, item)}
                            className="btnRContainer"
                            style={{ marginLeft: ".3vw" }}
                          >
                            <svg
                              className="btnR"
                              width="27"
                              height="14"
                              viewBox="0 0 29 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g style={{ mixBlendMode: "multiply" }}>
                                <path
                                  d="M24.5734 6.88871L22.2171 4.58349C21.7831 4.15885 21.7831 3.47034 22.2171 3.04569C22.6512 2.62105 23.3549 2.62105 23.789 3.04569L28.9047 8.05064C28.9651 8.14161 29 8.24868 29 8.36328C29 8.47867 28.9647 8.58642 28.9035 8.67778L23.789 13.6815C23.3549 14.1062 22.6512 14.1062 22.2171 13.6815C21.7831 13.2569 21.7831 12.5684 22.2171 12.1437L25.0315 9.39032H18.1522C17.367 9.4461 16.5845 9.30985 15.8045 8.98157C14.5491 8.43948 13.5316 7.37688 12.7518 5.7937L12.2018 4.5865C11.7512 3.64586 11.1939 3.04117 10.5299 2.7724C10.203 2.63189 9.88274 2.55001 9.56921 2.52677C9.56831 2.52671 9.56754 2.5274 9.56754 2.52828C9.56754 2.52913 9.56685 2.52981 9.56598 2.52981H1.29291C0.578857 2.52981 0 1.96349 0 1.2649C0 0.566324 0.578857 0 1.29291 0H9.56754C10.2632 0.00304185 10.9572 0.155922 11.6498 0.458577C12.8347 0.97214 13.7805 1.89816 14.487 3.23665L15.3214 4.98336C15.7562 5.84973 16.2906 6.41119 16.9244 6.66773C17.1436 6.75643 17.3625 6.8188 17.5811 6.85476L17.5823 6.85524C17.5831 6.85576 17.5836 6.85663 17.5836 6.8576C17.5836 6.85919 17.5849 6.86049 17.5865 6.86049H17.6151C17.6167 6.86049 17.6183 6.86061 17.6199 6.86084C17.78 6.8849 17.94 6.89481 18.0998 6.89057L18.1003 6.89041L18.1008 6.88964C18.1008 6.88913 18.1012 6.88871 18.1017 6.88871H24.5734Z"
                                  fill="#DDDDDD"
                                />
                              </g>
                            </svg>
                          </div>
                                  <div
                                    onClick={() => likeMsg(itm)}
                                    className="btnL"
                                  >
                                    <svg
                                      className="btnL"
                                      width="18"
                                      height="17"
                                      viewBox="0 0 20 19"
                                      style={{
                                        fill: itm.likeColor == "" || !itm.likeColor ? "none" : itm.likeColor
                                        
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.87348 2.61469C8.73638 1.35561 10.5945 1.35562 11.4574 2.61469L12.8734 4.68075C13.1558 5.09292 13.5718 5.39511 14.0511 5.5364L16.4536 6.24461C17.9177 6.6762 18.4919 8.44339 17.5611 9.65312L16.0337 11.6382C15.729 12.0343 15.5701 12.5232 15.5838 13.0227L15.6527 15.5265C15.6947 17.0523 14.1914 18.1445 12.7532 17.633L10.3933 16.7938C9.9225 16.6264 9.40838 16.6264 8.93758 16.7938L6.57764 17.633C5.13948 18.1445 3.63622 17.0523 3.67819 15.5265L3.74705 13.0227C3.76079 12.5232 3.60192 12.0343 3.29721 11.6382L1.76982 9.65312C0.839026 8.44338 1.41322 6.6762 2.87732 6.24461L5.27981 5.5364C5.7591 5.39511 6.17504 5.09292 6.45752 4.68075L7.87348 2.61469Z"
                                        stroke={
                                          itm.likeColor == "" || !itm.likeColor
                                            ? "#DBDBDB"
                                            : itm.likeColor
                                        }
                                        stroke-width="2"
                                      />
                                    </svg>
                                  </div>
                                  <div
                                    onClick={() => thwackMsg(itm)}
                                    className="btnT"
                                  >
                                    <svg
                                      width="25"
                                      height="27"
                                      viewBox="0 0 25 27"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M16.8839 21.8431L12.573 16.7947L6.81582 21.398L10.4378 14.223L4.05593 8.17166L11.1602 11.4466L15.5149 2.45204L14.1079 12.2025L19.5464 9.7748L17.6357 14.0075L24.8635 19.4327L15.8225 16.0409L16.8839 21.8431Z"
                                        stroke={
                                          itm.thwacks > 0
                                            ? "#FF2020"
                                            : "#DBDBDB"
                                        }
                                        stroke-width="1.39649"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              {itm.replies
                      ? Object.values(itm.replies).map((item) => {
                          return (
                            <div>
                              <div
                                className="msg-container"
                                style={{ marginLeft: 80 }}
                              >
                                <p
                                  className="msg-user-name"
                                  style={{ marginTop: "5px" }}
                                >
                                  {item.user}
                                </p>
                                {/* start */}
                                <div
                                  className="msg-msg"
                                  style={{
                                    alignItems: "center",
                                    borderRadius:
                                      item.text.length > 100
                                        ? item.text.length / 1.25
                                        : 30,
                                    padding: item.text.length > 100 ? 10 : 0,
                                    paddingRight: 20,
                                    backgroundColor: item.color
                                  }}
                                >
                                  <span className="icon">
                                    {renderAvatar(item.avatar,'45','45')}
                                  </span>

                                  {item.text.split("//n").map((item) => (
                                    <p
                                      style={{
                                        margin: "7px 0"
                                      }}
                                    >
                                      {item}
                                      {/* {console.log(item)} */}
                                    </p>
                                  ))}
                                </div>
                                {/* <button
                                className="ui circular"
                                onClick={() => reply(item)}
                              ></button> */}
                                <div
                                  className="msg-btn-container"
                                  style={{ marginLeft: ".4vw" }}
                                >
                                  <div
                                    onClick={() => likeMsg(item)}
                                    className="btnL"
                                  >
                                    <svg
                                      className="btnL"
                                      width="18"
                                      height="17"
                                      viewBox="0 0 20 19"
                                      style={{
                                        fill: item.likeColor == "" || !item.likeColor ? "none" : item.likeColor
                                        
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.87348 2.61469C8.73638 1.35561 10.5945 1.35562 11.4574 2.61469L12.8734 4.68075C13.1558 5.09292 13.5718 5.39511 14.0511 5.5364L16.4536 6.24461C17.9177 6.6762 18.4919 8.44339 17.5611 9.65312L16.0337 11.6382C15.729 12.0343 15.5701 12.5232 15.5838 13.0227L15.6527 15.5265C15.6947 17.0523 14.1914 18.1445 12.7532 17.633L10.3933 16.7938C9.9225 16.6264 9.40838 16.6264 8.93758 16.7938L6.57764 17.633C5.13948 18.1445 3.63622 17.0523 3.67819 15.5265L3.74705 13.0227C3.76079 12.5232 3.60192 12.0343 3.29721 11.6382L1.76982 9.65312C0.839026 8.44338 1.41322 6.6762 2.87732 6.24461L5.27981 5.5364C5.7591 5.39511 6.17504 5.09292 6.45752 4.68075L7.87348 2.61469Z"
                                        stroke={
                                          item.likeColor == "" || !item.likeColor
                                            ? "#DBDBDB"
                                            : item.likeColor
                                        }
                                        stroke-width="2"
                                      />
                                    </svg>
                                  </div>
                                  <div
                                    onClick={() => thwackMsg(item)}
                                    className="btnT"
                                  >
                                    <svg
                                      width="25"
                                      height="27"
                                      viewBox="0 0 25 27"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M16.8839 21.8431L12.573 16.7947L6.81582 21.398L10.4378 14.223L4.05593 8.17166L11.1602 11.4466L15.5149 2.45204L14.1079 12.2025L19.5464 9.7748L17.6357 14.0075L24.8635 19.4327L15.8225 16.0409L16.8839 21.8431Z"
                                        stroke={
                                          item.thwacks > 0
                                            ? "#FF2020"
                                            : "#DBDBDB"
                                        }
                                        stroke-width="1.39649"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                              : null} </div>
                        );
                      })
                      : null}

                  </div>
                );
              })}
              </div>

            <div id="input-area">
              <div
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0)"
                }}
              >
                <div
                  id="replyBox"
                  style={{
                    opacity: replyingTo > 0 ? 1 : 0,
                    marginLeft: "15%",
                    marginBottom: 10,
                    backgroundColor:
                      replyingTo > 0 ? "white" : "rgba(255, 255, 255, 0)"
                  }}
                  className="replyEl"
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setReplyingTo(0)}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M22.8626 11.4313C22.8626 17.7447 17.7447 22.8626 11.4313 22.8626C5.11798 22.8626 0 17.7447 0 11.4313C0 5.11798 5.11798 0 11.4313 0C17.7447 0 22.8626 5.11798 22.8626 11.4313ZM14.3809 7.07583C14.741 6.7157 15.3249 6.71565 15.6849 7.07573C16.045 7.4358 16.0449 8.01964 15.6848 8.37977L12.6434 11.4212L15.6268 14.4046C15.9869 14.7647 15.9868 15.3486 15.6267 15.7087C15.2666 16.0688 14.6828 16.0689 14.3227 15.7088L11.3392 12.7254L8.29776 15.7668C7.93763 16.127 7.35379 16.127 6.99372 15.7669C6.63365 15.4069 6.6337 14.823 6.99383 14.4629L10.0353 11.4214L7.05225 8.43836C6.69218 8.07829 6.69223 7.49445 7.05236 7.13432C7.41249 6.77419 7.99633 6.77414 8.3564 7.13421L11.3395 10.1173L14.3809 7.07583Z"
                      fill={replyingColor()}
                    />
                  </svg>
                  <p
                    style={{
                      alignSelf: "flex-end",
                      color: replyingColor(replyingTo),
                      marginHorizontal: 20
                    }}
                    className="replyTo"
                  >
                    Replying to <b>{replyingWhom(replyingTo)}</b>
                  </p>
                </div>
                <div className="in-grid">
                  <textarea
                    className="message-input"
                    placeholder="type a message..."
                    onKeyDown={onKeyPress}
                    value={message}
                    onChange={setMessageInput}
                    style={{
                      fontSize: "1.2em",
                      height: "3.5em",
                      lineHeight: "1.5em",
                      borderColor: replyingColor(),
                      marginBottom: 10
                    }}
                    type="text"
                  />
                  <svg
                    onClick={sendMsg}
                    className="enterBtn"
                    width="65"
                    style={{
                      visibility: displayEnterBtn(),
                      marginLeft: 10,
                      marginBottom: 5
                    }}
                    height="60"
                    viewBox="0 0 82 82"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d)">
                      <circle cx="41" cy="37" r="37" fill={chatColor} />
                      <g clip-path="url(#clip0)">
                        <path
                          d="M30.3132 34.7004L42.0138 23L53.7142 34.7004"
                          stroke="white"
                          stroke-width="4.6751"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M30.3132 34.7004L42.0138 23L53.7142 34.7004"
                          stroke="black"
                          stroke-width="4.6751"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M42.3198 23.3065L42.3198 51.7791"
                          stroke="white"
                          stroke-width="4.6751"
                          stroke-linecap="round"
                        />
                        <path
                          d="M42.3198 23.3065L42.3198 51.7791"
                          stroke="black"
                          stroke-width="4.6751"
                          stroke-linecap="round"
                        />
                      </g>
                    </g>
                    <defs>
                      <filter
                        id="filter0_d"
                        x="0.390244"
                        y="0"
                        width="81.2195"
                        height="81.2195"
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
                        <feOffset dy="3.60976" />
                        <feGaussianBlur stdDeviation="1.80488" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
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
                      <clipPath id="clip0">
                        <rect
                          width="44"
                          height="44"
                          fill="white"
                          transform="matrix(-1 0 0 1 63 15)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
              </div>
              {/* </textarea> */}
            </div>
          </div> 
        </div>
      );
    } else {
      return (
        <div>
          <div id = "inChatRoom" className="corner">
				<h2 className = "header2 btnh" onClick={() => {
            history.push("/")
          }}>litebub</h2>
			</div>
          <div className="chatBg"
              style = {{
                backgroundImage:"url(" + bgs.url + ")"
              }}
          >
          </div>
          
          <div id="new-user" style={{filter:"blur(0px)"}}>
            <div className="chatJoinBg" style = {{backgroundImage:"url(" + bgs.url + ")"}}>
              <div className="bubble-chat speech-chat">
                <svg
								width="190"
								height="100"
								viewBox="0 20 449 186"
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
										>
											{topic.length > 15
												? topic.substring(
														0,
														15
												  ) + "..."
												: topic}
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
            </div>
            <br />
            <p className="name">
              <h2>What's your Name?</h2> (for chat)
            </p>
            <br />
            <div 
            style = {{
              // border: "1px solid #000",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "99%",
              }}
              className="inputName"
            >
             
            <input
            placeholder = "John appleseed"
              className="userName-input"
              value={userNameText}
              onChange={(val) => {
                setUserNameText(val.target.value)
                hideDisplayBtns(val.target.value)
              }
            }
        />
      <svg 
        className = "nameCrossBtn"
        style = {{
          visibility: "hidden",
          margin: "0 15px ",
          // border: "1px solid #000",
        }}
        onClick={() => {
          const userInput = document.querySelector('.userName-input')
          userInput.value = ""
          setUserNameText(userInput.value)
          userInput.focus()
          hideDisplayBtns(userInput.value)
          // setChatCredential();
          if (chatAvatar > 11) {
            setAvatar(0)
          } else {
            setAvatar(chatAvatar + 1)
          }
          setColor(colorArr[Math.floor(Math.random() * colorArr.length)])
          //console.log(chatColor, colorArr[idx])
          renderAvatar(chatAvatar)
          // console.log(chatAvatar)
        }}
        width="36"
        height="30"
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M34.1549 1.95906C32.8146 0.618783 30.6414 0.618963 29.3009 1.95946L17.9789 13.2815L6.87398 2.17652C5.5337 0.836241 3.36051 0.836421 2.02002 2.17692C0.67952 3.51741 0.67934 5.69061 2.01961 7.03089L13.1246 18.1358L1.80445 29.456C0.463951 30.7965 0.463772 32.9697 1.80404 34.3099C3.14432 35.6502 5.31751 35.65 6.65801 34.3095L17.9781 22.9894L29.082 34.0933C30.4223 35.4336 32.5955 35.4334 33.936 34.0929C35.2764 32.7524 35.2766 30.5792 33.9364 29.2389L22.8325 18.135L34.1545 6.81303C35.495 5.47253 35.4952 3.29933 34.1549 1.95906Z" fill="black" fill-opacity="0.12"/>
      </svg>
      </div>

            {userNameText ? (
              <div 
              style = {{
                height: "37%"
              }}>
              <span
              style = {{
                fontWeight:"400",
                fontSize: "1.1em",
                color: "#757575",
                // border: "1px solid #000",
                textAlign: "center",
                width: "70%",
                // height: "30%",
                display: "block",
                marginTop: 10,
                marginBottom: 10
              }}>
                joining as:
                 {/* <br /> */}
                
                </span>
                <div style={{
                   color: "#000",
                  textAlign: "left",
                   fontSize: "1.35em",
                  //  border: "1px solid #000",
                  width: "13em",
                  float:"right",
                  marginBottom: 15,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  // bottom: ".5em"
               }}>
                 <span className = "avatarSpace"
                 style = {{
                   marginRight: ".5em",
                   padding: "1px 2px",
                  //  border:"1px solid #000",
                   borderRadius: "60%",
                   backgroundColor:`${chatColor}`
                 }}
                 >
                  {renderAvatar(chatAvatar,'35','35')}
                 </span>
                  <span style={{
                    width:"60%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"}}>{
              //  userNameText.length > 15
              //   ? userNameText.substring(
              //       0,
              //       15
              //     ) + "..."
              //   : 
                userNameText} </span></div>
                {/* <br /> */}
            <button
            // className = "joinChatBtn"
              style={{
                // visibility: "hidden",
                backgroundColor: "#48A7FF",
                borderWidth: 0,
                padding: 20,
                marginLeft: 45,
                fontSize: 25,
                fontWeight:"700",
                color: "white",
                borderRadius: 50,
                width: "70%",
                height: "35%",
                fontFamily: "Roboto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={joinChat}
            >
              Join Chat!
            </button>
                </div>
              
            ) : (
              <p></p>
            )}
            {/* <br /> */}
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              className="Toastify__toast--error"
            />
          </div>
        </div>
      );
    }
  } else {
    return (
      <div>
        <p>This room doesnt exist</p>
      </div>
    );
  }
}

