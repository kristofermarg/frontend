export type ISODateString = string;

export interface Dimensions {
  length: string;
  width: string;
  height: string;
}

export interface Image {
  id: number;
  date_created: ISODateString;
  date_created_gmt: ISODateString;
  date_modified: ISODateString;
  date_modified_gmt: ISODateString;
  src: string;
  name: string;
  alt: string;
  position: number;
}

export interface Attribute {
  id: number;
  name: string;
  option: string;
}

export interface MetaData {
  id: number;
  key: string;
  value: string;
}

export interface MetaDatum {
  id: number;
  key: string;
  value: string;
}

export interface Collection {
  href: string;
}

export interface Self {
  href: string;
}

export interface Up {
  href: string;
}

export interface Links {
  self: Self[];
  collection: Collection[];
  up?: Up[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: Image | null;
  menu_order: number;
  count: number;
  _links: Links;
}

export interface Variation {
  id: number;
  date_created: ISODateString;
  date_created_gmt: ISODateString;
  date_modified: ISODateString;
  date_modified_gmt: ISODateString;
  description: string;
  permalink: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from?: ISODateString | null;
  date_on_sale_from_gmt?: ISODateString | null;
  date_on_sale_to?: ISODateString | null;
  date_on_sale_to_gmt?: ISODateString | null;
  on_sale: boolean;
  visible: boolean;
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: unknown[];
  download_limit: number;
  download_expiry: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity?: number | null;
  in_stock: boolean;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  weight: string;
  dimensions: Dimensions;
  shipping_class: string;
  shipping_class_id: number;
  image: Image | null;
  attributes: Attribute[];
  menu_order: number;
  meta_data: MetaData[];
  _links: Links;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: ISODateString;
  date_created_gmt: ISODateString;
  date_modified: ISODateString;
  date_modified_gmt: ISODateString;
  type: "simple" | "variable" | "grouped" | "external";
  status: "any" | "draft" | "pending" | "private" | "publish";
  featured: boolean;
  catalog_visibility: "visible" | "catalog" | "search" | "hidden";
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: ISODateString | null;
  date_on_sale_from_gmt: ISODateString | null;
  date_on_sale_to: ISODateString | null;
  date_on_sale_to_gmt: ISODateString | null;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: unknown[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: "taxable" | "shipping" | "none";
  tax_class: "standard" | "reduced-rate" | "zero-rate";
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: "instock" | "outofstock" | "onbackorder";
  backorders: "no" | "notify" | "yes";
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: Dimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Partial<Category>[];
  tags: unknown[];
  images: Image[];
  attributes: Attribute[];
  default_attributes: Attribute[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: MetaDatum[];
  _links: Links;
}

export interface MetaDataLineItem {
  key: string;
  value: string;
}

export interface Billing {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface Shipping {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
}

export interface LineItem {
  id?: number;
  name?: string;
  product_id: number;
  variation_id?: number;
  quantity: number;
  tax_class?: string;
  subtotal?: string;
  subtotal_tax?: string;
  total?: string;
  total_tax?: string;
  taxes?: unknown[];
  meta_data?: MetaData[];
  sku?: string;
  price?: number;
}

export interface ShippingLine {
  id?: number;
  method_title: string;
  method_id: string;
  instance_id?: string;
  total: string;
  total_tax: string;
  taxes?: unknown[];
  meta_data?: MetaData[];
}

export interface CartShape {
  payment_method: string;
  payment_method_title: string;
  billing: Billing;
  shipping: Shipping;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
  customer_id?: number;
  meta_data?: MetaDataLineItem[];
  set_paid?: boolean;
}

export interface Order {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: string;
  currency: string;
  date_created: ISODateString;
  date_created_gmt: ISODateString;
  date_modified: ISODateString;
  date_modified_gmt: ISODateString;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: Billing;
  shipping: Shipping;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid?: ISODateString | null;
  date_paid_gmt?: ISODateString | null;
  date_completed?: ISODateString | null;
  date_completed_gmt?: ISODateString | null;
  cart_hash: string;
  meta_data: MetaData[];
  line_items: LineItem[];
  tax_lines: unknown[];
  shipping_lines: ShippingLine[];
  fee_lines: unknown[];
  coupon_lines: unknown[];
  refunds: unknown[];
  _links: Links;
}

export interface Customer {
  id: number;
  date_created: ISODateString;
  date_created_gmt: ISODateString;
  date_modified: ISODateString;
  date_modified_gmt: ISODateString;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: Billing;
  shipping: Shipping;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: MetaData[];
  _links: Links;
}

export type WooCommerceError = {
  status: number;
  data: {
    status: number;
  };
  message: string;
};
