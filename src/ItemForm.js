import React from "react";
import './styles.css';
import "./mobileRes.css";
import "./tabletRes.css";

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
