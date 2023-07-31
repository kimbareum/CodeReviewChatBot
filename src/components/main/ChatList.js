import React, { useEffect, useState, useContext } from 'react';
import { APIcall } from '../../utils/api';
import { Link } from 'react-router-dom';
import UpdateContext from '../Context/Update/UpdateContext';

import Layout from './Layout';

const ChatList = () => {

    const [chatList, setChatList] = useState([])
    const [page, setPage] = useState(1)
    const [paginator, setPaginator] = useState({page_range : [1], current_page : 1})
    const { chatListState } = useContext(UpdateContext)

    useEffect(() => {
      const fetchData = async () => {
        const response = await APIcall('get', `/chat/list/?page=${page}`);
        if (response.status === "good"){
          setChatList(response.data.chats)
          setPaginator(response.data.paginator)
        }
      }
      fetchData()
    }, [page, chatListState])

    const pageChange = (event) => {
        event.preventDefault()
        const target = parseInt(event.target.getAttribute('href').split('=')[1])
        setPage(target)
    }

    // console.log('chat-list')

    return (
        <Layout className='chat-list'>
          <div className='title-wrap'>
            <h3>Other User's Chat</h3>
          </div>
          <table className='list-wrap'>
            <thead>
              <tr className='list-head chat-wrap'>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>수정일</th>
              </tr>
            </thead>
            <tbody>
              {chatList.map((item) => (
                <tr className="chat-wrap" key={item.id}>
                  <td><Link to={`/chat/${item.id}`}>{item.title}</Link></td>
                  <td>{item.writer_nickname}</td>
                  <td>{item.view_count}</td>
                  <td>{item.updated_at}</td>
                </tr>
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
          <ul className='page-list'>
            {paginator.page_range.map((item, index) => (
              <li key={index}>
              {item === paginator.current_page? (
                <a href={`/chat/list/?page=${item}`} className='page button gray current-page'  onClick={pageChange}>{item}</a>
              ) : (
                <a key={index} href={`/chat/list/?page=${item}`} className='page button gray'  onClick={pageChange}>{item}</a>
              )}
              </li>
            ))}
          </ul>
        </Layout>
    );
}

export default ChatList;