import Router from 'koa-router';
import BoardModel from '@/Model/BoardModel';

const router = new Router();

const PAGE_SIZE = 20;

async function getBoardWithPosts(boardName: string, page: number, pageSize: number) {
  return await BoardModel.query()
    .where({ name: boardName })
    .first()
    .eager('posts')
  // .modifyEager('posts', builder => {
  //   builder.orderBy('id').page(page, pageSize);
  // });
}

router.get(['/:boardName', '/:boardName/page/:page'], async ctx => {
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
