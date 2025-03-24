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


   useEffect(() => {
     if (localStorage.getItem('access_token') !== null) {
        setIsAuth(true);
      }
    }, [isAuth]);




  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) return;

        const response = await axios.get("http://127.0.0.1:8000/api/connected-user/", {
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
  }, [token]);



  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/account/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  }, []);



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
                    src={`http://127.0.0.1:8000${currentUser.profile_picture}`}
                    alt="profile"
                    className="author_profile_picture_component"
                  />
                </Nav.Link>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )}
            </Nav>




          {/* <Nav>{isAuth ? <Nav.Link href="/logout">Logout</Nav.Link> : <Nav.Link href="/login">Login</Nav.Link>}</Nav> */}
        </Navbar>
       </div>
     );
}