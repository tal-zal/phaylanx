import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom';
import 'firebase/compat/auth';
import "./login.css";


export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Initialize Firebase only once upon first page view
  useEffect(() => {
    
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    // Check if Firebase is not already initialized
    if (!firebase.apps || !firebase.apps.length) {
      console.log("Init firebase successfully.");
      firebase.initializeApp(firebaseConfig);
    }
  }, []);

  const handleGoogleLogin = () => {
    // Check if Firebase is initialized
    if (!firebase.auth) {
      console.error('Firebase is not initialized');
      return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // Handle successful login
        console.log('Google login successful:', result);
        navigate('/home');
      })
      .catch((error) => {
        // Handle errors
        console.error('Google login error:', error);
        setErrorMessage(error.message);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((result) => {
        // Handle successful login
        console.log('Email login successful:', result);
      })
      .catch((error) => {
        // Handle errors
        console.error('Email login error:', error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="login-page-hero">
      <div className="login-container">
        <h2 className="login-title">Login To Phaylanx.io</h2>
        <button className="button" onClick={handleGoogleLogin}>Login with Google</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};
