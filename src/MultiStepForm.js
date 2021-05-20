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
      enterAnimation={AnimationTypes.slideDown.enter}
      exitAnimation={AnimationTypes.slideUp.exit}
    >
      {id == 'copy' ? <CopyLink {...props} />
        : <CreateLink {...props} />}
    </ComponentTransition>

};

export default MultiStepForm;