// 前后端监听消息字段
export const SERVER_EVENT = {
    AUTH_REQ: "BASE:AUTH_REQ",
    TOKEN_REQ: "BASE:GET_TOKEN_REQ",
}

export const CLIENT_EVENT = {
    AUTH_RES: "BASE:AUTH_RES",
    TOKEN_RES: "BASE:GET_TOKEN_RES",
}


//////////////////入参/////////////////////////
export interface AuthReq {
    token: string;
}

//////////////////返回//////////////////////////
// export interface Aut
