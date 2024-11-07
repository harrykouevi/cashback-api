import { ValidationPipe , ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory , Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS if needed.
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Strip properties that do not have decorators in the DTO
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    // exceptionFactory: (errors) => {
    //         const formattedErrors = errors.map(error => ({
    //             property: error.property,
    //             constraints: error.constraints,
    //         }));
    //         return {
    //             statusCode: 400,
    //             message: formattedErrors,
    //             error: 'Bad Request',
    //         };
    //       },
    exceptionFactory: (errors) => {
      const formattedErrors = errors.map((error) => { 
        const o = {};
        Object.entries(error.constraints).forEach(([key, value]) => { 
          o[getDamnnnnn(key)] = value ;
        });
        return {
          property: error.property,
          constraints: o,
        }; 
      });
      return {
          statusCode: 400,
          error: 'Bad Request',
          message: formattedErrors,
      };
    },
  }));



  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Enable serialization interceptor
  await app.listen(process.env.PORT ?? 3000);
}

function getDamnnnnn(params:string):string {
  switch (params) {
    case 'isNotEmpty':
        return 'required';
    case 'banana':
        return 'yellow';
    case 'orange':
        return 'orange';
    default:
        return params;
  }
}

bootstrap();
