import { requestPost } from './test';

export default async function likePost(postId) {
  await requestPost(`post/${postId}/like`);
}
