export interface GraphQLRequestContext {
  urlData?: {
    baseUrl: string;
    queryParams: Record<string, any>;
    currUserId: number;
  };
}
