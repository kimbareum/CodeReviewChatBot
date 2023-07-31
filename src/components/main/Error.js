import React from 'react';
import { Link } from 'react-router-dom';

import Layout from './Layout';

const Error = () => {
    return (
      <Layout className='error-page'>
        <div className='title-wrap'>
          <h3>정상적이지 않은 접근입니다.</h3>
        </div>
        <div className='content-wrap'>
          <p>존재하지 않는 페이지거나, 페이지에 접근할 권한이 없습니다.</p>
          <p>Chatbot에게 할 수 있는 질문은 하루에 5개로 제한되어 있습니다.</p>
          <Link to='/chat/list/' className='button'>채팅 목록으로 이동</Link>
        </div>
      </Layout>
    );
}

export default Error;