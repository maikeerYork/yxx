import axios from 'axios'
import {getToken} from './auth'
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_SXT.includes('localhost')?url: process.env.VUE_APP_BASE_API_SXT,
    withCredentials: true, // send cookies when cross-domain requests
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