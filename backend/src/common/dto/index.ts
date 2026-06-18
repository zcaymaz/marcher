import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocalizedStringDto {
  @IsString()
  @IsNotEmpty()
  tr: string;

  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
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
  @IsBoolean()
  isAdmin?: boolean;
}

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
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

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  oldPrice?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
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

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsString()
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

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsEnum(['HOME_HERO', 'HOME_BANNER', 'MENU_BANNER'])
  placement?: 'HOME_HERO' | 'HOME_BANNER' | 'MENU_BANNER';
}

export class CreateReferenceDto {
  @IsOptional()
  @IsEnum(['BRAND', 'PRODUCT'])
  type?: 'BRAND' | 'PRODUCT';

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description?: LocalizedStringDto;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @IsOptional()
  @IsString()
  authorPhoto?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  rating?: number;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  text: LocalizedStringDto;

  @IsOptional()
  @IsEnum(['MANUAL', 'GOOGLE'])
  source?: 'MANUAL' | 'GOOGLE';

  @IsOptional()
  @IsString()
  googleReviewId?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsNumber()
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
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  address?: LocalizedStringDto;

  @IsOptional()
  @IsString()
  addressUrl?: string;

  @IsOptional()
  @IsString()
  googleMapsEmbedUrl?: string;

  @IsOptional()
  @IsString()
  googlePlaceId?: string;

  @IsOptional()
  socialLinks?: Record<string, string>;
}

export class UpdateFranchiseStatusDto {
  @IsString()
  @IsEnum(['NEW', 'CONTACTED', 'CLOSED'])
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
}
