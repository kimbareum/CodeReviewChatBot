import React from "react";
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { APIcall, tokenRefresh } from "../utils/api";
// import axios from 'axios';
import SideButtons from './SideBar/SideButtons';
import SideChatList from "./SideBar/SideChatList";

import AuthContext from "./Context/Auth/AuthContext";
import UpdateContext from "./Context/Update/UpdateContext";


function SideBar() {

    const [chatList, setChatList] = useState([])
    const { isLoggedIn, userId, login }  = useContext(AuthContext);
    const { sideBarState } = useContext(UpdateContext)

    useEffect(() => {
        if (isLoggedIn) {
          const fetchData = async () => {
            const response = await APIcall('authGet', '/chat/list/self/');
            // console.log(response)
            if(response.status === 'good') {
              setChatList(response.data)
            }
          }
          fetchData();
        }
        else {
          const refreshToken = async() => {
            const response = await tokenRefresh()
            if (response) {
              login(response)
            }
          }
          refreshToken()
        }
    }, [isLoggedIn, userId, sideBarState, login])

    return (
        <aside className="side-bar">
          <div className="chat-list">
            {isLoggedIn ? (
            <>
              <Link to={`/chat/write`} className="new-chat">+ New Chat</Link>
              {chatList.map((item) => (
                <SideChatList item={item} key={item.id}/>
              ))}
            </>
            ) : (
              <div>로그인해주세요.</div>
            )}
          </div>
          <SideButtons/>
        </aside>
    );
}

export default SideBar