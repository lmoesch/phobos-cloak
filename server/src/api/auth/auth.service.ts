import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface User {
    name: string;
    password: string;
    role: string;
}

const USERS: User[] = [
    { name: "sci", password: "sci", role: "sci" },
    { name: "tec", password: "tec", role: "tec" }
]

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        return USERS.find((user) => user.name == username && user.password == pass);
    }

    async login(user: any) {
        const payload = { name: user.username, sub: user.userId, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async refresh(token: string) {
        const decoded = this.jwtService.decode(token);
        const payload = { name: decoded.name, sub: decoded.sub, role: decoded.role };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}