export enum LoginType {
    Basic = 'basic',
    Mobile = 'mobile',
    WeChat = 'wechat',
    Email = 'email',
}

export type Identity = UserId & BasicIdentity;

export type UserId = {
    userId: string;
};

export type BasicIdentity = {
    userName: string;
    loginType: LoginType;
};
