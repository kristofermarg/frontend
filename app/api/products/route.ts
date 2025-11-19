import { NextResponse } from "next/server";

import { fetchProducts } from "@/utils/woocommerce";

const PER_PAGE_DEFAULT = 12;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? undefined;
  const categoryIdParam = searchParams.get("categoryId");
  const parsedCategoryId = categoryIdParam
    ? Number.parseInt(categoryIdParam, 10)
    : undefined;
  const categoryId =
    typeof parsedCategoryId === "number" && Number.isFinite(parsedCategoryId)
      ? parsedCategoryId
      : undefined;
  const pageParam = searchParams.get("page");
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page =
    typeof parsedPage === "number" && Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;
  const perPageParam = searchParams.get("perPage");
  const parsedPerPage = perPageParam ? Number.parseInt(perPageParam, 10) : PER_PAGE_DEFAULT;
  const perPage =
    typeof parsedPerPage === "number" &&
    Number.isFinite(parsedPerPage) &&
    parsedPerPage > 0
      ? parsedPerPage
      : PER_PAGE_DEFAULT;

  const productParams: Record<string, string | number | boolean> = {
    page,
    per_page: perPage,
  };

  if (typeof categoryId === "number") {
    productParams.category = categoryId;
  }

  if (typeof query === "string" && query.length > 0) {
    productParams.search = query;
  }

  const products = await fetchProducts(productParams);

  return NextResponse.json({ products });
}
