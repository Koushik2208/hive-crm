import { services, service_categories } from "@prisma/client";

export interface ServiceCategory extends service_categories {
  _count?: {
    services: number;
  };
}

export interface Service extends services {
  service_categories?: ServiceCategory | null;
}

export interface ServicesApiResponse {
  data: Service[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ServiceCategoriesApiResponse {
  data: ServiceCategory[];
}
