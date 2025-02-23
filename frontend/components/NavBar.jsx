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
   useEffect(() => {
     if (localStorage.getItem('access_token') !== null) {
        setIsAuth(true);
      }
    }, [isAuth]);
     return (
      <div>
        <Navbar bg="dark" variant="dark" className='app_navbar'>
          <Nav className="me-auto">{isAuth ? <Nav.Link href="/"> <IcRoundHome color='white'/> </Nav.Link> : null}</Nav>
          <Nav><Nav.Link href="/search"> <IcOutlineSearch color='white'/> </Nav.Link></Nav>
          <Nav><Nav.Link href="/create_post"> <IcBaselinePlus color='white'/> </Nav.Link></Nav>
          <Nav><Nav.Link href="/message"> <IcRoundMailOutline color='white'/> </Nav.Link></Nav>
          <Nav>{isAuth ? <Nav.Link href="/logout">Logout</Nav.Link> : <Nav.Link href="/login">Login</Nav.Link>}</Nav>
        </Navbar>
       </div>
     );
}