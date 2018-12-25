import Router from 'koa-router';
import BoardModel from '@/Model/BoardModel';
import { passAuthorizationMiddleware } from './AuthorizationPassService';
import PostModel from '@/Model/PostModel';

const router = new Router();

const PAGE_SIZE = 20;
const MINIMUM_BEST_LIKES = 10;

async function getBoardWithPosts(boardName: string, page: number, pageSize: number) {
  const isBestBoard = boardName === 'best';

  if (isBestBoard) {
    const { results: bestPosts } = await PostModel.query()
      .where('likes', '>=', MINIMUM_BEST_LIKES)
      .orderBy('id')
      .page(page, pageSize);

    return {
      posts: bestPosts,
    };
  }

  return await BoardModel.query()
    .where({ name: boardName })
    .first()
    .eager('posts')
    .modifyEager('posts', builder => {
      builder.where('likes', '<', MINIMUM_BEST_LIKES)
        .orderBy('id')
        .page(page, pageSize);
    });
}

router.get(['/:boardName', '/:boardName/page/:page'], passAuthorizationMiddleware, async ctx => {
  const { boardName, page = 0 } = ctx.params;
  const board = await getBoardWithPosts(boardName, page, PAGE_SIZE);
  if (!board) {
    ctx.status = 404;
    return;
  }
  ctx.body = board;
});

router.post('/:boardName', async ctx => {
  const { boardName } = ctx.params;

  const isAdmin = true; // TODO
  if (!isAdmin) {
    return ctx.status = 403;
  }

  const board = await BoardModel.query().insert({
    name: boardName,
  });

  return ctx.body = board;
});

export default router;
