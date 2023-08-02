import axios from "axios";

export const BASE_URL = 'https://codereviewchatbot.space'
// export const BASE_URL = 'http://127.0.0.1:8000'

const authAPI = axios.create({
  baseURL: BASE_URL,
})

const API = axios.create({
  baseURL: BASE_URL,
})


const methodList = {
  'get': API.get,
  'post': authAPI.post,
  'authGet': authAPI.get,
}

const getResponse = async(method, url, data) => {
  return await methodList[method](BASE_URL+url, data)
  .then((res) => {
    const data = res.data;
    return {status: "good", data: data};
  })
  .catch((e) => {
    throw e.response;
  })
}

export const APIcall = async (method, url, data) => {
  try {
    return await getResponse(method, url, data);
  }
  catch(e) {
    if (e.status===401) {
      const refresh = await tokenRefresh()
      if (!refresh){
        return {status: "Unauthorized"}
      }
      try{
        return getResponse(method, url, data)
      }
      catch(e) {
        const errors = e;
        return {status: "fail", data: errors}
      }
    }
    const errors = e;
    return {status: "fail", data: errors}
  }
}


export const APIlogin = async (data) => {

  return await API.post(BASE_URL+'/user/login/', data, {
    withCredentials: true,
    credentials: 'include',
  })
    .then((res) => {
      const data = res.data;
      // console.log(document.cookie)
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      // authAPI.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');
      return {status: true, data: data.user}
    })
    .catch((e) => {
      const errors = e.response.data
      return {status: false, data: errors}
    })
}


export const APIlogout = async () => {
  return await API.post(BASE_URL+'/user/logout/', null, {
    withCredentials: true,
    credentials: 'include',
  })
    .then((res) => {
      const data = res.data;
      axios.defaults.headers.common['Authorization'] = null;
      return data
    })
}

export const APIsignup = async (data) => {

  return await API.post(BASE_URL+'/user/signup/', data)
    .then((res) => {
      return {status: true}
    })
    .catch((e) => {
      if (e.response.status === 429) {
        const errors = {throttle: "회원가입은 하루에 한번만 가능합니다."}
        return {status: false, data: errors}
      }
      const errors = e.response.data
      return {status: false, data: errors}
    })
}


export const tokenRefresh = async () => {
  // axios.defaults.headers.common['Authorization'] = null;
  return await API.post(BASE_URL+'/user/token/refresh/', null, {
    withCredentials: true,
    credentials: 'include',
  }).then((res) => {
      const data = res.data;
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      return data.user
    }).catch((e) => {
      return false
    })
}
