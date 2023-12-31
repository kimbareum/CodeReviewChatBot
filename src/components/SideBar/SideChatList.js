import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { APIcall } from "../../utils/api";
import { useNavigate } from "react-router-dom";

import UpdateContext from "../Context/Update/UpdateContext";
import AuthContext from "../Context/Auth/AuthContext";

function SideChatList(props) {

  const item = props.item;
  const { updateSideBar, updateChatList } = useContext(UpdateContext)
  const { logout }  = useContext(AuthContext)
  const navigate = useNavigate()

  const submitDeleteChat = (e) => {
    e.preventDefault()
    const URL = e.target.getAttribute('href')
    const fetchData = async () => {
      // console.log("delete")
      const response = await APIcall('post', URL);
      if (response.status === 'good') {
        updateSideBar();
        updateChatList();
      }
      else if (response.status === 'Unauthorized') {
        logout();
        navigate(`/login/`);
      }
      else {
        navigate(`/error/`);
      }
    }
    fetchData()
  }

  return (
    <div className="chat-wrap"  key={item.id}>
      <Link to={`/chat/${item.id}`} className="chat-link" >
        {item.title}
      </Link>
      <a className="delete-button" href={`/chat/delete/${item.id}/`} onClick={ submitDeleteChat }> </a>
    </div>
  )
}

export default SideChatList