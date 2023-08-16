import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import Styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import {activate} from '../../../http/index';
import { setAuth } from '../../../store/authSlice';
import Loader from '../../../components/shared/Loader/Loader';

const StepAvatar = ({ onNext }) => {

    const dispatch = useDispatch();
    const {name, avatar} = useSelector((state)=>state.activate);
    const[image, setImage] = useState('/images/monkey-avatar.png');
    const [loading, setLoading] = useState(false);

    function captureImage(e){
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = function(){
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        }
    }

    async function submit(){
        setLoading(true);
        if (!name || !avatar) {
            alert("Please enter valid name and avatar");
            setLoading(false);
            return;
        }
        try{
          const {data} = await activate({name,avatar});
          if(data.auth){
            dispatch(setAuth(data));
          }
        }catch(err){
            console.log(err);
        }
        
        finally{ 
            // in any case (try/catch) this will run - finally 
            setLoading(false);
        }
    }
   
    if(loading) return (<Loader message="Activation in progress..."/>);
    
    return (
        <>
           <Card title={`Okay, ${name}`}icon="monkey-emoji">
                <p className={Styles.subHeading}>How's this Avatar?</p>
                <div className={Styles.avatarWrapper}>
                    <img className={Styles.avatarImage} src={image} alt="avatar" />
                </div>
                <div>
                    <input 
                     onChange={captureImage}
                     id="avatarInput"
                     type="file" 
                     className={Styles.avatarInput} 
                     />
                    <label className={Styles.avatarLabel} htmlFor="avatarInput">
                        choose a different photo
                    </label>
                </div>
                {/* //now we have name, avatar , we can store it in sever */}
                <div>
                    <Button onClick={submit} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;
