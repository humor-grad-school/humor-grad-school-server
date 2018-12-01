import express from 'express';
import BoardModel from '@/Model/BoardModel';

const router = express.Router();

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

router.get('/:boardName', (req, res) => {
  res.redirect(`${req.originalUrl}/page/0`)
});

router.get('/:boardName/page/:page', async (req, res) => {
  const { boardName, page = 0 } = req.params;
  const board = await getBoardWithPosts(boardName, page, PAGE_SIZE);
  if (!board) {
    res.sendStatus(404);
    return;
  }
  res.send(board);
});

router.post('/:boardName', async (req, res) => {
  const { boardName } = req.params;

  const isAdmin = true; // TODO
  if (!isAdmin) {
    return res.sendStatus(403);
  }

  const board = await BoardModel.query().insert({
    name: boardName,
  });

  return res.send(board);
});

export default router;
