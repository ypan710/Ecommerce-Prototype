import React, { useEffect } from "react";
import axios from 'axios';
// import multer from 'multer';
import Clipper from 'image-clipper';
import { Container, Row, Col, Image, Form, Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setListingCreationTitle, 
  setListingCreationDescription, 
  setListingCreationPrice, 
  setListingCreationType, 
  setListingCreationImageInfo,
  setListingCreationThumbnailUrl, 
  setListingCreationUserId, 
  submitCreatedListing,
  setListingCreationUploadImage } 
  from '../redux/actions/listingCreationActions';

const CreateListing = (props) => {

  const dispatch = useDispatch();

  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "public/images");
  //   },
  //   filename: () => {
  //     const fileExt = file.mimetype.split('/')[1];
  //     const randomName = Math.random().toString().split(".")[1].substring(0,12);
  //     cb(null, `${randomName}.${fileExt}`);
  //   }
  // })

  // const upload = multer({ storage: storage });

  const [uploadImage, setUploadImage] = React.useState();
  const [listingProcessing, setListingProcessing] = React.useState(false);

  const title = useSelector(globalState => globalState.listingCreationReducer.title);
  const description = useSelector(globalState => globalState.listingCreationReducer.description);
  const price = useSelector(globalState => globalState.listingCreationReducer.price);
  const type = useSelector(globalState => globalState.listingCreationReducer.type);
  const imageInfo = useSelector(globalState => globalState.listingCreationReducer.imageInfo);
  const thumbnailUrl = useSelector(globalState => globalState.listingCreationReducer.thumbnailUrl);
  const userId = useSelector(globalState => globalState.listingCreationReducer.userId);

  useEffect(() => {
    console.log("uploadImage: ", uploadImage);
  }, [uploadImage])

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

  const handleUploadImageChange = (e) => {
    // console.log("e.target.file[0]: ", e.target.file[0]);
    // setUploadImage(e.target.file[0]);
    // setTimeout(() => {
    //   console.log("uploadImage: ", uploadImage);
    // }, 2000);
    setUploadImage(e);
  }

  const handleImageUrlChange = (e) => {
    // dispatch(setListingCreationImageUrl(e.target.value));
  }

  const handleThumbnailUrlChange = (e) => {
    // dispatch(setListingCreationThumbnailUrl(e.target.value));
  }

  const handleUserIdChange = (e) => {
    dispatch(setListingCreationUserId(e.target.value));
  }

  const handleSumbit = () => {
    setListingProcessing(true);

    // console.log("title: ", title);
    // console.log("description: ", description);
    // console.log("price: ", price);
    // console.log("type: ", type);
    // console.log("imageUrl: ", imageUrl);
    // console.log("thumbnailUrl: ", thumbnailUrl);
    // console.log("userId: ", userId);

    setTimeout(() => {
      dispatch(submitCreatedListing(props.history));
    }, 2000);
  }

  const handleTest = () => {
    // upload.file();
  }

  return (
    <div className="form-container" style={{ padding: "50px", marginTop: "75px" }}>
      <h4 className="form-heading" style={{ marginBottom: "20px" }}>Enter information to create a listing!</h4>
      {listingProcessing ? 
      <div>
        <Spinner animation="border" variant="secondary" style={{ marginRight: "20px" }}/>
        Processing....
      </div>
      :
      <Form>
        <Form.Group className="mb-3" controlId="formGridTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control placeholder="Title" onChange={handleTitleChange} value ={title}/>
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridType">
            <Form.Label>Type</Form.Label>
            <Form.Control placeholder="e.g. Car" onChange={handleTypeChange} value ={type}/>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" step="0.01" placeholder="e.g. 3.50" onChange={handlePriceChange} value={price}/>
          </Form.Group>
        </Row>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload an image</Form.Label>
          <Form.Control type="file" accept="image/jpeg, image/gif, image/png" onChange={e => {
            let image = URL.createObjectURL(e.target.files[0])
            Clipper(image, function() {
              this.toDataURL(dataUrl => dispatch(setListingCreationUploadImage(dataUrl)))
            })
            Clipper(image, function() {
              this.resize(500, 500).quality(100).toDataURL(dataUrl => dispatch(setListingCreationImageInfo(dataUrl)))
            })
            Clipper(image, function() {
              this.resize(100, 100).quality(100).toDataURL(dataUrl => dispatch(setListingCreationThumbnailUrl(dataUrl)))
            })
          }}/>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formGridDecription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" placeholder="e.g. This is a nice car." style={{ height: '100px' }} onChange={handleDescriptionChange} value={description}/>
        </Form.Group>

        {/* <Form.Group className="mb-3" id="formGridCheckbox">
          <Form.Check type="checkbox" label="Click here to accept the Privacy Aggrement" />
        </Form.Group> */}

        <Button variant="primary" type="button" onClick={handleSumbit}> 
          Submit
        </Button>

        {/* <Button variant="primary" type="button" onClick={handleTest}> 
          Test
        </Button> */}
      </Form>
      }

    </div>
  )
}

export default CreateListing;
