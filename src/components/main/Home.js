import React from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../Context/Auth/AuthContext';
import '../../assets/css/home.css'

import Layout from './Layout';

const Home = (props) => {
  const { isLoggedIn }  = React.useContext(AuthContext);

	return (
		<Layout className='main-page'>
      <div className='title-wrap'>
        <h3>CodeReview ChatBot에 오신것을 환영합니다.</h3>
      </div>
      <div className='content-wrap'>
        <p>CodeReview ChatBot은 여러분이 작성한 코드를 ChatGPT를 통해 분석하고, 리뷰를 해주는 서비스입니다.</p>
        <p>여러분이 ChatBot에게 질문한 내용은 물론, 다른 이용자들이 질문한 내용도 살펴 볼 수 있습니다.</p>
        <p>이 서비스를 통해서 여러분의 코드를 더욱 더 발전시켜나가세요!</p>
        <div className='link-wrap'>
        {isLoggedIn ? (
            <Link to='/chat/write/' className='button'>새로운 글 작성하기</Link>
          ) : (
          <>
            <Link to='/login/' className='button'>로그인</Link>
            <Link to='/signup/'className='button'>회원가입</Link>
          </>
          )
        }
        </div>
      </div>
		</Layout>
	);
};

export default Home;

// return (
//   <article className='error-page'>
//     <div className='title-wrap'>
//       <h3>정상적이지 않은 접근입니다.</h3>
//     </div>
//     <div className='content-wrap'>
//       <p>존재하지 않는 페이지거나, 페이지에 접근할 권한이 없습니다.</p>
//       <Link to='/chat/list/' className='button'>채팅 목록으로 이동</Link>
//     </div>
    
//   </article>
// );