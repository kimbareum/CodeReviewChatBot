import React, { useContext, useEffect, useState } from 'react';
import Layout from './Layout';
import { APIcall, BASE_URL } from '../../utils/api';
import AuthContext from '../Context/Auth/AuthContext';
import UpdateContext from '../Context/Update/UpdateContext';
import { useNavigate } from 'react-router-dom';

import '../../assets/css/profile.css'

const Profile = () => {

  const [nickname, setNickname] = useState([]);
  const [imagePath, setImagePath] = useState('');
  const [mode, setMode] = useState('UNUPDATED')
  const { logout, updateProfile } = useContext(AuthContext);
  const { updateSideBar } = useContext(UpdateContext)
  const navigate = useNavigate();


  const handleNicknameChange = (e) => {
    setNickname(e.target.value)
  }

  const handelImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    // FileReader로 이미지 URL 읽어오기
    reader.onloadend = () => {
      setImagePath(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  
  const submitProfile = async (e) => {
    e.preventDefault();
    setMode('UNUPDATED')
    const data = new FormData(e.target)
    const response = await APIcall('post', '/user/profile/', data)
    if (response.status==='good'){
      setNickname(response.data.nickname)
      setImagePath(`${BASE_URL}${response.data.image}`)
      updateProfile(response.data)
      updateSideBar()
      setMode('UPDATED')
    }
    else if (response.status === 'Unauthorized') {
      logout();
      navigate(`/login/`);
    }
    else {
      navigate(`/error/`);
    }
  }

  useEffect( () => {
    const fetchData = async () => {
      const response = await APIcall('authGet', '/user/profile/')
      if (response.status==='good'){
        setNickname(response.data.nickname)
        setImagePath(`${BASE_URL}${response.data.image}`)
      }
      else if (response.status === 'Unauthorized') {
        logout();
        navigate(`/login/`);
      }
      else {
        navigate(`/error/`);
      }
    }
    fetchData()
  }, [logout, navigate])

    return (
      <Layout className='profile-page'>
        <div className='title-wrap'>
          <h2>Profile</h2>
        </div>
      <form method='post' className='profile-form' onSubmit={submitProfile}>
        <div className='profile-wrap'>
          <p>
            <label htmlFor='id_nickname'>닉네임</label>
            <input type='text' name='nickname' id='id_nickname' value={nickname} onChange={handleNicknameChange} maxLength='10'/>
          </p>
          <p>
            <img src={imagePath} alt='user-icon' />
          </p>
          <p>
            <label htmlFor='id_image'>프로필 이미지</label>
            <input type='file' name='image' id='id_image' accept="image/*" onChange={handelImageChange}/>
          </p>
          {mode==='UPDATED'&&<p>닉네임과 프로필 이미지의 수정이 완료되었습니다.</p>}
          <input className='button gray' type='submit' value="수정"/>
        </div>
      </form>
      </Layout>
    );
}

export default Profile;