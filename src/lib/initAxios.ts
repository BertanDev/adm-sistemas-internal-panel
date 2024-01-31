import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  // baseURL: 'http://54.207.219.196:8080',
})

export { api }
