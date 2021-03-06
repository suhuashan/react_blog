import { actionTypes } from './index.js';
import { GET_BLOG_LIST_BY_CATEGORIES } from '@/const/api/index.js';
import ajax from '@/util/request.js';
import get from 'lodash/get';

export const getBlogListByCategories = (categoryName) => {
    return (dispatch) => {
        ajax({
            method: 'post',
            url: GET_BLOG_LIST_BY_CATEGORIES,
            data: {
                categoryName
            }
        }).then(res => {
            dispatch({
                type: actionTypes.GET_BLOG_BY_CATEGORIES,
                payload: {
                    blogList: get(res, 'data.list', []),
                    blogNum: get(res, 'data.total', 0)
                }
            })
        })
    };
}