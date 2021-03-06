import { fromJS } from "immutable";
import { actionTypes } from './index.js';

const defaultState = fromJS([{
    blogID: '',
    author: '',
    title: '',
    abstract: '',
    content: '',
    blogTime: ''
}]);

export default (previousState = defaultState, action) => {
    switch (action.type) {
        case actionTypes.GET_BLOG_BY_TAGS: 
            return previousState.merge(action.payload);
        default: 
            return previousState;
    }
}