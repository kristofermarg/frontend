import "server-only";

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

import type {
  CartShape,
  Category,
  LineItem,
  Order,
  Product,
  WooCommerceError,
} from "@/types/woocommerce";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL ?? "https://backend.webdev.is",
  consumerKey:
    process.env.WOOCOMMERCE_KEY ??
    "cs_acbe3c5c0038e31abf40e1b191c63e467b91dc6b",
  consumerSecret:
    process.env.WOOCOMMERCE_SECRET ??
    "ck_87ca4def17199c4ee23697a35e982bd8058d0b52",
  version: "wc/v3",
});

const sanitizeWooError = (error: unknown): Error => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const wooError = error as WooCommerceError;
    const message =
      wooError?.message ?? "WooCommerce request failed. Please try again.";
    return new Error(message);
  }

  return new Error("Unexpected WooCommerce error.");
};

const request = async <T>(fn: () => Promise<{ data: unknown }>): Promise<T> => {
  try {
    const response = await fn();
    return response.data as T;
  } catch (error) {
    throw sanitizeWooError(error);
  }
};

export const fetchProducts = async (
  params: Record<string, string | number | boolean> = {},
): Promise<Product[]> => {
  return request<Product[]>(() =>
    api.get("products", {
      per_page: 12,
      status: "publish",
      ...params,
    }),
  );
};

export const fetchFeaturedProducts = () =>
  fetchProducts({ featured: true, per_page: 6 });

export const fetchLatestProducts = () =>
  fetchProducts({ orderby: "date", per_page: 9 });

export const fetchProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  const products = await fetchProducts({ slug, per_page: 1 });
  return products.at(0) ?? null;
};

export const fetchProductById = async (id: number): Promise<Product> =>
  request<Product>(() => api.get(`products/${id}`));

export const fetchCategories = async (): Promise<Category[]> =>
  request<Category[]>(() =>
    api.get("products/categories", {
      per_page: 25,
      orderby: "name",
    }),
  );

export const fetchRelatedProducts = async (
  product: Product,
): Promise<Product[]> => {
  if (!product.related_ids?.length) {
    return [];
  }

  const related = product.related_ids.slice(0, 4);
  return fetchProducts({
    include: related.join(","),
    per_page: related.length,
  });
};

export const createWooOrder = async (
  payload: CartShape,
): Promise<Order> => {
  const lineItems: LineItem[] = (payload.line_items ?? []).filter(
    (line) => Boolean(line.product_id) && Boolean(line.quantity),
  );

  if (!lineItems.length) {
    throw new Error("Cart is empty. Add items before checking out.");
  }

  return request<Order>(() =>
    api.post("orders", {
      set_paid: payload.set_paid ?? false,
      payment_method: payload.payment_method,
      payment_method_title: payload.payment_method_title,
      billing: payload.billing,
      shipping: payload.shipping,
      line_items: lineItems,
      shipping_lines: payload.shipping_lines ?? [],
      meta_data: payload.meta_data ?? [],
      customer_id: payload.customer_id,
    }),
  );
};
