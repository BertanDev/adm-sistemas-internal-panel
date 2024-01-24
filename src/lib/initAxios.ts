import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  // baseURL: 'http://52.67.230.154:8080',
})

export { api }
