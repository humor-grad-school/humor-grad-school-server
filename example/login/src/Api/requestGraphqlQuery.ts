import { request } from '@/test/test';

export default async function requestGraphqlQuery(query: string) {
  const { data } = await request('graphql', 'POST', {
    query,
  });
  return data;
}
