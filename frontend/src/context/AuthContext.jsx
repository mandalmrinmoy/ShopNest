import React, { createContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart, setCartUser } from "../redux/slice/cartSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const dispatch = useDispatch();

  // On app startup, if a user is already logged in, load their saved cart.
  // Adjust `user._id` if your user object uses a different id field (e.g. user.id).
  useEffect(() => {
    if (user) {
      dispatch(setCartUser(user._id));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    dispatch(setCartUser(userData._id));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    dispatch(clearCart());
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};