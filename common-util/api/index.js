/* eslint-disable no-console */
import get from 'lodash/get';
import isFinite from 'lodash/isFinite';
import qs from 'qs';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

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
export const getContributeMetrics = async () => {
  try {
    const response = await fetch('/api/contribute-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching contribute metrics:', error);
    return null;
  }
};

// ----------- BABYDEGEN -----------
export const getBabydegenMetrics = async () => {
  try {
    const response = await fetch('/api/babydegen-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching babydegen metrics:', error);
    return null;
  }
};

// ----------- PREDICT -----------
export const getPredictMetrics = async () => {
  try {
    const response = await fetch('/api/predict-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching predict metrics:', error);
    return null;
  }
};

// ----------- PEARL DAAS -----------
export const getPredictDAAs = async () => {
  try {
    const response = await fetch('/api/pearl-daa');
    if (!response.ok) {
      throw new Error('Failed to fetch pearl DAAs');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pearl DAAs:', error);
    return null;
  }
};

// ----------- MECH -----------
export const getMechMetrics = async () => {
  try {
    const response = await fetch('/api/mech-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mech metrics:', error);
    return null;
  }
};

export const getFeeFlowMetrics = async () => {
  try {
    const response = await fetch('/api/mech-fees');
    if (!response.ok) {
      throw new Error('Failed to fetch mech fee flow metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mech fee flow metrics:', error);
    return null;
  }
};

// ----------- MAIN -----------
export const getMainMetrics = async () => {
  try {
    const response = await fetch('/api/main-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching main metrics:', error);
    return null;
  }
};

export const getTotalTokenHolders = async () => {
  try {
    const response = await fetch('/api/token-holders');
    if (!response.ok) {
      throw new Error('Failed to fetch total token holders');
    }

    const { totalTokenHolders } = await response.json();
    return Number.isFinite(totalTokenHolders) ? totalTokenHolders : null;
  } catch (error) {
    console.error('Error fetching total token holders:', error);
    return null;
  }
};

// ----------- GOVERN -----------
export const getGovernMetrics = async () => {
  try {
    const response = await fetch('/api/govern-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch govern metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching govern metrics:', error);
    return null;
  }
};

// ----------- MARKETPLACE -----------
export const getMarketplaceMetrics = async () => {
  try {
    const response = await fetch('/api/marketplace-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch marketplace metrics');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching marketplace metrics:', error);
    return null;
  }
};
