import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocalizedStringDto {
  @IsString()
  tr: string;

  @IsString()
  en: string;

  @IsString()
  fr: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  isAdmin?: boolean;
}

export class CreateMenuItemDto {
  @IsString()
  category: string;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  details?: LocalizedStringDto;

  price: number;
  oldPrice?: number;
  image?: string;
  images?: string[];
  tags?: string[];
  allergens?: string[];
  isFeatured?: boolean;
  isAvailable?: boolean;
  sortOrder?: number;
}

export class CreateBlogPostDto {
  @IsString()
  category: string;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  title: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  excerpt: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  content: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  metaDesc?: LocalizedStringDto;

  image?: string;
  keywords?: string[];
  date?: string;
}

export class CreateCampaignDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  title: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  subtitle?: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  ctaText?: LocalizedStringDto;

  ctaLink?: string;
  image?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  placement?: 'HOME_HERO' | 'HOME_BANNER' | 'MENU_BANNER';
}

export class CreateReferenceDto {
  type?: 'BRAND' | 'PRODUCT';

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description?: LocalizedStringDto;

  image?: string;
  logo?: string;
  sortOrder?: number;
}

export class CreateReviewDto {
  @IsString()
  authorName: string;

  authorPhoto?: string;
  rating?: number;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  text: LocalizedStringDto;

  source?: 'MANUAL' | 'GOOGLE';
  googleReviewId?: string;
  isVisible?: boolean;
  sortOrder?: number;
}

export class CreateFranchiseInquiryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  website?: string;
}

export class UpdateSiteSettingsDto {
  whatsappNumber?: string;
  phone?: string;
  email?: string;
  address?: LocalizedStringDto;
  googleMapsEmbedUrl?: string;
  googlePlaceId?: string;
  socialLinks?: Record<string, string>;
}

export class UpdateFranchiseStatusDto {
  @IsString()
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
}
