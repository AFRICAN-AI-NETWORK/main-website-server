export class CreateAiToolDto {
  name: string;
  shortDescription: string;
  fullDescription: string;
  siteUrl: string;
  featured: boolean;
  pricingModel: string;
  stars: number;
  verified: boolean;
  slug: string;
  imageUrl: string;
  imageAlt?: string;
  ytVideoUrl?: string;
}

export class CreateAiToolCategoryDto {
  title: string;
  description: string;
}

export class UpdateAiToolDto {
  name?: string;
  shortDescription?: string;
  fullDescription: string;
  siteUrl?: string;
  featured?: boolean;
  pricingModel?: string;
  stars?: number;
  verified?: boolean;
  slug?: string;
  imageUrl?: string;
  imageAlt?: string;
  ytVideoUrl?: string;
}

export class UpdateAiToolCategoryDto {
  title: string;
  description: string;
}
