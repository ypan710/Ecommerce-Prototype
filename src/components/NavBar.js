import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setLoggedinStatus, setUserInformation } from '../redux/actions/userInfoActions';
import { Container, Row, Col, } from 'react-bootstrap';

const NavBar = () => {
  const dispatch = useDispatch();

  const userId = useSelector(globalState => globalState.userInfoReducer.userId);
  const username = useSelector(globalState => globalState.userInfoReducer.username);
  const loggedIn = useSelector(globalState => globalState.userInfoReducer.loggedIn);
  const admin = useSelector(globalState => globalState.userInfoReducer.admin);

  // getting user details from session
  // const [userLoggedIn, setUserLoggedIn] = React.useState(Cookies.get('session'));

  function logOut() {
    console.log("loggedIn: ", loggedIn);
    axios.post('/auth/logout')
      .then(() => {
        Cookies.remove('session');
        dispatch(setLoggedinStatus(false));
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoggedinStatus(false));
      });
  }

  return (
    <Container fluid className='bg-dark'>
      <Row className='text-center'>
        <Col className="home_button m-auto">
          <Link className='btn btn-lg btn-dark shadow-none' to='/'>Home</Link>
        </Col>
        {/* <Col className="log_status">
          {username === ''} 
        </Col> */}
        {/* {loggedIn ? <><Col>Logged in as {username}</Col> <Col><button onClick={logOut}>Log Out</button></Col></> : <Col><Link to='/Login'>Log in</Link></Col>} */}
        {/* <button onClick={logOut}>Log Out</button>
        <button onClick={something}>Something</button> */}
        <Col className="create-listing m-auto">
          <Link className='btn btn-lg btn-dark shadow-none' to='/CreateListing'>
            {/* Icon  */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 20 20">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
            </svg>
            &nbsp;Post
          </Link>
        </Col>
        {loggedIn 
          ? <>
            <Col className="m-auto">
              {admin && <Link className='btn btn-lg btn-dark shadow-none' to='/AdminPanel'>Admin</Link>}
            </Col>
            <Col className='text-light m-auto' style={{ fontSize: '1.25em' }}>
              Logged in as: {username}
            </Col>
            <Col className='m-auto'>
              <button className='btn btn-lg btn-dark shadow-none' onClick={logOut}>
                Log&nbsp;Out
              </button>
            </Col></> 
          : <>
            <Col className="register m-auto">
              <Link className='btn btn-lg btn-dark shadow-none' to='/Registration'>
                Register
              </Link>
            </Col>
            <Col className='m-auto'>
              <Link className='btn btn-lg btn-dark shadow-none' to='/Login'>
                Log&nbsp;in
              </Link>
            </Col></>
        }
      </Row>
    </Container>
  )

}

export default NavBar;