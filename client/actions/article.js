import fetch from 'isomorphic-fetch';
import { API } from '../config';

export const createArticle = (article, token) => {

    console.log(`article  ${JSON.stringify(article)}`);


    return fetch(`${API}/articles`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: article
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listArticlesWithCategories = (skip, limit) => {
    const data = {
        limit,
        skip
    };
    return fetch(`${API}/articles-categories`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const singleArticle = slug => {
    return fetch(`${API}/articles/${slug}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

