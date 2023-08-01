import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { APIcall } from '../../utils/api';
import logo from '../../assets/images/logo.png'
import UpdateContext from '../Context/Update/UpdateContext';

import Layout from './Layout';

const ChatWrite = () => {
    const [wait, setWait] = useState(false)
    const { logout, updateSideBar } = useContext(UpdateContext)
    const navigate = useNavigate();

    const submitQuestion = (event) => {
      event.preventDefault();
      setWait(true);
      const formData = new FormData();
      const content = `[{
        "role": "user",
        "content": ${JSON.stringify(event.target.content.value)}
      }]`;
      formData.append("title", event.target.title.value);
      formData.append("content", content);
      event.target.content.value = ""
      
      const fetchData = async() => {
          const response = await APIcall('post', '/chat/write/', formData);
          if (response.status === "good"){
            updateSideBar();
            navigate(`/chat/${response.data.id}`);
          } 
          else if (response.status === 'Unauthorized') {
            logout();
            navigate(`/login/`);
          }
          else {
            navigate('/error/');
          }
          setWait(false);
      }
      fetchData()
    }

    // console.log('chat-write')

    return (
        <Layout className='write-page'>
          <form method='post' onSubmit={ submitQuestion }>
            <div className='title-wrap'>
              <h2><input name='title' type='text' placeholder='제목을 입력해주세요.' maxLength='30'/></h2>
            </div>
            <div className='chat-window'>
              <div className='ai-chat'>
                <img src={logo} alt="ai-icon"/>
                <div className='chat-content'>질문을 입력해주세요</div>
              </div>
              {wait && (
                  <div className='ai-chat'>
                    <img src={logo} alt="ai-icon"/>
                    <div className='chat-content'>답변을 생성하고 있습니다. 잠시만 기다려주세요.</div>
                  </div>
                )
              }
            </div>
            <div className='chat-form'>
              <textarea name='content' placeholder='질문을 입력해주세요.'/>
              {wait?(<input className='button gray loading' type='submit' value=' ' disabled/>):(<input className='button gray' type='submit' value=' '/>)}
            </div>
          </form>
          
        </Layout>
    );
}

export default ChatWrite;