import postTest from "./test/post";
import writeTest from "./test/writeTest";

async function run() {
  // await postTest();
  await writeTest();
}

run().catch(err => {
  console.error(err);
});