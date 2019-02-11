import { HgsRestApi } from '@/Api/generated/client/ClientApis';

export default async function likePost(postId) {
  await HgsRestApi.likePost({
    postId,
  });
}
