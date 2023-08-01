import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, APIcall } from '../../../utils/api';

import ChatButtons from './ChatButtons';
import UpdateContext from '../../Context/Update/UpdateContext';

const ChatTitle = ({chat, userOwned}) => {

  const navigate = useNavigate();
  const [ mode, setMode ] = useState('RENDER')
  const [ title, setTitle ] = useState(chat.title)
  const [ inputValue, setInputValue ] = useState(title)
  const [ URL, setURL ] = useState(`/chat/${chat.id}/update/`)
  const { updateSideBar } = useContext(UpdateContext)

  
  useEffect(() => {
    setTitle(chat.title);
    setURL(`/chat/${chat.id}/update/`)
  }, [chat])


  const handleChange = (e) => {
    setInputValue(e.target.value);
  }

  const initializeInputValue = () => {
    setInputValue(title);
  }

  const submitModifyTitle = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    const response = await APIcall('post', URL, formData)
    if (response.status === 'good') {
      setTitle(inputValue);
      setMode('RENDER');
      updateSideBar();
    }
    else {
      navigate('/error/')
    }
  }
  

  return (
    <div className='title-wrap'>
      {mode === 'RENDER'? (
        <h2>{title}</h2>
      ):(
        <h2>
          <form method='post' className='title-modify' onSubmit={submitModifyTitle}>
            <input name='title' value={inputValue} onChange={handleChange} maxLength='30'/>
            <button className='button gray'>수정</button>
          </form>
        </h2>
      )}
      <div className='author-wrap'>
        {userOwned&&(
          <ChatButtons chat_id={chat.id} mode={mode} setMode={setMode} initializeInputValue={initializeInputValue}/>
        )}
        {chat.writer_profile_image&&<img src={`${BASE_URL}${chat.writer_profile_image}`} alt="user-icon"/>}
        <p>{chat.writer_nickname}/ {chat.updated_at}</p>
      </div>
    </div>
  )
}

export default ChatTitle