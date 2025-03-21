import { isProduction } from "./isProduction"

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production App Engine URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
  const prodUrl = "https://hslu-rag-backend.onrender.com/api/v1"
  const devUrl = "http://127.0.0.1:8000/api/v1"
  

  return isProduction() ? prodUrl : devUrl
}