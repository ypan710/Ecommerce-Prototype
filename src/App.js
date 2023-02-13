import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { updateMessages, handlTextChange, submitMessage } from './redux/actions/messageActions';
import { setUserInformation } from './redux/actions/userInfoActions';
import './App.css';

import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import Registration from "./components/Registration";
import CreateListing from "./components/CreateListing";
import Listing from "./components/Listing";
import ResizeImage from "./components/ResizeImage";
import AdminPanel from "./components/AdminPanel"

const Message = ({ data }) => (<div>{data}</div>);

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const user = Cookies.get('session');
    if(user) {
      const parsedUser = JSON.parse(user);
      const userInfo = {
        username: parsedUser.username,
        userId: parsedUser.userID,
        loggedIn: true,
        admin: parsedUser.admin
      }
      dispatch(setUserInformation(userInfo));
    }
  }, []);

    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/Login" exact component={Login} />
            <Route path="/Registration" exact component={Registration} />
            <Route path="/CreateListing" exact component={CreateListing} />
            <Route path="/Listing/:listingId" exact component={Listing}/>
            <Route path="/Resize" exact component={ResizeImage} />
            <Route path="/AdminPanel" exact component={AdminPanel} />
          </Switch>
        </div>
      </BrowserRouter>
      
    );
  
  
}

export default App;
