import { SetMetadata } from '@nestjs/common';

export const SWAGGER_API_TAGS = 'swagger:api_tags';
export const SWAGGER_API_OPERATION = 'swagger:api_operation';
export const SWAGGER_API_BEARER_AUTH = 'swagger:api_bearer_auth';
export const SWAGGER_API_BODY = 'swagger:api_body';
export const SWAGGER_API_PARAM = 'swagger:api_param';
export const SWAGGER_API_RESPONSES = 'swagger:api_responses';

type Constructor = new (...args: never[]) => unknown;

type ApiOperationOptions = {
  summary: string;
  description?: string;
};

type ApiBodyOptions = {
  schema?: Record<string, unknown>;
  type?: Constructor;
  description?: string;
  required?: boolean;
};

type ApiParamOptions = {
  name: string;
  description?: string;
  schema?: Record<string, unknown>;
  example?: unknown;
};

type ApiResponseOptions = {
  status: number;
  description: string;
  schema?: Record<string, unknown>;
  type?: Constructor;
  isArray?: boolean;
};

export function ApiTags(...tags: string[]): ClassDecorator {
  return SetMetadata(SWAGGER_API_TAGS, tags);
}

export function ApiOperation(options: ApiOperationOptions): MethodDecorator {
  return SetMetadata(SWAGGER_API_OPERATION, options);
}

export function ApiBearerAuth(): MethodDecorator {
  return SetMetadata(SWAGGER_API_BEARER_AUTH, true);
}

export function ApiBody(options: ApiBodyOptions): MethodDecorator {
  return SetMetadata(SWAGGER_API_BODY, options);
}

export function ApiParam(options: ApiParamOptions): MethodDecorator {
  return SetMetadata(SWAGGER_API_PARAM, options);
}

export function ApiResponse(options: ApiResponseOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const responses = Reflect.getMetadata(
      SWAGGER_API_RESPONSES,
      descriptor.value as object,
    ) as ApiResponseOptions[] | undefined;

    SetMetadata(SWAGGER_API_RESPONSES, [...(responses ?? []), options])(
      target,
      propertyKey,
      descriptor,
    );
  };
}
