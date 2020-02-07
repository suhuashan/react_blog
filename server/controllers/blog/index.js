const { SuccessModel, ErrorModel } = require('../../util/response');
const { article: Article, user: User } = require('../../db/model');
const { removeDuplicate } = require('../../util/tool');
const { Op } = require('sequelize');

const ATTRIBUTES = [
    ['id', 'blogID'],
    ['author', 'blogAuthor'],
    ['title', 'blogTitle'],
    ['abstract', 'blogAbstract'],
    ['content', 'blogContent'],
    ['createdAt', 'blogTime'],
    ['tags', 'blogTags'],
    ['categories', 'blogCategories'],
    ['read', 'blogRead'],
    ['word', 'blogWord'],
    ['type', 'blogType']
];

//博客保存草稿或者发布博客
const savePublishBlog = async(ctx) => {
    let {
        blogType,
        blogTitle,
        blogAbstract,
        blogContent,
        blogTags,
        blogCategories,
        blogStatus
    } = ctx.request.body;

    try {
        await Article.create({
            author: ctx.session.username,
            userID: ctx.session.userID,
            title: blogTitle,
            abstract: blogAbstract,
            content: blogContent,
            tags: blogTags,
            categories: blogCategories,
            type: blogType,
            status: blogStatus,
            word: blogContent.length,
            read: 0
        });

        let res = await User.findOne({
            attributes: [
                'tags', 'categories'
            ],
            where: {
                username: ctx.session.username
            }
        });
        let { tags, categories } = res.dataValues;

        await User.update({
            tags: removeDuplicate(tags, blogTags),
            categories: removeDuplicate(categories, blogCategories)
        }, {
            where: {
                username: ctx.session.username
            }
        });

        let message = blogType === 'draft' ? '保存成功' : '发布成功';
        ctx.body = new SuccessModel(message);
    } catch (err) {
        ctx.body = new ErrorModel('操作失败');
    }

};

//获取首页博客列表
const getBlogList = async (ctx) => {
    let { limit, offset } =  ctx.request.body;
    try {
        let blogListTotal = await Article.findAll({where:{status: 'published'}});
        let blogList = await Article.findAll({
            attributes: ATTRIBUTES,
            where: {
                status: 'published'
            },
            order: [['createdAt', 'desc']],
            limit,
            offset
        });

        ctx.body = new SuccessModel({
            list: blogList,
            total: blogListTotal.length
        });
    } catch (err) {
        ctx.body = new ErrorModel('获取失败');
    }
};

//根据分类名筛选出对用的博客列表
const getBlogListByCategories = async (ctx) => {
    let { categoryName } = ctx.request.body;
    try {
        let res = await Article.findAll({
            attributes: ATTRIBUTES,
            where: {
                userID: ctx.session.userID,
                status: 'published',
                categories: {
                    [Op.like]:'%' +categoryName + '%'
                }
            }
        });
        ctx.body = new SuccessModel({
            list: res,
            total: res.length
        });
    } catch (e) {
        ctx.body = new ErrorModel('获取失败');
    }
};

//根据标签搜索出对应的博客列表
const getBlogListByTags = async (ctx) => {
    let { tagName } = ctx.request.body;
    try {
        let res = await Article.findAll({
            attributes: ATTRIBUTES,
            where: {
                userID: ctx.session.userID,
                status: 'published',
                tags: {
                    [Op.like]:'%' +tagName + '%'
                }
            }
        });
        ctx.body = new SuccessModel({
            list: res,
            total: res.length
        });
    } catch (e) {
        ctx.body = new ErrorModel('获取失败');
    }
};

module.exports = {
    'POST /blog/save_publish_blog': savePublishBlog,
    'POST /blog/get_blog_list': getBlogList,
    'POST /blog/get_blog_list/by_categories': getBlogListByCategories,
    'POST /blog/get_blog_list/by_tags': getBlogListByTags
}