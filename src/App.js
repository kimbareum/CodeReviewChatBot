import './assets/css/reset.css';
import './assets/css/global.css';
import './assets/css/button.css';
import './assets/css/App.css';
import './assets/css/article.css';
import './assets/css/auth.css';

import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';

import AuthProvider from './components/Context/Auth/AuthProvider';
import UpdateProvider from './components/Context/Update/UpdateProvider';
import Header from './components/Header';
import Main from './components/Main';


function App() {    

    return (
      <AuthProvider>
        <UpdateProvider>
          <Router basename="/CodeReviewChatBot">
            <div className="App">
              <Header />
              <main className="main">
                <Main />
              </main>
            </div>
          </Router>
        </UpdateProvider>
      </AuthProvider>
    );
}

export default App;
