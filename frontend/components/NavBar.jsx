import axios from "axios";
import './css/NavBar.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect} from 'react';
import IcRoundMailOutline from './img_component/message.jsx';
import IcOutlineSearch from './img_component/search.jsx';
import IcRoundHome from './img_component/home.jsx';
import IcBaselinePlus from './img_component/plus.jsx'


export function NavBar() {
   const [isAuth, setIsAuth] = useState(false);
   const [currentUser, setCurrentUser] = useState(null);
   const [users, setUsers] = useState([]);
   const token = localStorage.getItem("access_token");
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


   useEffect(() => {
     if (localStorage.getItem('access_token') !== null) {
        setIsAuth(true);
      }
    }, [isAuth]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token || !API_BASE_URL) return;

        const response = await axios.get(`${API_BASE_URL}/account/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUser(response.data);

      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUserData();
  }, [token, API_BASE_URL]);


  useEffect(() => {
    if (!API_BASE_URL) return;
    axios
      .get(`${API_BASE_URL}/account/`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  }, [API_BASE_URL]);


     return (
      <div>
        <Navbar bg="dark" variant="dark" className='app_navbar'>
          <Nav ><Nav.Link href="/"> <IcRoundHome color='white'/> </Nav.Link></Nav>
          <Nav><Nav.Link href="/discover"> <IcOutlineSearch color='white'/></Nav.Link></Nav>
          <Nav><Nav.Link href="/create_post"> <IcBaselinePlus color='white'/> </Nav.Link></Nav>
          <Nav><Nav.Link href="/messages"> <IcRoundMailOutline color='white'/> </Nav.Link></Nav>
            <Nav>
              {isAuth && currentUser ? (
                <Nav.Link href={`/profile/${currentUser.username}`}>
                  <img
                    src={`${API_BASE_URL}${currentUser.profile_picture}`}
                    alt="profile"
                    className="author_profile_picture_component"
                  />
                </Nav.Link>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )}
            </Nav>
        </Navbar>
       </div>
     );
}