import { createServer } from "net";


async function get_random_port_async(min: number, max: number): Promise<number> {
    const random_port = (Math.random() * (max - min + 1) + min).toFixed(0);
    const server = createServer().listen(random_port)

    const port = await new Promise<number>((resolve, reject) => {
        server.on('listening', () => {
            server.close();
            resolve(Number(random_port));
        })

        server.on('error', () => {
            reject(0);
        })
    })
    return port > min ? port : await get_random_port_async(min, max);
}


export { get_random_port_async }



