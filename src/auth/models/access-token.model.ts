export interface AccessTokenModel {
username: string;
role: 'ADMIN' | 'MOD';
hasToken?: boolean;
parentId?: string;
}