import React from 'react';
import './MNavBar.css';
import logo from '../../images/logo.png';
import userLogo from '../../images/user.png';

function MNavBar(user) {
    console.log("user",user.user.name)
  return (
    <div className='MNavbar'>
      <img className="logo" src={logo} alt='Logo' />
      <div className='username'>
        <img className="userlogo" src={userLogo} alt='User' />
        <h3>{user.user.name}</h3>
      </div>
    </div>
  );
}

export default MNavBar;
