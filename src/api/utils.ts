import { HTTP_CODE } from "./httpConstants";
const { SUCCESS,CREATED, SERVER_ERROR, BAD_REQUEST } = HTTP_CODE;

export const handleResponse = (response:any) => {
  const { status, data, statusText } = response;
  if (status === SUCCESS || status === CREATED) return data;
  if (status === SERVER_ERROR) {
   return statusText;
  }
  if(status === BAD_REQUEST) {
    return data;
  }
};

export const handleError = (error:any) => {
  throw error.response && error.response.data;
};
 
