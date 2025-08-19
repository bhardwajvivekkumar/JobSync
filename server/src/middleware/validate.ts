import { ZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

export function validate(schema: ZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  };
}
