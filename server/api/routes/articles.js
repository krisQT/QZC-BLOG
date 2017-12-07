import * as $ from '../../controllers/articles_controlees';
import verify from '../../middleware/verify';

export default async(router) => {
    router.get("/articles", verify, $.getAllArticles)
        .post("/articles", verify, $.createArticle)
        .patch("/articles/:id", verify, $.modifyArticle)
        .get("/articles/:id", $.getArticle)
        .delete("/article/:id", verify, $.deleteArticle)
        .get("/publishArticles", $.getAllPublishArticles)
}