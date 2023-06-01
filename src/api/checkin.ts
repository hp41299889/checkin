import { checkinApi } from "../util/request";

export const getCheckin = async (id: string) => {
  return await checkinApi.get(`/signup/${id}`);
};

export const patchCheckinById = async (id: string) => {
  return await checkinApi.patch(`/signup/${id}`);
};
