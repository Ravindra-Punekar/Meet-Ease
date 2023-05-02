import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card'
import Button from '../../../../components/shared/Button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneEmail.module.css';
const Phone = () => {

  const [phoneNumber, SetPhoneNumber] = useState('');

  return (
    <Card title="Enter your phone number" icon="phone">
        <TextInput value={phoneNumber} onChange={ (e)=> SetPhoneNumber(e.target.value) } />   
        <div>
          <div className={styles.actionButtonWrap}>
            <Button  text="Next" />
          </div>

          <p className={styles.bottomParagraph}>

          </p>
        </div>
                
    </Card>
  )
}

export default Phone