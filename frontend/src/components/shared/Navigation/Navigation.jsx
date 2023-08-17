import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { useSelector } from "react-redux";
const Navigation = () => {
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  const logoText = {
    marginLeft: "10px",
  };

  //logout user
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Codershouse</span>
      </Link>
      {isAuth && (
        <div className={styles.navRight}>
          <h3>{user.name}</h3>
          <Link to="/">
            <img
              className={styles.avatar}
              src={user.avatar}
              width="40"
              height="40"
              alt="avatar"
            />
          </Link>
          {isAuth && (
            <button className={styles.logoutButton} onClick={logoutUser}>
              <img src="/images/arrow-forward.png" alt="logout" />
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
