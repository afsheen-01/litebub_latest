import React, { useState } from "react";
import { useForm, useStep } from "react-hooks-helper";

import Start from "./Start";
import CreateLink from "./CreateLink";
import CopyLink from "./CopyLink";
import { ComponentTransition, AnimationTypes } from "react-component-transition"


import "./styles.css";

const steps = [
  { id: "start" },
  { id: "create" },
  { id: "copy" },
  { id: "chat" }
];
var defaultData = {
  topic: "",
  roomId: "",
  bgGif: ""
};

const MultiStepForm = ({ images }) => {
  // console.log(props.bgs);
  let [formData, setForm] = useForm(defaultData);
  const { step, navigation } = useStep({ steps });
  const { id } = step;
  const [visible, setVisible] = useState(false);
  const sideBubb = {
    name: "litebub"
  };

  const props = {
    formData,
    setForm,
    navigation,
    sideBubb,
    visible,
    setVisible,
  };
  // console.log(formData)
  return id == 'start' ? <Start {...props} />
    :
    <ComponentTransition
      enterAnimation={
        [
          AnimationTypes.collapse.vertical,
          AnimationTypes.scale.enter,
        ]}
      exitAnimation={[{
        keyframes: [
          { transform: "translate3d(0,0,0)" },
          { transform: "translate3d(0,50%,0)" },
          { transform: "translate3d(0,80%,0)" },
          { transform: "translate3d(0,90%,0)" },
          { transform: "translate3d(0,100%,0)" },
      ]}]}
    >
      {id == 'copy' ? <CopyLink {...props} />
        : <CreateLink {...props} />}
    </ComponentTransition>


};

export default MultiStepForm;