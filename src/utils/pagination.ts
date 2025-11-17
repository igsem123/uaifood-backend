export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

export interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}

export async function paginate<T>(
    model: any,
    params: PaginationParams = {},
    where: any = {},
    options: any = {}
): Promise<PaginatedResult<T>> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;

    const skip = (page - 1) * pageSize;

    const [total, data] = await Promise.all([
        model.count({ where }),
        model.findMany({
            where,
            skip,
            take: pageSize,
            ...options, // para incluir relations, include, orderBy...
        })
    ]);

    const totalPages = Math.ceil(total / pageSize);

    const meta: PaginationMeta = {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };

    return { data, meta };
}
