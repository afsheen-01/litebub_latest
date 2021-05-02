import React from "react";
import './styles.css';

const ItemForm = ({ label, children, type = "text", ...otherProps }) =>{
  
  // const fnDisplay = () => {
  //   console.log('bleh')
  // }
  return (
  <div 

  >
        <input type="text" {...otherProps} placeholder="type a topic" 
        style = {{
          border: "none",
          borderRadius: "10px" ,
          height: "2.7em",
          width: "auto",
          paddingLeft: "23px",
          margin: "14px 0 0 ",
          paddingTop: 0,
          paddingRight:0
        }} 
        className = " ui input massive topic-input" />
      
   </div>
  );
}

export default ItemForm;
