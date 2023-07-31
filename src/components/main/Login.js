import React, { useContext, useState, useEffect } from 'react';
import { APIlogin } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Context/Auth/AuthContext';

import Layout from './Layout';

const Login = (props) => {

    const { login, isLoggedIn }  = useContext(AuthContext);
    const [ errors, setErrors ] = useState([])
    const navigater = useNavigate();

    useEffect(() => {
      if (isLoggedIn) {
        navigater('/chat/list/');
      }
    }, [isLoggedIn, navigater])

    const submitLogin = (event) => {
        event.preventDefault()
        
        const fetchData = async () => {
            const formData = new FormData(event.target)
            const response = await APIlogin(formData)
            if (response.status) {
              login(response.data)
              navigater(`/chat/list/`);
              setErrors([])
            }
            else {
              setErrors(response.data.non_field_errors)
            }
        }
        fetchData()
    }

    // console.log('login')

    return (
      <Layout className='login-page'>
        <div className='title-wrap'>
          <h3>Login</h3>
        </div>
        <form method='post' className='auth-form' onSubmit={ submitLogin }>
          {errors && (
            <>
              {errors.map((item, index) => {
                return (
                  <div className='error' key={index}>{item}</div>
                  )
                })
              }
            </>
            )
          }
          <div className='auth-wrap'>
            <p>
              <label htmlFor='id_username'>아이디</label>
              <input type='text' name='username' id='id_username' required/>
            </p>
            <p>
              <label htmlFor='id_password'>비밀번호</label>
              <input type='password' name='password' id='id_password' required/>
            </p>
            <input className='button gray' type='submit' value="로그인"/>
          </div>
        </form>
      </Layout>
    );
}

export default Login;