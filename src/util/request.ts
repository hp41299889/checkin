import axios, { AxiosInstance } from "axios";

const request = (baseUrl = ""): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrl,
  });
  return instance;
};

export const checkinApi = request(process.env.REACT_APP_CHECKIN_API_BASE_URL);
