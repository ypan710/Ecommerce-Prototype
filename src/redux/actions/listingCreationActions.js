import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
// import userInfoReducer from '../reducers/userInfoReducer';
import { setUserInformation } from './userInfoActions';

// const dispatch = useDispatch();

export const setListingCreationTitle = title => {
  return {
    type: 'SET_LISTING_CREATION_TITLE',
    title,
  };
};

export const setListingCreationDescription = description => {
  return {
    type: 'SET_LISTING_CREATION_DESCRIPTION',
    description,
  };
};

export const setListingCreationPrice = price => {
  return {
    type: 'SET_LISTING_CREATION_PRICE',
    price,
  };
};

export const setListingCreationType = listingType => {
  return {
    type: 'SET_LISTING_CREATION_TYPE',
    listingType,
  };
};

export const setListingCreationUploadImage = uploadImage => {
  return {
    type: 'SET_LISTING_CREATION_UPLOADIMAGE',
    uploadImage,
  };
};

export const setListingCreationImageInfo = imageInfo => {
  return {
    type: 'SET_LISTING_CREATION_IMAGEINFO',
    imageInfo,
  };
};

export const setListingCreationThumbnailUrl = thumbnailUrl => {
  return {
    type: 'SET_LISTING_CREATION_THUMBNAILURL',
    thumbnailUrl,
  };
};

export const setListingCreationUserId = userId => {
  return {
    type: 'SET_LISTING_CREATION_USERID',
    userId,
  };
};

export const submitCreatedListing = (history) => (dispatch, getState) => {
  console.log("getState().listingCreationReducer.imageInfo", getState().listingCreationReducer.imageInfo);
  const data = {
    title: getState().listingCreationReducer.title,
    description: getState().listingCreationReducer.description,
    price: getState().listingCreationReducer.price,
    type: getState().listingCreationReducer.type,
    uploadImage: getState().listingCreationReducer.uploadImage,
    imageInfo: getState().listingCreationReducer.imageInfo,
    thumbnailUrl: getState().listingCreationReducer.thumbnailUrl,
    
    // not needed
    // thumbnailUrl: getState().listingCreationReducer.thumbnailUrl,
    // userId: getState().listingCreationReducer.userId,
  }

  console.log("data for upload listing: ", data);

  axios.post('/listing/upload', data)
    .then((res) => {
      console.log("data from upload: ", res.data);
      const listingId = res.data.listingId;
      // console.log("listingId: ", listingId);
      history.push("/Listing/" + listingId + "/");
    })
    .catch(e => {
      console.log(e)
    });
  
  dispatch(setListingCreationTitle(''));
  dispatch(setListingCreationDescription(''));
  dispatch(setListingCreationPrice(''));
  dispatch(setListingCreationType(''));
  dispatch(setListingCreationUploadImage(''));
  dispatch(setListingCreationImageInfo(''));
  dispatch(setListingCreationThumbnailUrl(''));
  // dispatch(setListingCreationUserId(''));
};

export const submitEditedListing = (listingId, functionToFinishEditing) => (dispatch, getState) => {
  const data = {
    title: getState().listingCreationReducer.title,
    description: getState().listingCreationReducer.description,
    price: getState().listingCreationReducer.price,
    type: getState().listingCreationReducer.type,
    uploadImage: getState().listingCreationReducer.uploadImage,
    imageInfo: getState().listingCreationReducer.imageInfo,
    thumbnailUrl: getState().listingCreationReducer.thumbnailUrl,
    
    // not needed
    // thumbnailUrl: getState().listingCreationReducer.thumbnailUrl,
    // userId: getState().listingCreationReducer.userId,
  }

  console.log("listingId to be Edited: ", listingId);

  axios.post('/listing/edit/' + listingId, data)
    .then((res) => {
      const resListingId = res.data.listingId;
      console.log("res.data: ", res.data);
      functionToFinishEditing();
      // history.push("/Listing/" + listingId + "/");
    })
    .catch(e => {
      console.log(e)
    });
  
  dispatch(setListingCreationTitle(''));
  dispatch(setListingCreationDescription(''));
  dispatch(setListingCreationPrice(''));
  dispatch(setListingCreationType(''));
  dispatch(setListingCreationImageInfo(''));
  dispatch(setListingCreationThumbnailUrl(''));
  // dispatch(setListingCreationUserId(''));
};
