interface Server_info {
    server_type: string,    // 服务类型
    server_id: string,      // 服务ID
    tick_time: number;      // 心跳时间
    http_ip: string,
    http_port: number,
    ws_ip: string,
    ws_port: number,
    load: number,           // 负载
    memory: string,         // JSON 字符串
    server_info?: string,   // 本服务的一些信息，JSON 字符串
}

interface Server_return {
    http_ip: string,
    http_port: number,
    ws_ip: string,
    ws_port: number,
}




export { Server_info, Server_return }
