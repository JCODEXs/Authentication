import React,{useCallback, useEffect, useState} from "react";
let logoutTimer;

// creates a context object that we can use to share data throughout the app

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login:(token) => {},
    logout:() => {}
   
});

const calculateRemainingTime = (expirationDate) => {
    const currentTime = new Date().getTime();
    const TokenExpeditionTime = new Date(expirationDate).getTime();

    const TokenExpirationTime = TokenExpeditionTime - currentTime;
    return TokenExpirationTime;}

const retrieveLocalToken = () => {
    const token = localStorage.getItem('token')
    const expirationDate= localStorage.getItem('expirationDate')
    const remainingTime = calculateRemainingTime(expirationDate);
// avoiding authentication if tokens soon expire
if (remainingTime > 40000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return null;
}
    return {
        token: token,
        duration: remainingTime
    }
}


// creates a provider component cointaining the context object, its children and handling functions.

export const AuthContextprovider = (props)=>{
  //persistent login token
  const tokenData = retrieveLocalToken();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }

// the token variable is the core of the authentication system and therefore 
// it is the only state variable used in context.
const [token, setToken] = useState(initialToken);
// is used to trasform the token into a boolean value. acording to the token existence.
const userIsLoggedIn = !!token;

// define the functions of the context object.
const loginHandler = (token,expirationTime) => {
    setToken(token);
localStorage.setItem('token', token);
localStorage.setItem('expirationTime', expirationTime);
const remainingTime = calculateRemainingTime(expirationTime);
logoutTimer = setTimeout(logoutHandler,remainingTime);
}

const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if(logoutTimer){
      clearTimeout(logoutTimer);
    }
    console.log('localStorage', localStorage);
},[])

useEffect(() => {
    if (tokenData){
        logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
},[tokenData, logoutHandler]);


// defines the value to be passed to the context provider 

const contextValue = {
    token:token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler 
} ;

// the created context 
    return (<AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
);
};
export default AuthContext;