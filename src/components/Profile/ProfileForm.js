import { useRef,useContext } from 'react';
import { useHistory } from 'react-router-dom';
import classes from './ProfileForm.module.css';
import AuthContext from '../store/auth-context';

const ProfileForm = () => {
  //creates a reference to the input element
const newPasswordInputRef = useRef();
const history = useHistory();
const authCTX = useContext(AuthContext);

const submitHandler = (event) => {
  event.preventDefault();
  // defining the final value of the input element to be used in the fetch request
  const enteredNewPassword = newPasswordInputRef.current.value;

  fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBWmWXLqQfs0LepvS0u3J9pBqeo9xHE2wI', 
  {
  method: 'POST',
  body: JSON.stringify({
  idToken: authCTX.token,
  password:enteredNewPassword,
  returnSecureToken:false
  }),

  headers: {
  'Content-Type': 'application/json',
  }
}).then(res => {history.replace('/');}).catch(err => {console.log(err);})}

  return (
    <form className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button onClick={submitHandler}>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
