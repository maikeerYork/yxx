import axios from 'axios'
import {getToken} from './auth'
const service = axios.create({
  baseURL:process.env.VUE_APP_BASE_API.includes('localhost')?url: process.env.VUE_APP_BASE_API, 
  // baseURL: 'http://112.91.103.18:8081',
  // baseURL: 'http://192.168.199.62:8081',
  // baseURL: 'http://114.117.188.189:8081',
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 13000 // request timeout
})


service.interceptors.request.use((config)=>{
  config.headers['Authorization'] = getToken()
  config.headers['Cache-Control'] = 'no-store'
  return config
},(error)=>{

   return Promise.reject(error)
})

service.interceptors.response.use((config)=>{

  return config
},(error)=>{

   return Promise.reject(error)
})

export default service
