import React, { useContext } from 'react'
import { APIcall } from '../../../utils/api'

import UpdateContext from '../../Context/Update/UpdateContext'
import { useNavigate } from 'react-router-dom'

const ChatButtons = (props) => {
  const chat_id = props.chat_id
  const navigater = useNavigate()
  const { updateSideBar, updateChatList } = useContext(UpdateContext)

  const modifyTitle = () => {
    if (props.mode === 'RENDER'){
      props.setMode('MODIFY');
      props.initializeInputValue()
    }
    else {
      props.setMode('RENDER');
    }
  }

  const submitDeleteChat = (event) => {
    event.preventDefault()
    const URL = event.target.getAttribute('href')
    const fetchData = async () => {
      const response = await APIcall('post', URL)
      if (response.status === 'good') {
        updateSideBar()
        updateChatList()
        navigater('/chat/list/')
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