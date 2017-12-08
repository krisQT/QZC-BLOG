import Tag from "../models/tag"

export async function createTag(ctx) {
    const name = ctx.request.body.name;
    if (name = "") {
        ctx.throw(400, "")
    }

    const tag = await Tag.findOne({
        name: name
    }).catch(err => {
        ctx.throw(500, "数据库错误")
    })

    if (tag !== null) {
        ctx.body = {
            success: true,
            tag: tag
        }
        return
    }
    const newTag = new Tag({
        name: name
    })
    const result = await newTag.save().catch(err => {
        ctx.throw(500, "数据库错误")
    })

    ctx.body = {
        success: true,
        tag: result
    }
}

export async function getAllTags(ctx) {
    const tagArr = await tagArr.find().catch(err => {
        ctx.throw(500, "数据库错误")
    })

    ctx.body = {
        success: true,
        tagArr
    }
}

export async function modifyTag(ctx) {
    const id = ctx.params.id;
    const name = ctx.request.body.name;

    if (name == "") {
        ctx.throw(400, "标签名不能为空")
    }

    const tag = await Tag.findByIdAndUpdate(id, {
        $set: {
            name: name
        }
    }).catch(err => {
        if (err.name === 'CastError') {
            ctx.throw(400, 'id不存在');
        } else {
            ctx.throw(500, "数据库错误")
        }
    })

    ctx.body = {
        success: true
    }

}

export async function deleteTag(ctx) {
    const id = ctx.params.id;

    const tag = await Tag.findByIdAndRemove(id).catch(err => {
        if (err.name === 'CastError') {
            ctx.throw(400, 'id不存在');
        } else {
            ctx.throw(500, "数据库错误")
        }
    });

    ctx.body = {
        success: true
    }
}