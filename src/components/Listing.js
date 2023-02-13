import React from "react";
import axios from 'axios';
import { Container, Row, Col, Image, Button, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setListingCreationTitle, 
  setListingCreationDescription, 
  setListingCreationPrice, 
  setListingCreationType, 
  setListingCreationImageUrl,
  setListingCreationThumbnailUrl, 
  setListingCreationUserId, 
  submitCreatedListing,
  setListingCreationUploadImage,
  submitEditedListing } 
  from '../redux/actions/listingCreationActions';

import '../css/Listing.css';
import Inquiries from './Inquiries.js';


const Listing = (props) => {

  const listingId = props.match.params.listingId;

  const dispatch = useDispatch();

  const [listingProcessing, setListingProcessing] = React.useState(false);

  const [listing, setListing] = React.useState();
  const [listingImageUrl, setListingImageUrl] = React.useState();
  const [listingTitle, setListingTitle] = React.useState();
  const [listingType, setListingType] = React.useState();
  const [listingPrice, setListingPrice] = React.useState();
  const [listingDescription, setListingDescription] = React.useState();
  const [editing, setEditing] = React.useState(false);

  const editedListingTitle = useSelector(globalState => globalState.listingCreationReducer.title);
  const editedListingDescription = useSelector(globalState => globalState.listingCreationReducer.description);
  const editedListingPrice = useSelector(globalState => globalState.listingCreationReducer.price);
  const editedListingType = useSelector(globalState => globalState.listingCreationReducer.type);

  const userId = useSelector(globalState => globalState.userInfoReducer.userId);
  const admin = useSelector(globalState => globalState.userInfoReducer.admin);

  const axiosGetListing = () => {
    axios.get('/listing/get/' + listingId)
      .then((res) => {
        console.log("res.data: ", res.data);
        setListing(res.data);
        setListingImageUrl(res.data.image);
        setListingTitle(res.data.title);
        setListingType(res.data.type);
        const displayPrice = res.data.price.toFixed(2);
        setListingPrice(displayPrice);
        setListingDescription(res.data.description);
        setListingProcessing(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // React.useEffect(() => {
  //   console.log("admin: ", admin);
  // }, [admin]);

  React.useEffect(() => {
    axiosGetListing();
    setEditing(false);
  }, []);

  const handleTitleChange = (e) => {
    dispatch(setListingCreationTitle(e.target.value));
  }

  const handleDescriptionChange = (e) => {
    dispatch(setListingCreationDescription(e.target.value));
  }

  const handlePriceChange = (e) => {
    dispatch(setListingCreationPrice(e.target.value));
  }

  const handleTypeChange = (e) => {
    dispatch(setListingCreationType(e.target.value));
  }

  const handleEdit = () => {
    setEditing(true);
    dispatch(setListingCreationTitle(listingTitle));
    dispatch(setListingCreationDescription(listingDescription));
    dispatch(setListingCreationPrice(listingPrice));
    dispatch(setListingCreationType(listingType));
  }

  const handleSubmitEdit = () => {
    setListingProcessing(true);
    setListing(undefined);
    setListingImageUrl(undefined);
    setListingTitle(undefined);
    setListingType(undefined);
    setListingPrice(undefined);
    setListingDescription(undefined);
    setTimeout(() => {
      dispatch(submitEditedListing(listingId, handleFinishEditing));
    }, 2000);
  }

  const handleFinishEditing = () => {
    setEditing(false);
    axiosGetListing();
  }

  const handleStopEditing = () => {
    setEditing(false);
  }

  const handleDelete = () => {
    axios.post('/listing/delete/' + listingId)
    .then((res) => {
      props.history.push("/");
    })
    .catch(e => {
      console.log(e)
    });
  }

  return (
    <div style={{ padding: "10px", marginTop: "50px" }}>
      {listingProcessing ? 
      <div>
        <Spinner animation="border" variant="secondary" style={{ marginRight: "20px" }}/>
        Processing....
      </div>
      :
      <div>
        {listing ? 
          <div className="listingMainDiv"> 
            <div className="listingCard">
              <div className="listingImage">
                {listingImageUrl !== "" ? <Image className='w-100 rounded-top' src={listingImageUrl} fluid/> : <div><Image className='w-100 rounded-top' src="../../images/tree500.jpg" fluid/></div>}
                {/* <Image src={listingImageUrl} rounded/> */}
              </div>
              {editing ? 
                <div style={{ marginTop: "10px" }}>
                  <Form>
                    <Form.Group className="mb-3" controlId="formGridTitle">
                      <Form.Label>Title</Form.Label>
                    <Form.Control placeholder="Title" onChange={handleTitleChange} value ={editedListingTitle}/>
                  </Form.Group>

                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridType">
                      <Form.Label>Type</Form.Label>
                      <Form.Control placeholder="e.g. Car" onChange={handleTypeChange} value ={editedListingType}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" step="0.01" placeholder="e.g. 3.50" onChange={handlePriceChange} value={editedListingPrice}/>
                    </Form.Group>
                  </Row>
    
                  <Form.Group className="mb-3" controlId="formGridDecription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder="e.g. This is a nice car." style={{ height: '100px' }} onChange={handleDescriptionChange} value={editedListingDescription}/>
                  </Form.Group>
                </Form>

                  <div className="listingAdminButtons">
                    <Button className="listingEditButton" variant="primary" type="button" onClick={handleSubmitEdit}> 
                      Submit Edit
                    </Button>
                    <Button className="listingEditButton" variant="primary" type="button" onClick={handleStopEditing}> 
                      Stop Editing Post
                    </Button>
                  </div> 
                </div>
              : 
                <div>
                  <div className="listingText">
                    <h5 className="listingTitle text-center">
                      {listingTitle}
                    </h5>
                    <div className="listingPrice">
                    <b style={{fontStyle: 'normal',}}>Price: </b>{"$" + listingPrice}
                    </div>
                    <div className="listingItem">
                      <b>Type: </b>{listingType}
                    </div>
                    <div className="listingDescription">
                      <b>Description: </b>{listingDescription}
                    </div>
                  </div>
                
                  {userId && (admin || listing.userID === userId) 
                  ? 
                    <div className="listingAdminButtons">
                      <Button className="listingEditButton" variant="primary" type="button" onClick={handleEdit}> 
                        Edit Post
                      </Button>
                      <Button className="listingDeleteButton" variant="primary" type="button" onClick={handleDelete}> 
                        Delete Post
                      </Button>
                    </div> 
                  : 
                    <div></div>
                  }
                </div>
              }

              <Inquiries listingId={listingId} listing={listing}/>             

            </div>
            
          </div>
        : 
          <div> </div>
        }
      </div>
      }
      
    </div>
  )
  
}

export default Listing;
