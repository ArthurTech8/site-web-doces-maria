import axios from 'axios'

// O endereço da API vem do arquivo .env (VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default api
