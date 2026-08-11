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
  // Strapi 5's single-entity route keys on `documentId`, not the numeric `id`,
  // so fetch by an `id` filter and return the first match.
  const params = {
    populate: '*',
    'filters[id][$eq]': id,
  };
  const json = await apiCall('education-articles', params);
  return get(json, 'data[0]') || null;
};

// ----------- BLOGS -----------
/**
 * Strapi clamps a page to 100 entries however large `pagination[limit]` is, so
 * asking for 1000 in one call silently returns the first 100 and drops the rest.
 * Page through instead. Mirrored in `components/Content/Articles.tsx` and
 * `next-sitemap.config.js`, which read the same endpoint.
 */
const STRAPI_MAX_PAGE_SIZE = 100;

export const getBlogs = async () => {
  const blogs = [];
  let page = 1;
  let pageCount = 1;

  do {
    const params = {
      sort: ['datePublished:desc'],
      populate: '*',
      'pagination[page]': page,
      'pagination[pageSize]': STRAPI_MAX_PAGE_SIZE,
    };
    const json = await apiCall('blog-posts', params);
    blogs.push(...(get(json, 'data') || []));

    pageCount = get(json, 'meta.pagination.pageCount') || 1;
    page += 1;
    // Bound the loop so a malformed `pageCount` cannot spin.
  } while (page <= pageCount && page <= 50);

  return blogs;
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
    // Strapi 5's single-entity route keys on `documentId`, not the numeric `id`,
    // so fetch by an `id` filter and return the first match.
    const idParams = { ...params, 'filters[id][$eq]': id };
    const json = await apiCall('blog-posts', idParams);
    return get(json, 'data[0]') || null;
  }

  // id is `slug` here
  const slugParams = { ...params, 'filters[slug][$eq]': id };
  const json = await apiCall('blog-posts', slugParams);
  return get(json, 'data[0]') || null;
};
