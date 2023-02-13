import React from "react";
import axios from 'axios';
import { Container, Row, Col, Image, Button, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import '../css/Inquiry.css';
import { 
  setUpdate,
  setMessage,
  getInquiries, 
  inquireOnListing } 
  from '../redux/actions/inquiryActions';
import InquiryCard from "./InquiryCard";
import { Link } from "react-router-dom";

const Inquiries = (props) => {
  const dispatch = useDispatch();
 
  const listing = props.listing;
  const listingId = props.listingId;

  const update = useSelector(globalState => globalState.inquiryReducer.update);
  const listOfInquiries = useSelector(globalState => globalState.inquiryReducer.inquiries);
  const inquiryText = useSelector(globalState => globalState.inquiryReducer.message);

  const userId = useSelector(globalState => globalState.userInfoReducer.userId);
  const admin = useSelector(globalState => globalState.userInfoReducer.admin);
  const loggedIn = useSelector(globalState => globalState.userInfoReducer.loggedIn);

  React.useEffect(() => {
    dispatch(getInquiries(listingId));
  }, []);

  React.useEffect(() => {
    if(update === "Inquiries updated") {
      console.log("Inquiries updated");
      dispatch(getInquiries(listingId));
    } else if(update === "Responses updated") {

    } 
    dispatch(setUpdate(""));
  }, [update])

  const handleInquiryKeyPress = () => {
    const key = window.event.keyCode;

    if(key === 13) {
      handleInquirySumbit()
    }
  }

  const handleMessageChange = (e) => {
    dispatch(setMessage(e.target.value));
  }

  const handleInquirySumbit = () => {
    dispatch(inquireOnListing(listingId));
  }

  return (
    <div className="inquiriesMainDiv">
      {loggedIn?
        <>
          <div className="inquiryCreation">
            <Form>
              <Form.Group className="mb-3" controlId="formGridDecription">
                <Form.Label style={{ marginTop: '10px' }}>Make an Inquiry</Form.Label>
                <Form.Control as="textarea" placeholder="e.g. I am interest in this car." onKeyPress={() => handleInquiryKeyPress()} style={{ height: '50px' }} onChange={handleMessageChange} value={inquiryText}/>
              </Form.Group>

              <Button className="inquirySubmitButton" variant="primary" type="button"  onClick={handleInquirySumbit}> 
                Submit
              </Button>
            </Form>
          </div>

          <div className="inquiryDisplay">
            {listOfInquiries.map((e, i) => (
              <div>
                {userId && (admin || listing.userID === userId || e.userID === userId) ? <InquiryCard inquiry={e} listingId={listingId}/> : <div></div>}
              </div>
            ))}
          </div>
        </>
        : <div className="inquiryCreation">
        <Form>
          <Form.Group className="mb-3" controlId="formGridDecription">
            <Form.Label style={{ marginTop: '10px' }}><Link to='/login'>Log in</Link> to make an Inquiry</Form.Label>
            <Form.Control as="textarea" placeholder="e.g. I am interest in this car." onKeyPress={() => handleInquiryKeyPress()} style={{ height: '50px' }} onChange={handleMessageChange} value={inquiryText} disabled/>
          </Form.Group>

          <Button className="inquirySubmitButton" variant="primary" type="button"  onClick={handleInquirySumbit} disabled> 
            Submit
          </Button>
        </Form>
      </div>
      }
    </div>
           
  )
}

export default Inquiries;