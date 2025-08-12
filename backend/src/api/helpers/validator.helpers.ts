import { Request, Response } from "express";

export async function validationHelper(
  request: Request,
  response: Response,
  schema: any,
) {
  const { error } = schema.validate(request.body);

  //if validation error exists, return response
  if (error) {
    response.status(422).json({
      code: 422,
      status: "error",
      message: "Validation error occurred",
      data: {
        path: error.details[0].path[0],
        error: error.details[0].message,
      },
      metadata: null,
    });
    return false;
  } else {
    //if no validation error
    //use if...else and not a single if to prevent both blocks from running
    return true;
  }
}
