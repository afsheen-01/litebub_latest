import React from "react";
import '../css/styles.css';
import "../css/mobileRes.css";
import "../css/tabletRes.css";

const ItemForm = ({ label, children, type = "text", ...otherProps }) =>{
  return (
  <div>
    <input type="text" {...otherProps} placeholder="type a topic" 
      className = " ui input massive litebub-input"
    />
      
   </div>
  );
}

export default ItemForm;
