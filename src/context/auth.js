// src/context/auth.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("@library/token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  //
  const login = (newToken) => {
    localStorage.setItem("@library/token", newToken);
    setToken(newToken);
  };
  //

  function logout() {
    localStorage.removeItem("@library/token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };


/*"use client";

import { createContext, useContext, useEffect, useState } from "react"


const AuthContext = createContext({
    token: null,
    setToken: () => {},
    logout: () => {},
  });

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(null);
    
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    },[]);

    function setToken(newToken) {
        localStorage.setItem("token", newToken);
        setTokenState(newToken);
      }

    function logout() {
        localStorage.removeItem("token")
        setToken(null);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}

*/