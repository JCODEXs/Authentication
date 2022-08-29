import { useState,useRef, useContext } from 'react';
import {useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';
import AuthContext from '../store/auth-context';

const AuthForm = () => {
  const history=useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
 const authCtx= useContext(AuthContext);
  //const { isLoggedIn} = authCtx;

  const [isSignUpOrLogin, setIsLogin] = useState(true);
   const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    // optinal validation
    setIsLoading(true);
    let url;
    if (isSignUpOrLogin)   {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBWmWXLqQfs0LepvS0u3J9pBqeo9xHE2wI'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBWmWXLqQfs0LepvS0u3J9pBqeo9xHE2wI'
     
    }
    fetch( url, 
      { method: 'POST', 
        body: JSON.stringify({ 
             email: enteredEmail,
             password: enteredPassword,
             returnSecureToken: true
    }),
       headers: {
      'Content-Type': 'application/json',},
    })

    .then(res => {

      setIsLoading(false);
   if(res.ok){
     console.log(res.json);
       
      return res.json();
      }else{
      
        return res.json().then((data) => {
          let errorMessage = 'somthing went wrong';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
         
          throw new Error(errorMessage);
        });
    }})
    .then(data => {
      const expirationDate = new Date(new Date().getTime() + (+data.expiresIn * 1000));
      authCtx.login(data.idToken, expirationDate.toISOString());
      history.replace('/profile');
      
    }).catch(err => {
      alert(err.message)
    })
  
  }
  return (
    <section className={classes.auth}>
      <h1>{isSignUpOrLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref ={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
{!isLoading && <button>{isSignUpOrLogin ? 'Login' : 'Create Account'}</button>}
{isLoading && <p> Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isSignUpOrLogin ? 'Create new account' : 'Login with existing account'}
           
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
