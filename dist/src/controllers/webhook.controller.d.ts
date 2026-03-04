import type { NextFunction, Request, Response } from "express";
export declare function validateWebhook(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=webhook.controller.d.ts.map