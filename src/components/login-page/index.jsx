import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app'; // Import Firebase

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize Firebase only once upon first page view
  useEffect(() => {
    // Check if Firebase is not already initialized
    // if (!firebase.apps.length) {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        // databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      };
      
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    // }
  }, []);

  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // Handle successful login
        console.log('Google login successful:', result);
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
    <div>
      <h2>Login</h2>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <div>
        <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
        <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
        <button onClick={handleEmailLogin}>Login with Email</button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};
