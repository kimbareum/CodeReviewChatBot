import React, { useContext, useState } from 'react';
import { APIPasswordChange } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/Auth/AuthContext';

import Layout from '../Layout';

const PasswordChange = () => {

    const { logout }  = useContext(AuthContext);
    const [ errors, setErrors ] = useState([])
    const navigate = useNavigate();


    const submitChange = (e) => {
        e.preventDefault()
        
        const fetchData = async () => {
            const formData = new FormData(e.target)
            const response = await APIPasswordChange(formData)
            if (response.status === 'good') {
              logout()
              navigate(`/login/`);
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
      <Layout className='password-change-page'>
        <div className='title-wrap'>
          <h2>비밀번호 변경</h2>
        </div>
        <form method='post' className='auth-form' onSubmit={ submitChange }>
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
          {errors.password1&&(
                <>
                {errors.password1.map((item, index)=> {
                  return <div className='error' key={index}>{item}</div>
                })}
                </>
              )
            }
          <div className='auth-wrap'>
            <p>
              <label htmlFor='id_password'>현재 비밀번호</label>
              <input type='password' name='password' id='id_password' required/>
            </p>
            <p>
              <label htmlFor='id_password1'>새 비밀번호</label>
              <input type='password' name='password1' id='id_password1' required/>
            </p>
            <p>
              <label htmlFor='id_password2'>새 비밀번호 확인</label>
              <input type='password' name='password2' id='id_password2' required/>
            </p>
            <input className='button gray' type='submit' value="변경하기"/>
          </div>
        </form>
      </Layout>
    );
}

export default PasswordChange;