import React from "react";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { APIlogout } from "../../utils/api";

import AuthContext from "../Context/Auth/AuthContext";


function SideButtons() {
    const { isLoggedIn, user, logout } = useContext(AuthContext);

    const submitLogout = (event) => {
      event.preventDefault();
      const fetchLogout = async () => {
        // const response = await APIlogout()
        await APIlogout()
        logout()
      }
      fetchLogout()
    }

    return (
      <div className="other-wrap">
        <Link to='/chat/list'>채팅 목록</Link>
        {isLoggedIn ? (
          <>
            <Link to={`/profile/${user.id}`}>프로필</Link>
            <a href="/logout/" onClick={ submitLogout }>로그아웃</a>
            <p>{user.nickname}님 환영합니다.</p>
          </>
        ) : (
          <>
            <Link to='/login/'>로그인</Link>
            <Link to='/signup/'>회원가입</Link>
          </>
        )}
      </div>
    );
}

export default SideButtons
