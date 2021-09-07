import axios from 'axios'

axios.interceptors.request.use(
  function (config: any) {
    const headers = {...config.headers}

    return {...config, headers}
  },
  function (error: any) {
    return Promise.reject(error)
  },
)

export default axios
