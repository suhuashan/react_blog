const { SuccessModel, ErrorModel } = require('../../util/response');
const model = require('../../db/model');
const User = model.user;

const getUserInfo = async (ctx) => {
    let username = ctx.session.userID,
        res = await User.findOne({
            where: {
                username
            },
            attributes: [
                'username', 'desc', 'signature', 'avatar', 'tags', 'createdAt'
            ]
        });
        
    if (res) {
        ctx.body = new SuccessModel(res);
    } else {
        ctx.body = new ErrorModel('该账号不存在');
    }
};

const editSignature = async (ctx) => {
    try {
        let username = ctx.session.userID,
            newSignature = ctx.request.body.signature;

        await User.update({
            signature: newSignature
        },
        {
            where: {
                username
            }
        });
        ctx.body = new SuccessModel('编辑成功');
    } catch (e) {
        ctx.body = new ErrorModel('编辑失败');
    }
};

module.exports = {
    'GET /blog/user_info': getUserInfo,
    'POST /blog/edit_signature': editSignature
}