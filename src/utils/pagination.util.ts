import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as qs from 'qs';

@Injectable()
export class UrlGeneratorService {
  generateNextPageUrl(
    nextPage: number | null,
    pageSize: number,
    baseUrl: string,
    queryParams: any,
  ): string | null {
    if (nextPage === null || nextPage === undefined) return null;

    // Append pagination parameters to the existing query string
    const updatedQueryParams = {
      ...queryParams,
      page: nextPage,
      limit: pageSize,
    };

    const queryString = qs.stringify(updatedQueryParams);
    return `${baseUrl}?${queryString}`;
  }
}
