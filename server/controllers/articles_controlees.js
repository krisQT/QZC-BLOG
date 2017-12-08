import Article from "../models/article";
import {
    exec
} from "child_process";

/**
 * 创建文章
 * **/
export async function createArticle(ctx) {
    const title = ctx.request.body.title;
    const content = ctx.request.body.content;
    const abstract = ctx.request.body.abstract;
    const publish = ctx.request.body.publish;
    const tags = ctx.request.body.tags;
    const createTime = new Date();
    const lastEditTime = new Date();

    if (title == "") {
        ctx.throw(400, "标题不能为空");
    }
    if (content == "") {
        ctx.throw(400, "内容不能为空");
    }
    if (abstract == "") {
        ctx.throw(400, "摘要不能为空");
    }
    const article = new Article({
        title,
        content,
        abstract,
        publish,
        tags,
        createTime,
        lastEditTime
    });

    let createResult = await article.save().catch(err => {
        ctx(500, '服务器内部错误')
    });

    await Article.populate(createResult, {
        path: 'tags'
    }, function (err, result) {
        createResult = result;
        console.log(result);
    });
    cctx.body = {
        success: true,
        article: createResult
    }
}

/**
 * 获取所有文章
 * **/
export async function getAllArticles(ctx) {
    const tag = ctx.query.tag;
    const page = ctx.query.page;
    const limit = ctx.query.limit || 4;

    let skip = 0;
    let articleArr;
    let allpage;
    let allNum;

    if (page != 0) {
        skip = limit * (page - 1);
    }

    if (tag = "") {
        articleArr = await Article.find()
            .populate("tags")
            .sort({
                createTime: -1
            })
            .limit(limit)
            .skip(skip).catch(err => {
                this.throw(500, "数据库错误")
            })
        allNum = await Article.count.catch(err => {
            this.throw(500, "数据库错误")
        })
    } else {
        let tagArr = tag.split(',');
        articleArr = await Article.find({
                tag: {
                    "$in": tagArr
                }
            })
            .populate("tags")
            .sort({
                createTime: -1
            })
            .limit(limit)
            .skip(skip).catch(err => {
                this.throw(500, "数据库错误")
            })
        allNum = await Article.find({
            tag: {
                "$in": tagArr
            }
        }).count().catch(err => {
            this.throw(500, "数据库错误")
        })
    }

    allPage = Math.ceil(allNum / limit);

    ctx.body = {
        success: true,
        artcielArr,
        allPage
    }
}

/**
 * 获取所有发布文章
 * **/
export async function getAllPublishArticles(ctx) {
    const tag = ctx.query.tag;
    const page = ctx.query.page;
    const limit = ctx.query.limit || 4;


    let skip = 0;
    let articleArr;
    let allpage;
    let allNum;

    if (page !== 0) {
        skip = limit * (page - 1)
    }

    if (tag = "") {
        articleArr = await Article.find({
                publish: true
            })
            .populate("tags")
            .sort({
                createTime: -1
            })
            .limit(limit)
            .skip(skip).catch(err => {
                this.throw(500, "数据库错误")
            })
        allNum = await Article.count.catch(err => {
            this.throw(500, "数据库错误")
        })
    } else {
        let tagArr = tag.split(',');
        articleArr = await Article.find({
                tag: {
                    "$in": tagArr
                },
                publish: true
            })
            .populate("tags")
            .sort({
                createTime: -1
            })
            .limit(limit)
            .skip(skip).catch(err => {
                this.throw(500, "数据库错误")
            })
        allNum = await Article.find({
            tag: {
                "$in": tagArr
            }
        }).count().catch(err => {
            this.throw(500, "数据库错误")
        })
    }

    allPage = Math.ceil(allNum / limit)

    ctx.body = {
        success: true,
        articleArr,
        allPage: allPage
    }
}

/**
 * 修改文章
 * **/
export async function modifyArticle(ctx) {
    const id = ctx.params.id;
    const title = ctx.request.body.title;
    const content = ctx.request.body.content;
    const abstract = ctx.request.body.abstract;
    const tags = ctx.request.body.tags;

    if (title == "") {
        ctx.throw(400, "标题不能为空")
    }
    if (content == "") {
        ctx.throw(400, "内容不能为空")
    }
    if (abstract == "") {
        ctx.throw(400, "摘要不能为空")
    }

    const article = await Article.findByIdAndUpdate(id, {
        $set: ctx.request.body
    }).catch(err => {
        if (err.name == "CastRrror") {
            this.throw(400, "id不存在")
        } else {
            ctx.throw(500, "数据库错误")
        }
    });

    ctx.body = {
        success: true
    }
}

/**
 * 获取某一篇文章
 * **/
export async function getArticle(ctx) {
    const id = ctx.params.id;

    if (id == "") {
        ctx.throw(400, "id不能为空")
    }
    const article = await Article.findById(id).catch(err => {
        if (err.name == "CastRrror") {
            this.throw(400, "id不存在")
        } else {
            ctx.throw(500, "数据库错误")
        }
    })
    ctx.body = {
        success: true,
        article: article
    }
}

/**
 * 删除文章
 * **/
export async function deleteArticle(ctx) {
    const id = ctx.params.id;

    if (id == "") {
        ctx.throw(400, "id不能为空")
    }
    const article = await Article.findByIdAndRemove(id).catch(err => {
        if (err.name == "CastRrror") {
            this.throw(400, "id不存在")
        } else {
            ctx.throw(500, "数据库错误")
        }
    })
    ctx.body = {
        success: true
    }
}

/**
 * 发布文章
 * **/
export async function publishArticle(ctx) {
    const id = ctx.params.id;
    if (id == "") {
        ctx.throw(400, "id不能为空")
    }
    const article = await Article.findByIdAndUpdate(id, {
        $set: {
            publish: true
        }
    }).catch(err => {
        if (err.name == "CastRrror") {
            this.throw(400, "id不存在")
        } else {
            ctx.throw(500, "数据库错误")
        }
    })
    ctx.body = {
        success: true
    }
}

/**
 * 取消发布
 * **/
export async function canclePublishArticle(ctx) {
    const id = ctx.params.id;
    if (id == "") {
        ctx.throw(400, "id不能为空")
    }
    const article = await Article.findByIdAndUpdate(id, {
        $set: {
            publish: false
        }
    }).catch(err => {
        if (err.name == "CastRrror") {
            this.throw(400, "id不存在")
        } else {
            ctx.throw(500, "数据库错误")
        }
    })
    ctx.body = {
        success: true
    }
}