import axios from "axios";
import './css/NavBar.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect } from 'react';
import IcRoundMailOutline from './img_component/message.jsx';
import IcOutlineSearch from './img_component/search.jsx';
import IcRoundHome from './img_component/home.jsx';
import IcBaselinePlus from './img_component/plus.jsx';
import { useAuth } from './Login/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export function NavBar() {
  const { isAuth, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    if (isAuth) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/account/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark" className='app_navbar'>
        <Nav><Nav.Link onClick={() => handleNavClick("/")}> <IcRoundHome color='white'/> </Nav.Link></Nav>
        <Nav><Nav.Link onClick={() => handleNavClick("/discover")}> <IcOutlineSearch color='white'/> </Nav.Link></Nav>
        <Nav><Nav.Link onClick={() => handleNavClick("/create_post")}> <IcBaselinePlus color='white'/> </Nav.Link></Nav>
        <Nav><Nav.Link onClick={() => handleNavClick("/messages")}> <IcRoundMailOutline color='white'/> </Nav.Link></Nav>
        <Nav>
          {isAuth && currentUser ? (
            <Nav.Link onClick={() => handleNavClick(`/profile/${currentUser.username}`)}>
              <img
                src={`http://localhost:8080${currentUser.profile_picture}`}
                alt="profile"
                className="author_profile_picture_component navbar_profile_picture"
              />
            </Nav.Link>
          ) : (
            <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}
