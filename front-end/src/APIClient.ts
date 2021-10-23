import axios from 'axios';
import { IntentionallyAny } from './utilities';

const CLIENT = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ?? 'https://api.campuscatalog.me',
});

export const getAPI = async ({
  id,
  model,
}: {
  id?: string;
  model: string;
}): Promise<IntentionallyAny> => {
  const url = id ? `/${model}/${id}` : `/${model}`;
  return getData(url);
};

const getData = async (url: string): Promise<IntentionallyAny> => {
  const { data } = await CLIENT.get(url);
  return data;
};
