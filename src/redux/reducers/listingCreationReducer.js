const INITIAL_STATE = {
  title: '',
  description: '',
  price: '',
  type: '',
  uploadImage: '',
  imageInfo: '',
  thumbnailUrl: '',
  userId: '',
};

const listingCreationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_LISTING_CREATION_TITLE':
      return {
        ...state,
        title: action.title
      };
    case 'SET_LISTING_CREATION_DESCRIPTION':
      return {
        ...state,
        description: action.description
      };
    case 'SET_LISTING_CREATION_PRICE':
      return {
        ...state,
        price: action.price
      };
    case 'SET_LISTING_CREATION_TYPE':
      return {
        ...state,
        type: action.listingType
      };
    case 'SET_LISTING_CREATION_UPLOADIMAGE':
      return {
        ...state,
        imageUrl: action.uploadimage
      };
    case 'SET_LISTING_CREATION_IMAGEINFO':
      return {
        ...state,
        imageInfo: action.imageInfo
      };
    case 'SET_LISTING_CREATION_THUMBNAILURL':
      return {
        ...state,
        thumbnailUrl: action.thumbnailUrl
      };
    case 'SET_LISTING_CREATION_USERID':
      return {
        ...state,
        userId: action.userId
      };
    default:
      return state;
  }
};

export default listingCreationReducer;
