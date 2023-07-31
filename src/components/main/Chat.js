import React from 'react';
import {useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL, APIcall } from '../../utils/api';
import AuthContext from '../Context/Auth/AuthContext';
import UpdateContext from '../Context/Update/UpdateContext';

import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

import Layout from './Layout';
import ChatTitle from './Chat/ChatTitle';
import Comments from './Chat/Comments';

import logo from '../../assets/images/logo.png'



const Chat = () => {
    const { chat_id } = useParams();
    const [ chat, setChat ] = useState({});
    const [ comments, setComments ] = useState([]);
    const [ mode, setMode ] = useState('');
    const [ wait, setWait ] = useState('');
    const [ userOwned, setUserOwned] = useState(false)
    const { logout, isLoggedIn } = useContext(AuthContext);
    const { updateSideBar } = useContext(UpdateContext)
    const navigater = useNavigate()


    const render = useCallback((response) => {
      if (response.status === 'good'){
        setChat(response.data.chat)
        setComments(response.data.comments)
        // console.log(comments)
        if (response.data.user_owned){
          setUserOwned(true)
        } else {
          setUserOwned(false)
        }
        setMode('RENDER')
      }
      else if (response.status === 'Unauthorized') {
        logout();
        navigater(`/login/`);
      }
      else {
        navigater(`/error/`);
      }
    }, [logout, navigater])


    useEffect(() => {
      const fetchData = async () => {
        let response = {}
        if (isLoggedIn){
          response = await APIcall('authGet', `/chat/detail/${chat_id}/`);
          }
          else {
            response = await APIcall('get', `/chat/detail/${chat_id}/`);
          }
          render(response)
        }
        fetchData()
    }, [chat_id, render, isLoggedIn])


    const submitQuestion = (event) => {
      event.preventDefault();
      // 서버로 전송할 데이터 양식을 만듭니다.
      if (!event.target.content.value){
        return
      }
      const content = {
        "role": "user",
        "content": event.target.content.value
      }
      // 기존 데이터와 입력된 값을 합칩니다.
      const tempChatContent = JSON.parse(chat.content)
      tempChatContent.push(content)
      const stringifyJSON = JSON.stringify(tempChatContent)
      const newChatContent = {...chat, content:stringifyJSON}
      // 새롭게 만들어진 chat을 content를 만들고 로딩창을 렌더링합니다.
      setChat(newChatContent)
      setWait(true)
      // formData를 만들고 서버로 전송합니다.
      const formData = new FormData()
      formData.append("title", event.target.title.value)
      formData.append("content", stringifyJSON)
      const fetchData = async() => {
        const response = await APIcall('post', `/chat/${chat.id}/update/`, formData)
        render(response)
        if (response.status === 'good') {
          updateSideBar()
          setWait(false)
        }
        else if (response.status === 'Unauthorized') {
          logout();
          navigater(`/login/`);
        }
        else {
          navigater('/error/');
        }
      }
      fetchData()
    } 

    return (
        <Layout className='chat-page'>
          <ChatTitle chat={chat} userOwned={userOwned}/>
          <div className='chat-window'>
            {mode === 'RENDER' ? (
              <>
              {JSON.parse(chat.content).map((item, index) => {
                return (
                  item.role === "user" ? (
                    <div key={index} className='user-chat'>
                      <img src={`${BASE_URL}${chat.writer_profile_image}`} alt="user-icon"/>
                      <pre className='chat-content'>{item.content}</pre>
                    </div>
                  ) : (
                    <div key={index} className='ai-chat'>
                      <img src={logo} alt="ai-icon"/>
                      <ReactMarkdown
                        className="chat-content"
                        remarkPlugins={[remarkGfm]} // Allows us to have embedded HTML tags in our markdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
                                wrapLines={true} 
                                language={match[1]}
                                PreTag="pre"
                                {...props}
                                style={materialDark}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code {...props}>{children}</code>
                            );
                          }
                        }}
                        >
                        {item.content}
                      </ReactMarkdown>
                    </div>
                  )
                );
              })}
                {wait && (
                  <>
                  <div className='ai-chat'>
                    <img src={logo} alt="ai-icon"/>
                    <div className='chat-content'>답변을 생성하고 있습니다. 잠시만 기다려주세요.</div>
                  </div>
                  </>
                )
                }
                {userOwned && (
                  <form method='post' className='chat-form' onSubmit={ submitQuestion }>
                    <input type='hidden' name='title' value={chat.title}/>
                    <textarea name='content' placeholder='질문을 입력해주세요.'/>
                    {wait?(<input className='button gray loading' type='submit' value=' ' disabled/>):(<input className='button gray' type='submit' value=' '/>)}
                  </form>
                )}
              </>
          ) : (
            <>
              <p>로딩중</p>
            </>
          )}
          </div>
          <hr/>
          <Comments chat_id={chat_id} comments={comments}/>
        </Layout>
    );
}

export default Chat;