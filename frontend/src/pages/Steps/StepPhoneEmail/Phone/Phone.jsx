import React, { useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css";
import { sendOtp } from "../../../../http/index";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";

const Phone = ({ onNext }) => {
  const [phoneNumber, SetPhoneNumber] = useState("");

  const dispatch = useDispatch();

  async function submit() {
    if (!phoneNumber) {
      alert("Please enter your phone number");
      return;
    }
    //server request
    const { data } = await sendOtp({ phone:phoneNumber });
    console.log(data);
    
    //when working with twilio, use below line
    // const { data } = await sendOtp({ phone: `+91${phoneNumber}` });
    //redux: dispatch action to set otp data in store (phone and hash) 
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    
    //move to next step
    onNext();
  }

  return (
    <Card title="Enter your phone number" icon="phone">
      <TextInput
        value={phoneNumber}
        onChange={(e) => SetPhoneNumber(e.target.value)}
      />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next" onClick={submit} />
        </div>
        <p className={styles.bottomParagraph}>
          By entering your number, you're agreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Phone;
