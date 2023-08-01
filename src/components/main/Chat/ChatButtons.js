import React, { useContext } from 'react'
import { APIcall } from '../../../utils/api'

import UpdateContext from '../../Context/Update/UpdateContext'
import { useNavigate } from 'react-router-dom'

const ChatButtons = ({chat_id, mode, setMode, initializeInputValue})=> {
  const navigate = useNavigate()
  const { updateSideBar, updateChatList } = useContext(UpdateContext)

  const modifyTitle = () => {
    if (mode === 'RENDER'){
      setMode('MODIFY');
      initializeInputValue()
    }
    else {
      setMode('RENDER');
    }
  }

  const submitDeleteChat = (e) => {
    e.preventDefault()
    const URL = e.target.getAttribute('href')
    const fetchData = async () => {
      const response = await APIcall('post', URL)
      if (response.status === 'good') {
        updateSideBar()
        updateChatList()
        navigate('/chat/list/')
      } else {
        console.log('error', response)
      }
    }
    fetchData()
  }

  return (
    <>
    <button className='modify-button' onClick={modifyTitle}></button>
    <a href={`/chat/delete/${chat_id}/`} className='delete-button' onClick={submitDeleteChat}> </a>
    </>
  )

}

export default ChatButtons