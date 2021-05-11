import React, { useState } from "react";
import { useForm, useStep } from "react-hooks-helper";

import Start from "./Start";
import CreateLink from "./CreateLink";
import CopyLink from "./CopyLink";

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
  bgGif:""
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
  switch (id) {
    case "start":
      return <Start {...props} />;
    case "create":
      return <CreateLink {...props} />;
    case "copy":
      return <CopyLink {...props} />;
    default:
      return null;
  }
};

export default MultiStepForm;