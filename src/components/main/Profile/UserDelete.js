import React, { useContext, useState } from 'react';
import { APIcall } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/Auth/AuthContext';

import Layout from '../Layout';

const UserDelete = () => {

    const { logout }  = useContext(AuthContext);
    const [ errors, setErrors ] = useState([])
    const navigate = useNavigate();


    const submitDelete = (e) => {
        e.preventDefault()
        
        const fetchData = async () => {
            const formData = new FormData(e.target)
            const response = await APIcall('post', '/user/delete/', formData)
            if (response.status === 'good') {
              logout()
              navigate(`/chat/list/`);
              setErrors([])
            }
            else if (response.status === 'Unauthorized') {
              logout();
              navigate(`/login/`);
            }
            else {
              setErrors(response.data.data)
            }
        }
        fetchData()
    }


    return (
      <Layout className='user-delete-page'>
        <div className='title-wrap'>
          <h2>회원 탈퇴</h2>
        </div>
        <form method='post' className='auth-form' onSubmit={ submitDelete }>
          <p>정말로 회원탈퇴를 원하시면, 비밀번호를 다시 입력해주세요.</p>
          <p>탈퇴하기 버튼을 누르면 즉시 회원탈퇴 됩니다.</p>
          {errors.non_field_errors && (
            <>
              {errors.non_field_errors.map((item, index) => {
                return (
                  <div className='error' key={index}>{item}</div>
                  )
                })
              }
            </>
            )
          }
          {errors.password&&(
                <>
                {errors.password.map((item, index)=> {
                  return <div className='error' key={index}>{item}</div>
                })}
                </>
              )
            }
          <div className='auth-wrap'>
            <p>
              <label htmlFor='id_password'>비밀번호</label>
              <input type='password' name='password' id='id_password' required/>
            </p>
            <input className='button gray' type='submit' value="탈퇴하기"/>
          </div>
        </form>
      </Layout>
    );
}

export default UserDelete;