/* eslint-disable no-console */
import get from 'lodash/get';
import isFinite from 'lodash/isFinite';
import qs from 'qs';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const CERAMIC_URL = `https://ceramic-valory.hirenodes.io/api/v0/streams/${process.env.NEXT_PUBLIC_STREAM_ID}?sync=0`;

const apiCall = async (subURL, params) => {
  const stringifyParams = qs.stringify(params);

  try {
    const url = `${API_URL}/${subURL}${params ? '?' : ''}${stringifyParams}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }

  return null;
};

// ----------- EDUCATION ARTICLES -----------
export const getEducationArticles = async () => {
  const params = {
    populate: '*',
  };
  const json = await apiCall('education-articles', params);
  const data = get(json, 'data') || [];
  return data;
};

export const getEducationArticle = async (id) => {
  const params = {
    populate: '*',
  };
  const json = await apiCall(`education-articles/${id}`, params);
  const data = get(json, 'data') || null;
  return data;
};

// ----------- BLOGS -----------
export const getBlogs = async () => {
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    // fetches max of 1000 blogs on the homepage
    'pagination[limit]': 1000,
  };
  const json = await apiCall('blog-posts', params);
  const data = get(json, 'data') || [];
  return data;
};

/**
 * `Blog` should be able to return a response if queried with `id` or `slug`.
 * If `filters` query is used, the response will be an array hence return the 1st element fetched
 *
 * @example
 * /blog/1
 * /blog/blog-one
 *
 */

export const isIdUsedToFetchBlog = (id) => !!isFinite(Number(id));

export const getBlog = async (id) => {
  const params = { populate: '*' };

  if (isIdUsedToFetchBlog(id)) {
    const json = await apiCall(`blog-posts/${id}`, params);
    return get(json, 'data') || null;
  }

  // id is `slug` here
  const slugParams = { ...params, 'filters[slug][$eq]': id };
  const json = await apiCall('blog-posts', slugParams);
  return get(json, 'data[0]') || null;
};

// ----------- FUNNELS -----------
export const getFunnel = async (id) => {
  const params = {
    populate: '*',
  };
  const json = await apiCall(`funnels/${id}`, params);
  const data = get(json, 'data') || null;
  return data;
};

// ----------- CONTRIBUTORS -----------
export const getTotalOlasContributors = async () => {
  try {
    const response = await fetch(CERAMIC_URL);
    const json = await response.json();

    const contributors = json.state.content.users;
    const totalOlasContributors = Object.values(contributors).filter(
      (e) => !!e.wallet_address && e.points !== 0,
    ).length;
    return totalOlasContributors;
  } catch (error) {
    console.error(error);
  }
};

// ----------- BABYDEGEN -----------
export const getAverageAprs = async () => {
  try {
    const response = await fetch('/api/babydegen-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching average APRs:', error);
    return null;
  }
};
