import React, { useEffect } from "react";
import axios from 'axios';
import '../css/Inquiry.css';
import { Container, Row, Col, Image, Button, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import AdminPanelCard from './AdminPanelCard';

const AdminPanel = (props) => {

    const update = useSelector(globalState => globalState.inquiryReducer.update);

    const inquiry = props.inquiry;
    const listingId = props.listingId;
    const [showResponseInput, setShowResponseInput] = React.useState(false);
    const [responses, setResponses] = React.useState([]);
    const [responseMessage, setResponseMessage] = React.useState('');
    const [inquiries, setInquiries] = React.useState([]);


    useEffect(() => {
        setResponses([]);
        axiosGetAllResponses();
        axiosGetAllInquiries();
    }, []);

    useEffect(() => {
        if (update === "Responses updated") {
            console.log("Responses updated");
            axiosGetAllResponses();
        } else if (update === "Inquiries updated") {
            axiosGetAllInquiries();
        }
    }, [update]);

    const axiosGetAllResponses = () => {
        axios.get('/inquiry/adminGetAllResponse')
            .then((res) => {
                setResponses(res.data);
            })
            .catch(console.log);
    }

    const axiosGetAllInquiries = () => {
        axios.get('/inquiry/adminGetAllInquiries')
            .then((res) => {
                setInquiries(res.data);
                console.log(res.data, "inquiries");
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
            .catch((e) => { console.log(e) });
    }

    const handleResponseSumbit = () => {
        axiosSendResponse();
        setShowResponseInput(false);
        setResponseMessage('');
    }

    const handleInquiryClick = () => {
        setShowResponseInput(!showResponseInput);
    }

    const handleResponseKeyPress = () => {
        const key = window.event.keyCode;

        if (key === 13) {
            handleResponseSumbit()
        }
    }

    const handleResponseChange = (e) => {
        setResponseMessage(e.target.value);
    }

    return (
        <div style={{ width: "500px" }} className="inquiryDisplay">
            {inquiries.map((e, i) => (<AdminPanelCard inquiry={e} />))}
            {/* {inquiries.map((e, i) => (
                <div key={e._id}>
                    <div className="inquiryCard" onClick={handleInquiryClick}>
                        {e.message}
                        <div className="inquiryUndercard">
                            inquired by: {e.username}
                        </div>
                    </div>
                    <div>
                        {showResponseInput ?
                            <div className="inquiryCreation">
                                <Form>
                                    <Form.Group className="mb-3" controlId="formGridDecription">
                                        <Form.Label style={{ marginTop: '10px' }}>Response to Inquiry</Form.Label>
                                        <Form.Control as="textarea" placeholder="e.g. Thanks for the inquiry." onKeyPress={() => handleResponseKeyPress()} style={{ height: '50px' }} onChange={handleResponseChange} value={responseMessage} />
                                    </Form.Group>

                                    <Button className="inquirySubmitButton" variant="primary" type="button" onClick={handleResponseSumbit}>
                                        Submit
                                    </Button>
                                </Form>
                            </div>
                            : <div></div>}
                    </div>
                    <div className="responsesDiv">
                        {responses.filter((e) => e.inquiryID === e._id).map((e, i) => (
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
            ))} */}
        </div>
    )
}

export default AdminPanel;