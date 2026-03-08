export declare class HealthController {
    root(): {
        status: string;
        service: string;
        timestamp: string;
    };
    check(): {
        status: string;
        timestamp: string;
    };
}
