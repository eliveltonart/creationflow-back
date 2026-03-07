import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            email: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        company: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            customFields: import("@prisma/client/runtime/library").JsonValue | null;
            color: string | null;
            userId: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
        };
    }>;
    verify(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
}
