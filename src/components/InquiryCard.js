import React, { useEffect } from "react";
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

const InquiryCard = (props) => {

  const inquiry = props.inquiry;
  const listingId = props.listingId;
  const [showResponseInput, setShowResponseInput] = React.useState(false);
  const [responses, setResponses] = React.useState([]);
  const [responseMessage, setResponseMessage] = React.useState('');

  const update = useSelector(globalState => globalState.inquiryReducer.update);

  useEffect(() => {
    setResponses([]);
    axiosGetResponses();
  }, []);

  useEffect(() => {
    if(update === "Responses updated") {
      console.log("Responses updated");
      axiosGetResponses();
    } else if(update === "Inquiries updated") {
      
    }
  }, [update]);

  const handleInquiryClick = () => {
    setShowResponseInput(!showResponseInput);
  }

  const handleResponseKeyPress = () => {
    const key = window.event.keyCode;

    if(key === 13) {
      handleResponseSumbit()
    }
  }

  const axiosGetResponses = () => {
    axios.get(`/inquiry/getAllResponses/${listingId}`)
        .then((res) => {
          setResponses(res.data);
        })
        .catch(console.log);
  }

  const axiosSendResponse = () => {
    const body = {
      message: responseMessage,
    }
    axios.post(`/inquiry/respond/${listingId}/${inquiry._id}/${inquiry.userID}`, body)
      .then(() => {
      })
      .catch((e) => {console.log(e)});
  }

  const handleResponseSumbit = () => {
    axiosSendResponse();
    setShowResponseInput(false);
    setResponseMessage('');
  }

  const handleResponseChange = (e) => {
    setResponseMessage(e.target.value);
  }

  const handleDeleteInquiry = () => {
    axios.post('/inquiry/delete/' + inquiry)
    .then((res) => {
      
    })
    .catch(e => {
      console.log(e)
    });
  }

  return (
    <div key={inquiry._id}>
      <div className="inquiryCard" onClick={handleInquiryClick}>
        {inquiry.message}
        <div className="inquiryUndercard">
          inquired by: {inquiry.username}
        </div>
      </div>

      <div>
        {showResponseInput ? 
          <div className="inquiryCreation">
            {/* <Button className="inquiryDeleteButton" variant="primary" type="button"  onClick={handleDeleteInquiry}> 
                Delete
              </Button> */}
            <Form>
              <Form.Group className="mb-3" controlId="formGridDecription">
                <Form.Label style={{ marginTop: '10px' }}>Response to Inquiry</Form.Label>
                <Form.Control as="textarea" placeholder="e.g. Thanks for the inquiry." onKeyPress={() => handleResponseKeyPress()} style={{ height: '50px' }} onChange={handleResponseChange} value={responseMessage}/>
              </Form.Group>

              <Button className="inquirySubmitButton" variant="primary" type="button"  onClick={handleResponseSumbit}> 
                Submit
              </Button>
            </Form>
          </div>
        : <div></div>}
      </div>

      <div className="responsesDiv">
        {responses.filter((e) => e.inquiryID === inquiry._id).map((e, i) => (
          <div className="responseCard">
            <div className="responseTopcard">
              {e.message}
            </div>
            <div className="responseUndercard">
              responded by: {e.username}
            </div>
          </div>
        ))}
      </div>
    </div>
    
  )
}

export default InquiryCard;