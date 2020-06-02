import { createServer } from "net";

/**
 * 获取随机端口值
 * @param min 端口下限
 * @param max 端口上限
 */
export default async function getRandomPort(
  min: number,
  max: number
): Promise<number> {
  const randomPort = (Math.random() * (max - min + 1) + min).toFixed(0);
  const server = createServer().listen(randomPort);

  const port = await new Promise<number>((resolve, reject) => {
    server.on("listening", () => {
      server.close();
      resolve(Number(randomPort));
    });

    server.on("error", () => {
      reject(0);
    });
  });
  return port > min ? port : await getRandomPort(min, max);
}
