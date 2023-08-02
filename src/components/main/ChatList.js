import React, { useEffect, useState, useContext } from 'react';
import { APIcall } from '../../utils/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UpdateContext from '../Context/Update/UpdateContext';

import Layout from './Layout';

import '../../assets/css/chatlist.css';

const ChatList = () => {

    const [chatList, setChatList] = useState([])
    const [paginator, setPaginator] = useState({page_range : [1], current_page : 1, prev_button: null, next_button: null})
    const [ showSearchModal, setShowSearchModal ] = useState(false)
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type') || '';
    const text = searchParams.get('text') || '';
    const page = searchParams.get('page') || 1;
    let initialTitle = type && text ? `${type ==="title" ? '제목': 'content' ? '내용': '작성자'} ${text} 검색결과` : "Other User's Chat"
    const [ title, setTitle ] = useState(initialTitle)
    const [ searchOption, setSearchOption ] = useState({type:type, text:text, page:page})
    const { chatListState } = useContext(UpdateContext)

    const navigate = useNavigate()

    useEffect(() => {
      const fetchData = async () => {
        const response = await APIcall('get', `/chat/list/`, { params:searchOption });
        if (response.status === "good"){
          setChatList(response.data.chats)
          setPaginator(response.data.paginator)
        }
      }
      fetchData()
    }, [page, chatListState, searchOption])

    const pageChange = (event) => {
        event.preventDefault()
        const target = parseInt(event.target.getAttribute('href').split('=')[1])
        setSearchOption({...searchOption, page:target})
        navigate(`/chat/list/?type=${searchOption.type}&text=${searchOption.text}&page=${target}`)
    }

    const submitSearch = async (e) => {
      e.preventDefault()
      const params = {
        type: e.target.type.value,
        text: e.target.searchText.value,
      }
      setTitle(`${params.type} : ${params.text} 검색결과`)
      setSearchOption(params)
      setShowSearchModal(!showSearchModal)
      navigate(`/chat/list/?type=${params.type}&text=${params.text}&page=1`)
    }

    const toggleSearchModal = (e) => {
      if (e.target.nodeName!=="INPUT" && e.target.nodeName!=="SELECT" && e.target.type !== 'submit'){
        setShowSearchModal(!showSearchModal)
      }
    }

    const resetSearchValue = () => {
      setSearchOption({type: "", text: "", page:1})
      setTitle("Other User's Chat")
      navigate(`/chat/list/?page=1`)
    }

    return (
        <Layout className='chat-list'>
          <div className='title-wrap'>
            <h2>{title}</h2>
          </div>
          {showSearchModal&&(
            <div className='search-box' onClick={toggleSearchModal}>
              <div className='search-wrap'>
                <h3>검색하기</h3>
                <button type="button" className='close-button'>x</button>
                <form action="/chat/list/" method='get' className='search-form' onSubmit={submitSearch}>
                  <select name="type">
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="writer">작성자</option>
                  </select>
                  <input type='text' name='searchText' required/>
                  <button type="submit" className='button gray search-button'></button>
                </form>
              </div>
            </div>
          )}
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
            {paginator.prev_button && <li><a href={`/chat/list/?page=${paginator.prev_button}`} className='page button gray pn-button'  onClick={pageChange}>PREV</a></li>}
            {paginator.page_range.map((item, index) => (
              <li key={index}>
              {item === paginator.current_page? (
                <a href={`/chat/list/?page=${item}`} className='page button gray current-page'  onClick={pageChange}>{item}</a>
              ) : (
                <a key={index} href={`/chat/list/?page=${item}`} className='page button gray'  onClick={pageChange}>{item}</a>
              )}
              </li>
            ))}
            {paginator.next_button && <li><a href={`/chat/list/?page=${paginator.next_button}`} className='page button gray pn-button'  onClick={pageChange}>NEXT</a></li>}
            {!showSearchModal&&(
            <div className='search-button-wrap'>
              <button type='button' className='reset-button' onClick={resetSearchValue}></button>
              <button type='button' className='search-button' onClick={toggleSearchModal}></button>
            </div>)}
          </ul>
        </Layout>
    );
}

export default ChatList;