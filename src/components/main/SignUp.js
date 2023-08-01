import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIsignup } from '../../utils/api';

import AuthContext from '../Context/Auth/AuthContext';
import Layout from './Layout';


const SignUp = (props) => {

  const navigate = useNavigate()
  const [errors, setErrors] = useState([])
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/chat/list/');
    }
  }, [isLoggedIn, navigate])


  const submitSignup = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const response = await APIsignup(formData)
    if (response.status) {
      navigate(`/login/`);
      setErrors([])
    }
    else {
      setErrors(response.data)
    }
  }

    return (
      <Layout className='signup-page'>
        <div className='title-wrap'>
          <h2>Sign Up</h2>
        </div>
        <form method='post' className='auth-form' onSubmit={ submitSignup }>
          <div className='auth-wrap'>
            {errors.throttle&&(<div className='error'>{errors.throttle}</div>)}
            <p>
              <label htmlFor='id_username'>아이디</label>
              <input type='text' name='username' id='id_username'/>
            </p>
            {errors.username&&(
                <>
                {errors.username.map((item, index)=> {
                  return <div className='error' key={index}>{item}</div>
                })}
                </>
              )
            }
            <p>
              <label htmlFor='id_nickname'>닉네임</label>
              <input type='text' name='nickname' id='id_nickname' maxLength='10'/>
            </p>
            <p>
              <label htmlFor='id_password'>비밀번호</label>
              <input type='password' name='password' id='id_password'/>
            </p>
            <p>
              <label htmlFor='id_password2'>비밀번호 확인</label>
              <input type='password' name='password2' id='id_password2'/>
            </p>
            {errors.password&&(
                <>
                {errors.password.map((item, index)=> {
                  return <div className='error' key={index}>{item}</div>
                })}
                </>
              )
            }
            <input className='button gray' type='submit' value="회원가입"/>
          </div>
        </form>
      </Layout>
    );
}

export default SignUp;