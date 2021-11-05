/*
 * This file abstracts out a lot of the axios logic to process
 * queries and responses. It also caches responses to avoid
 * having to get 10,000 element responses multiple times.
 *
 * Based on the same abstraction from Jeferson's project.
 * You can find that implementation in JS here:
 * https://gitlab.com/forbesye/fitsbits/-/blob/master/front-end/src/library/APIClient.js
 */

import axios from 'axios';
import { IntentionallyAny } from './utilities';

const CLIENT = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ?? 'https://api.campuscatalog.me',
});

export const getAPI = async ({
  id,
  model,
  params,
}: {
  id?: string;
  model: string;
  params?: string;
}): Promise<IntentionallyAny> => {
  let url = id ? `/${model}/${id}` : `/${model}`;
  if (params) url += `?${params}`;
  return getData(url);
};

const getData = async (url: string): Promise<IntentionallyAny> => {
  const { data } = await CLIENT.get(url);
  return data;
};
