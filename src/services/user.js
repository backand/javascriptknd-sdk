import { Promise } from 'es6-promise'
import { URLS } from './../constants'

export default {
  getUserDetails,
  getUsername,
  getUserRole,
  getToken,
  getRefreshToken,
}

function __generateFakeResponse__ (status = 0, statusText = '', headers = [], data = '') {
  return {
    status,
    statusText,
    headers,
    data
  }
}
function __getUserDetailsFromStorage__ (scb, ecb) {
  return new Promise((resolve, reject) => {
    let user = backand.utils.storage.get('user');
    if (!user) {
      ecb && ecb(__generateFakeResponse__(0, '', [], 'No cached user found. authentication is required.'));
      reject(__generateFakeResponse__(0, '', [], 'No cached user found. authentication is required.'));
    }
    else {
      scb && scb(__generateFakeResponse__(200, 'OK', [], user.details));
      resolve(__generateFakeResponse__(200, 'OK', [], user.details));
    }
  });
}
function getUserDetails (scb, ecb, force = false) {
  if (!force) {
    return __getUserDetailsFromStorage__(scb, ecb);
  }
  else {
    return backand.utils.http({
      url: URLS.profile,
      method: 'GET',
    })
    .then(response => {
      let user = backand.utils.storage.get('user');
      let newDetails = response.data;
      backand.utils.storage.set('user', {
        token: user.token,
        details: Object.assign({}, user.details, newDetails)
      });
      return __getUserDetailsFromStorage__(scb, ecb);
    });
  }
}
function getUsername (scb, ecb) {
  return __getUserDetailsFromStorage__(null, ecb)
    .then(response => {
      response.data = response.data['username'];
      scb && scb(response);
      return response;
    });
}
function getUserRole () {
  return __getUserDetailsFromStorage__(null, ecb)
    .then(response => {
      response.data = response.data['role'];
      scb && scb(response);
      return response;
    });
}
function getToken () {
  return __getUserDetailsFromStorage__(null, ecb)
    .then(response => {
      response.data = response.data['access_token'];
      scb && scb(response);
      return response;
    });
}
function getRefreshToken () {
  return __getUserDetailsFromStorage__(null, ecb)
    .then(response => {
      response.data = response.data['refresh_token'];
      scb && scb(response);
      return response;
    });
}
