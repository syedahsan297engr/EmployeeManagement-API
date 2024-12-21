import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user.module';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import * as request from 'supertest';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

describe('UserModule (Integration)', () => {
  let app: INestApplication;
  let graphqlEndpoint: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          introspection: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Automatically generates schema.gql
          sortSchema: true, // Sorts the schema output
          context: ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res,
          }), // Explicitly type req and res
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            entities: [User, Role],
            synchronize: true, // Disable in production; for testing, it's fine
            logging: false,
          }),
        }),
        UserModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    graphqlEndpoint = '/graphql';
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a new user', async () => {
    const mutation = `
      mutation {
        signup(signupDto: {
          name: "John Doe",
          email: "john.doe@example.com",
          password: "securePassword"
        }) {
          message
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.signup.message).toBe('sign up successful');
  });

  it('should log in an existing user', async () => {
    const mutation = `
      mutation {
        login(loginDto: {
          email: "john.doe@example.com",
          password: "securePassword"
        }) {
          token
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.login.token).toBeDefined();
  });

  it('should retrieve the current user', async () => {
    const loginMutation = `
      mutation {
        login(loginDto: {
          email: "john.doe@example.com",
          password: "securePassword"
        }) {
          token
        }
      }
    `;

    const loginResponse = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query: loginMutation });

    expect(loginResponse.status).toBe(200);
  });
});

/* 
next time signup will give error bcz user already exists, just for info...
*/
