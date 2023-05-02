import React from 'react';
import Phone from './Phone/Phone';
import Email from './Email/Email';
import { useState } from 'react';
import styles from './StepPhoneEmail.module.css'

const phoneEmailMap ={
    phone: Phone, 
    email: Email,
};

const StepPhoneEmail = ({ onNext }) => {
    const [type, setType] = useState('phone');
    const Component = phoneEmailMap[type];

    return (
        <>
        <div className={styles.cardWrapper}>
            <div>
                <div className={styles.buttonWrap}>
                    <button onClick={()=> setType('phone')}>Phone</button>
                    <button onClick={()=> setType('email')}>Email</button>
                </div>
                <Component onNext={onNext} />
            </div>
        </div>

        
        </>
    );
};

export default StepPhoneEmail;
