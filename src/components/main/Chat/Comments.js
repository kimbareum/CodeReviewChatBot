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

const Comment = ({ comment, chat_id, submitComment, deleteComment }) => {
  const [ showReplyForm, setShowReplyForm ] = useState(false);

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  }

  return (
    <div className="comment-wrap">
      <div className="author-wrap">
        <img src={`${BASE_URL}${comment.writer_profile_image}`} alt="user-icon"/>
        <p>{comment.writer_nickname}/ {comment.created_at}</p>
      </div>
      <div className="comment-content">
        <p>{comment.content}</p>
        <div className="comment-buttons">
            {comment.user_owned && (
              <form action={`/chat/comment/delete/${comment.id}/`} method="post" onSubmit={deleteComment}>
                <button type="submit" className="delete-button"></button>
              </form>
            )}
          <button type="button" className="reply-button" onClick={toggleReplyForm}></button>
        </div>
      </div>
      {comment.child_comments && (
        comment.child_comments.map((child_comment, index) => (
          <div className="comment-wrap child-comment" key={`cc${index}`}>
            <div className="author-wrap">
              <img src={`${BASE_URL}${child_comment.writer_profile_image}`} alt="user-icon"/>
              <p>{child_comment.writer_nickname}/ {child_comment.created_at}</p>
            </div>
            <div className="comment-content">
              <p>{child_comment.content}</p>
              <div className="comment-buttons">
                  {child_comment.user_owned && (
                  <form action={`/chat/comment/delete/child/${child_comment.id}/`} method="post" onSubmit={deleteComment}>
                    <button type="submit" className="delete-button"></button>
                  </form>
                  )}
              </div>
            </div>
          </div>
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
  const navigater = useNavigate()

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
      navigater(`/login/`);
    }
    else {
      navigater(`/error/`);
    }
  }

  const deleteComment = async (e) => {
    e.preventDefault()
    const URL = e.target.getAttribute('action')
    const response = await APIcall('post', URL)
    console.log(response)
    if (response.status === 'good') {
      setComments(response.data)
    }
    else if (response.status === 'Unauthorized') {
      logout();
      navigater(`/login/`);
    }
    else {
      navigater(`/error/`);
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
          <Comment comment={comment} chat_id={props.chat_id} key={index} submitComment={submitComment} deleteComment={deleteComment}/>
      ))}
    </div>
  )
}

export default Comments