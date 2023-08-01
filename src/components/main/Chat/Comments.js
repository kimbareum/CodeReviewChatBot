import React, { useContext, useEffect, useState } from "react";
import { APIcall, BASE_URL } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth/AuthContext";

import '../../../assets/css/comment.css'

const ReplayForm = ({chat_id, comment_id, submitComment, toggleReplyForm}) => {

  const submitReplyComment = (event) => {
    toggleReplyForm()
    submitComment(event)
  }

  return (
    <form action={`/chat/${chat_id}/comment/write/`} method="post" className="comment-form child-comment" onSubmit={submitReplyComment}>
      <input type="hidden" name="parent_comment_id" value={comment_id} />
      <textarea name="content" placeholder="댓글을 입력해주세요"></textarea>
      <input type="submit" value=" " className="button gray send-button"/>
    </form>
  )
}

const ChildComment = ({ child_comment, deleteComment, updateComment }) => {
  const [ showModifyForm, setShowModifyForm ] = useState(false);
  const [ inputValue, setInputValue ] = useState(false);
  
  const handleChange = (e) => {
    setInputValue(e.target.value);
  }

  const toggleModifyForm = () => {
    setShowModifyForm(!showModifyForm);
    setInputValue(child_comment.content)
  }

  const submitUpdate = (e) => {
    setShowModifyForm(false);
    updateComment(e);
  }

  return (
    <div className="comment-wrap child-comment">
      <div className="author-wrap">
        <img src={`${BASE_URL}${child_comment.writer_profile_image}`} alt="user-icon"/>
        <p>{child_comment.writer_nickname}/ {child_comment.created_at}</p>
      </div>
      <div className="comment-content">
        {showModifyForm?(
          <form action={`/chat/comment/update/child/${child_comment.id}/`} method="post" onSubmit={submitUpdate} className="update-form">
            <textarea name="content" value={inputValue} onChange={handleChange}></textarea>
            <input type='submit' className="button gray send-button" value=' '/>
          </form>
          ):
          (<p>{child_comment.content}</p>)
        }
        <div className="comment-buttons">
            {child_comment.user_owned && (
              <>
                <button type="button" className="modify-button" onClick={toggleModifyForm}></button>
                <form action={`/chat/comment/delete/child/${child_comment.id}/`} method="post" onSubmit={deleteComment}>
                  <button type="submit" className="delete-button"></button>
                </form>
              </>
            )}
        </div>
      </div>
    </div>
  )

}

const Comment = ({ comment, chat_id, submitComment, deleteComment, updateComment }) => {
  const [ showReplyForm, setShowReplyForm ] = useState(false);
  const [ showModifyForm, setShowModifyForm ] = useState(false);
  const [ inputValue, setInputValue ] = useState(comment.content)

  const handleChange = (e) => {
    setInputValue(e.target.value);
  }

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  }

  const toggleModifyForm = () => {
    setShowModifyForm(!showModifyForm);
    setInputValue(comment.content)
  }

  const submitUpdate = (e) => {
    setShowModifyForm(false);
    updateComment(e);
  }

  return (
    <div className="comment-wrap">
      <div className="author-wrap">
        <img src={`${BASE_URL}${comment.writer_profile_image}`} alt="user-icon"/>
        <p>{comment.writer_nickname}/ {comment.created_at}</p>
      </div>
      <div className="comment-content">
        {showModifyForm?(
          <form action={`/chat/comment/update/${comment.id}/`} method="post" onSubmit={submitUpdate} className="update-form">
            <textarea name="content" value={inputValue} onChange={handleChange}></textarea>
            <input type='submit' className="button gray send-button" value=' '/>
          </form>
          ):
          (<p>{comment.content}</p>)
        }
        <div className="comment-buttons">
            {comment.user_owned && (
              <>
                <button type="button" className="modify-button" onClick={toggleModifyForm}></button>
                <form action={`/chat/comment/delete/${comment.id}/`} method="post" onSubmit={deleteComment}>
                  <button type="submit" className="delete-button"></button>
                </form>
              </>
            )}
          <button type="button" className="reply-button" onClick={toggleReplyForm}></button>
        </div>
      </div>
      {comment.child_comments && (
        comment.child_comments.map((child_comment, index) => (
          <ChildComment child_comment={child_comment} deleteComment={deleteComment} updateComment={updateComment} key={`cc${index}`}/>
        ))
      )}
      {showReplyForm && <ReplayForm chat_id={chat_id} submitComment={submitComment} comment_id={comment.id} toggleReplyForm={toggleReplyForm} />}
    </div>
  )
}


const Comments = (props) => {

  const [comments, setComments] = useState(props.comments)
  const { isLoggedIn, logout } = useContext(AuthContext)
  // const [URL, setURL] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    setComments(props.comments)
  }, [props])

  const submitComment = async (e) => {
    e.preventDefault()
    const URL = e.target.getAttribute('action')
    const formData = new FormData(e.target)
    const response = await APIcall('post', URL, formData)
    e.target.content.value = ""

    if (response.status === 'good'){
      setComments(response.data)
    }
    else if (response.status === 'Unauthorized') {
      logout();
      navigate(`/login/`);
    }
    else {
      navigate(`/error/`);
    }
  }

  const deleteComment = async (e) => {
    e.preventDefault()
    const URL = e.target.getAttribute('action')
    const response = await APIcall('post', URL)
    // console.log(response)
    if (response.status === 'good') {
      setComments(response.data)
    }
    else if (response.status === 'Unauthorized') {
      logout();
      navigate(`/login/`);
    }
    else {
      navigate(`/error/`);
    }
  }

  const updateComment = async (e) => {
    e.preventDefault()
    const URL = e.target.getAttribute('action')
    const formData = new FormData(e.target)
    const response = await APIcall('post', URL, formData)
    if (response.status === 'good') {
      setComments(response.data)
    }
    else if (response.status === 'Unauthorized') {
      logout();
      navigate(`/login/`);
    }
    else {
      console.log(response);
      navigate(`/error/`);
    }
  }

  return (
    <div className="comment-container">
      {isLoggedIn&&(
      <form action={`/chat/${props.chat_id}/comment/write/`} method="post" className="comment-form" onSubmit={submitComment}>
        <textarea name="content" className="comment-input" placeholder="댓글을 입력해주세요"></textarea>
        <input type="submit" className="button gray send-button" value=' '/>
      </form>)}
      {comments&&
        comments.map((comment, index) => (
          <Comment comment={comment} chat_id={props.chat_id} key={index} submitComment={submitComment} deleteComment={deleteComment} updateComment={updateComment}/>
      ))}
    </div>
  )
}

export default Comments