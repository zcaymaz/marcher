import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from '../common/dto';
import { generateSlug, getNameForSlug } from '../common/utils/slug.util';
import { toJson } from '../common/utils/json.util';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blogPost.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async create(dto: CreateBlogPostDto) {
    const slug = generateSlug(getNameForSlug(dto.title));
    return this.prisma.blogPost.create({
      data: {
        slug,
        category: dto.category,
        title: toJson(dto.title)!,
        excerpt: toJson(dto.excerpt)!,
        content: toJson(dto.content)!,
        metaDesc: toJson(dto.metaDesc),
        image: dto.image,
        keywords: dto.keywords || [],
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  async update(slug: string, dto: Partial<CreateBlogPostDto>) {
    await this.findBySlug(slug);
    const data: Record<string, unknown> = { ...dto };
    if (dto.title) data.slug = generateSlug(getNameForSlug(dto.title));
    if (dto.date) data.date = new Date(dto.date);
    return this.prisma.blogPost.update({ where: { slug }, data });
  }

  async remove(slug: string) {
    await this.findBySlug(slug);
    await this.prisma.blogPost.delete({ where: { slug } });
    return { message: 'Blog post deleted' };
  }
}
