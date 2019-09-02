interface User_base_info {
    account: string;
    user_id: number;

}

// table中需要的信息，以后再补充
interface User_info {
    user_id: number;
    headimg: string;
    sex: number;
}


export {
    User_base_info,
    User_info,
}
