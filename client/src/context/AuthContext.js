import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    // set the presistence of the auth state to browser session persistence
    // need to define this before calling onAuthStateChanged
    setPersistence(auth, browserSessionPersistence)
      .catch((error) => console.error('Error setting session persistence:', error));

    const updateAuthState = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user !== null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => updateAuthState();
  }, [auth]);


  // the user remains logged in only for the current browser session - when the browser is closed, the user will be logged out
  useEffect(() => {
    // logout the user when the browser is closed
    const handleBeforeUnload = () => {
      signOut(auth).catch((error) => {
        console.error('Error signing out on beforeunload:', error);
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // cleanup function to remove the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
