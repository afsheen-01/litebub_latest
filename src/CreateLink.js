import React, { useState, useEffect } from "react";

import ItemForm from "./ItemForm";
import firebase from "firebase/app";
import "@firebase/database";
import './bubbles.css';

const Address = ({ setForm, formData, navigation }) => {
  let [btnState, setBtnState] = useState(true)
  let [currentTopic, settopic] = useState('')
  const [bubbleTopics, setTopics] = useState([])

  const goBackAndEmptyInput = () => {
    formData.topic = ""
    navigation.previous()
  }
  useEffect(() => {
    firebase
      .database()
      .ref("/topics")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          let data = Object.values(snapshot.val())
          // console.log(data)
          setTopics(data)
        }
      })
    const topicInput = document.querySelector('.topic-input')
    topicInput.focus()
  }, [])
  function createRoom() {
    // console.log(formData);
    let val = document.querySelector('.topic-input').value
    formData.topic = val
    // console.log(formData.topic)
    let r = Math.random().toString(36).substring(7);
    var roomID = new Date().getTime() + r;
    firebase
      .database()
      .ref("rooms/" + roomID)
      .set({
        expiration: +new Date(Date.now() + 3600 * 1000 * 24),
        participantCount: 0,
        chatTopic: formData.topic
      });
    formData.roomId = roomID;
    // formData.chatBg = "";
    navigation.next();
  }
  // console.log(formData)
  const transparentBtn = (btn, cBtn) => {
    setBtnState(true)
    cBtn.style.visibility = "hidden"
    btn.style.backgroundColor = "transparent"
    btn.style.border = "2px solid #fff"
  }
  const changeBtnState = (e) => {
    let btn = document.querySelector('.cbtn');
    let cBtn = document.querySelector('.cl-crossBtn');
    if (e.keyCode > 31 && e.keyCode < 127) {
      settopic(document.querySelector('.topic-input').value)
      setBtnState(false)
      cBtn.style.visibility = "visible"
      btn.style.backgroundColor = "#48A7FF"
      btn.style.border = "2px solid #48A7FF"
    }
    if (e.target.value === "") {
      settopic('')

      transparentBtn(btn, cBtn)
    }
  }
  const emptyInp = () => {
    const topicInput = document.querySelector('.topic-input')
    topicInput.value = ""
    topicInput.focus()
    let btn = document.querySelector('.cbtn');
    let cBtn = document.querySelector('.cl-crossBtn');
    transparentBtn(btn, cBtn)
  }
  const bubbles = bubbleTopics.map((obj, i) => {

    return (
      <>
        <div
          className="bubble"
          onClick={() => {
            const topicInp = document.querySelector('.topic-input')

            let btn = document.querySelector('.cbtn');
            let cBtn = document.querySelector('.cl-crossBtn');

            if (currentTopic === obj.topic) {
              // console.log("same bubble clicked.")
              topicInp.value = ""
              settopic("")
              transparentBtn(btn, cBtn)

            } else {
              // console.log("topic value changed")
              topicInp.value = obj.topic
              setBtnState(false)
              settopic(obj.topic)
              cBtn.style.visibility = "visible"
              btn.style.backgroundColor = "#48A7FF"
              btn.style.border = "2px solid #48A7FF"
            }
          }}
          style={{
            backgroundColor: obj.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: currentTopic === obj.topic ? "0 0 0 4px #fff" : "none",
            height: obj.size == "big" ? 150 : obj.size == "medium" ? 120 : 90,
            width: obj.size == "big" ? 150 : obj.size == "medium" ?  120: 90,
            fontSize: obj.size == "big" ? "1.1em" : obj.size == "medium" ? "0.95em" : "0.8em",
            // padding: obj.size == "big" ? "70px 50px" : obj.size == "medium" ? "50px 30px" : `${5}% ${3}%`,
            // padding: 60,
            margin: "0 10px"
          }} key={i} id={i}>
          {/* {obj.breakLine?"\n":null} */}
          {obj.topic.replace(" ", "\n")}
        </div>
        {' '}
        {/* <br /> */}
        {/* { i % 3 == 0 ? <br /> : null} */}
        </>) 
  })
  const options = {
    size: 0, 
    //block size
    minSize: 0,
    provideProps: true,
    numCols: 6, //number of columns
    gutter: 0, //used to set margin
    fringeWidth: 0,
    yRadius: 50,
    xRadius: 400,
    cornerRadius: 40,
    showGuides: true,
    compact: false,
    gravitation: 5
  }
  
  return (
    <div 
    // id = "main"
      class="copyLink-div" id="createLink-div">
      <div 
        // className="corner"
        style={{
          marginTop: "1.7em",
          width: "19%"
        }}
        
      >
        {/*icon here */}
        <h2 className="header2 btnh"
          onClick={goBackAndEmptyInput}>litebub</h2>
      </div>
      <div 
      className="form" 
      style = {{
        // height: "100%",  
        // border:"1px solid #000"
      }}
      >
        <div className = "center-it-cl">
          <div className="chatAbout">what's the chat about?
          </div>
          <div
            className = "cl-inputSec"
          >
            <input
              className = "ui input massive topic-input"
              name="topic"
              //value={topic}
              placeholder="type a topic" 
        
              onKeyUp = {changeBtnState}
              style={{
                border: "none",
                borderRadius: "10px" ,
                height: "2.7em",
                // width: "30%",
                paddingLeft: "23px",
                margin: "14px 0 0 2em",
                paddingTop: 0,
                paddingRight:0
              }}       
            />
            <svg
              onClick = {emptyInp}
              style = {{
                  visibility: "hidden"
                }}
              className  = "cl-crossBtn"
              width="50" height="65" viewBox="0 0 55 73" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.42">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M45.1546 19.9591C43.8144 18.6188 41.6412 18.619 40.3007 19.9595L28.9787 31.2815L17.8737 20.1765C16.5335 18.8362 14.3603 18.8364 13.0198 20.1769C11.6793 21.5174 11.6791 23.6906 13.0194 25.0309L24.1243 36.1358L12.8042 47.456C11.4637 48.7965 11.4635 50.9697 12.8038 52.3099C14.1441 53.6502 16.3173 53.65 17.6578 52.3095L28.9779 40.9894L40.0817 52.0933C41.422 53.4336 43.5952 53.4334 44.9357 52.0929C46.2762 50.7524 46.2764 48.5792 44.9361 47.2389L33.8322 36.135L45.1542 24.813C46.4947 23.4725 46.4949 21.2993 45.1546 19.9591Z" fill="white"/>
              </g>
            </svg>
          </div>
          <button  className = "ui button circular huge cbtn" id = "create-link-btn"
            disabled = {btnState}
            style = {{
              background: 'transparent',
              border: "2px solid #fff",
              marginTop: 18
            }}
            onClick={createRoom}>
            <svg width="30" height="21" viewBox="3.5 0 30 26.89" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.167294 25.1068L1.7813 26.7208C1.8926 26.8321 2.0387 26.888 2.18481 26.888C2.33091 26.888 2.47702 26.8321 2.58831 26.7208L7.83327 21.4764C7.83384 21.4758 7.83499 21.4752 7.83556 21.4747C7.83613 21.4741 7.83613 21.473 7.83727 21.4718L18.7313 10.5784C18.8386 10.4711 18.8985 10.3261 18.8985 10.1749C18.8985 10.0236 18.8386 9.87811 18.7313 9.77139L17.1161 8.15681C16.893 7.93365 16.5323 7.93365 16.3091 8.15681L5.4134 19.0531C5.4134 19.0537 5.4134 19.0537 5.4134 19.0537C5.41283 19.0537 5.41283 19.0542 5.41283 19.0542L4.20346 20.263C4.20346 20.2636 4.20346 20.2636 4.20346 20.2636C4.20289 20.2636 4.20289 20.2642 4.20289 20.2642L0.167864 24.2992C-0.0558598 24.5223 -0.0558595 24.8836 0.167294 25.1068ZM16.7132 9.36788L17.5208 10.1755L7.43148 20.2642L6.62334 19.4572L16.7132 9.36788ZM5.81633 20.2647L6.62391 21.0712L6.21983 21.4752L5.41283 20.6677L5.81633 20.2647ZM4.60582 21.4752L5.41283 22.2823L2.18481 25.5103L1.3778 24.7033L4.60582 21.4752Z" fill="white"/>
              <path d="M6.27819 9.1316C6.27819 9.44664 6.53387 9.70232 6.84891 9.70232C7.16395 9.70232 7.41964 9.44664 7.41964 9.1316C7.41964 7.87258 8.44352 6.8487 9.70254 6.8487C10.0176 6.8487 10.2733 6.59301 10.2733 6.27797C10.2733 5.96293 10.0176 5.70725 9.70254 5.70725C8.44352 5.70725 7.41964 4.68337 7.41964 3.42435C7.41964 3.10931 7.16395 2.85362 6.84891 2.85362C6.53387 2.85362 6.27819 3.10931 6.27819 3.42435C6.27819 4.68337 5.25431 5.70725 3.99529 5.70725C3.68025 5.70725 3.42456 5.96293 3.42456 6.27797C3.42456 6.59301 3.68025 6.8487 3.99529 6.8487C5.25431 6.8487 6.27819 7.87258 6.27819 9.1316ZM6.84891 5.31516C7.10231 5.6964 7.43048 6.024 7.81172 6.27797C7.43048 6.53138 7.10288 6.85954 6.84891 7.24079C6.59551 6.85954 6.26734 6.53195 5.8861 6.27797C6.26734 6.024 6.59551 5.6964 6.84891 5.31516Z" fill="white"/>
              <path d="M14.2682 20.5461C15.5273 20.5461 16.5511 21.57 16.5511 22.829C16.5511 23.1446 16.8068 23.3997 17.1219 23.3997C17.4369 23.3997 17.6926 23.1446 17.6926 22.829C17.6926 21.57 18.7165 20.5461 19.9755 20.5461C20.2905 20.5461 20.5462 20.291 20.5462 19.9754C20.5462 19.6598 20.2905 19.4047 19.9755 19.4047C18.7165 19.4047 17.6926 18.3808 17.6926 17.1218C17.6926 16.8061 17.4369 16.551 17.1219 16.551C16.8068 16.551 16.5511 16.8061 16.5511 17.1218C16.5511 18.3808 15.5273 19.4047 14.2682 19.4047C13.9532 19.4047 13.6975 19.6598 13.6975 19.9754C13.6975 20.291 13.9532 20.5461 14.2682 20.5461ZM17.1219 19.0126C17.3753 19.3938 17.7034 19.7214 18.0847 19.9754C17.7034 20.2288 17.3758 20.5569 17.1219 20.9382C16.8685 20.5569 16.5403 20.2293 16.159 19.9754C16.5403 19.7214 16.8685 19.3938 17.1219 19.0126Z" fill="white"/>
              <path d="M21.1169 6.27798C21.1169 5.01896 22.1408 3.99508 23.3998 3.99508C23.7148 3.99508 23.9705 3.73939 23.9705 3.42435C23.9705 3.10931 23.7148 2.85363 23.3998 2.85363C22.1408 2.85363 21.1169 1.82974 21.1169 0.570725C21.1169 0.255685 20.8612 0 20.5462 0C20.2311 0 19.9755 0.255685 19.9755 0.570725C19.9755 1.82974 18.9516 2.85363 17.6926 2.85363C17.3775 2.85363 17.1218 3.10931 17.1218 3.42435C17.1218 3.73939 17.3775 3.99508 17.6926 3.99508C18.9516 3.99508 19.9755 5.01896 19.9755 6.27798C19.9755 6.59302 20.2311 6.8487 20.5462 6.8487C20.8612 6.8487 21.1169 6.59302 21.1169 6.27798ZM19.5834 3.42435C19.9646 3.17095 20.2922 2.84278 20.5462 2.46154C20.7996 2.84278 21.1277 3.17038 21.509 3.42435C21.1277 3.67775 20.8001 4.00592 20.5462 4.38717C20.2928 4.00535 19.9646 3.67775 19.5834 3.42435Z" fill="white"/>
              <path d="M22.8294 12.5559C23.7733 12.5559 24.5415 11.7878 24.5415 10.8438C24.5415 9.8998 23.7733 9.1316 22.8294 9.1316C21.8854 9.1316 21.1172 9.8998 21.1172 10.8438C21.1172 11.7878 21.8854 12.5559 22.8294 12.5559ZM22.8294 10.273C23.1438 10.273 23.4001 10.5293 23.4001 10.8438C23.4001 11.1582 23.1438 11.4145 22.8294 11.4145C22.5149 11.4145 22.2586 11.1582 22.2586 10.8438C22.2586 10.5293 22.5149 10.273 22.8294 10.273Z" fill="white"/>
              <path d="M5.13674 15.4096C6.08072 15.4096 6.84891 14.6414 6.84891 13.6974C6.84891 12.7534 6.08072 11.9852 5.13674 11.9852C4.19276 11.9852 3.42456 12.7534 3.42456 13.6974C3.42456 14.6414 4.19276 15.4096 5.13674 15.4096ZM5.13674 13.1267C5.45121 13.1267 5.70746 13.3829 5.70746 13.6974C5.70746 14.0124 5.45121 14.2681 5.13674 14.2681C4.82227 14.2681 4.56601 14.0124 4.56601 13.6974C4.56601 13.3824 4.82227 13.1267 5.13674 13.1267Z" fill="white"/>
              <path d="M14.8391 2.2829C14.8391 1.33892 14.0709 0.570724 13.127 0.570724C12.183 0.570724 11.4148 1.33892 11.4148 2.2829C11.4148 3.22688 12.183 3.99507 13.127 3.99507C14.0709 3.99507 14.8391 3.22688 14.8391 2.2829ZM12.5562 2.2829C12.5562 1.96843 12.8125 1.71217 13.127 1.71217C13.4414 1.71217 13.6977 1.96843 13.6977 2.2829C13.6977 2.59737 13.4414 2.85362 13.127 2.85362C12.8125 2.85362 12.5562 2.59737 12.5562 2.2829Z" fill="white"/>
            </svg>
            <span style = {{paddingBottom:"4em",
              height: "inherit",
              // border: "2px solid #fff"
              }}
            >Create Link</span>
          </button>
        </div>
        {/* <BubbleUI className = "bubbleUI"> */}
        <div class = "bubbleUI">
          {bubbles}
          {/* {console.log(bubbles)} */}
          </div>
        {/* </BubbleUI> */}
      </div>
    </div>
  );
};

export default Address;
