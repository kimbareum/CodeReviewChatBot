import './assets/css/reset.css';
import './assets/css/global.css';
import './assets/css/button.css';
import './assets/css/App.css';
import './assets/css/header.css';
import './assets/css/SideBar.css';
import './assets/css/chatlist.css';
import './assets/css/article.css';
import './assets/css/chat.css';
import './assets/css/auth.css';
import './assets/css/error.css';

import React from 'react';
import { BrowserRouter} from 'react-router-dom';

import AuthProvider from './components/Context/Auth/AuthProvider';
import UpdateProvider from './components/Context/Update/UpdateProvider';
import Header from './components/Header';
import Main from './components/Main';


function App() {    

    return (
      <AuthProvider>
        <UpdateProvider>
          <BrowserRouter basename="/CodeReviewChatBot">
            <div className="App">
              <Header />
              <main className="main">
                <Main />
              </main>
            </div>
          </BrowserRouter>
        </UpdateProvider>
      </AuthProvider>
    );
}

export default App;
