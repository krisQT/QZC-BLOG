import * as $ from '../../controllers/tags_controlles';
import verify from '../../middleware/verify';

export default async(router) => {
    router.post("/tags", verify, $.createTag)
        .get("/tags", $.getAllTags)
        .patch('/tags/:id', verify, $.modifyTag)
}