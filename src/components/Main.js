import React from "react";

import SideBar from "./SideBar";
import Home from "./main/Home";
import ChatWrite from "./main/ChatWrite";
import ChatList from "./main/ChatList";
import Chat from "./main/Chat";
import Login from "./main/Login";
import SignUp from "./main/SignUp";
import Profile from "./main/Profile";
import UserDelete from "./main/Profile/UserDelete";
import PasswordChange from "./main/Profile/PasswordChange";
import Error from "./main/Error";

import { Routes, Route } from 'react-router-dom';

const Main = () => {
  return (
    <>
      <SideBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/chat/write" element={<ChatWrite />}></Route>
          <Route path="/chat/list" element={<ChatList />}></Route>
          <Route path="/chat/:chat_id" element={<Chat />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/profile/:user_id" element={<Profile />}></Route>
          <Route path="/user/delete" element={<UserDelete />}></Route>
          <Route path="/user/password/change" element={<PasswordChange />}></Route>
          <Route path="/error/" element={<Error />}></Route>
          <Route path="*" element={<Error />}></Route>
        </Routes>
    </>
  )
}

export default Main