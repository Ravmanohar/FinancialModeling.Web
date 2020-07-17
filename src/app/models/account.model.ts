export class RegisterModel {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    userRole: UserRole;
    clientId: number;
    isSucess: boolean;
    message: string;
}

export class LoginModel {
    email: string;
    password: string;
    grant_type: string = 'token';
}

export class UserRole {
    roleId: number;
    roleName: string;
}

export class LoggedInUser {
    userId: string;
    email: string;
    role: string;
    username: string;
    clientId: number;
    isActive: boolean;

    access_token: string;
    token_type: string;
    userName: string;
}

export class ResetUserPasswordModel {
    userId: string;
    newPassword: string;
    confirmPassword: string;
    message: string;
}
