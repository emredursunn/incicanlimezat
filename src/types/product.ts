export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  main_image_path: string;
  additional_image_paths: string[] | null;
  category: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  featured: boolean;
  active: boolean;
  main_image_path: string;
  additional_image_paths: string[];
};
