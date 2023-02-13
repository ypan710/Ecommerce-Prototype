import React from "react";
import axios from 'axios';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';


const Home = (props) => {

  const [listings, setListings] = React.useState([]);

  const axiosGetAndSetAllListings = () => {
    axios.get('/listing/getAll')
      .then((res) => {
        setListings(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  React.useEffect(() => {
    axiosGetAndSetAllListings()
  }, []);

  const goToListing = (listingId) => {
    props.history.push("/Listing/" + listingId + "/");
  }

  return (
    <div className='w-100'>
      <Container fluid className='p-4'>
        <Row className='text-center'>
          {listings.map((e, i) => (
            <Col xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
              <div className='px-2 pt-2 w-100 mt-1 bg-light border rounded mb-3' style={{cursor: 'pointer',}} onClick={() => goToListing(e._id)}>
                {e.thumbnail !== "" ? <Image className='w-100 rounded-top' src={e.thumbnail} fluid/> : <div><Image className='w-100 rounded-top' src="../../images/tree100.jpg" fluid/></div>}
                <div classname='w-100' style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{e.title}</div>
              </div>
            </Col>
          ))}
          
        </Row>
      </Container>
    </div>
  )
  
}

export default Home;
