import React from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'
import '../assets/css/header.css';

function Header() {
    return (
      <header>
        <Link to='/'><h1 className="title"><img src={logo} alt="로고"/>CodeReview ChatBot</h1></Link>
      </header>
    );
}

export default Header
