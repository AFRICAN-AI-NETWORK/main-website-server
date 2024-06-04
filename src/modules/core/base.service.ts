export class BaseService {
  protected getPagination(
    count: number,
    total: number,
    page: number,
    limit: number,
  ) {
    const totalPages = Math.ceil(total / limit);

    return {
      count,
      total,
      totalPages,
      page,
      limit,
    };
  }
}
