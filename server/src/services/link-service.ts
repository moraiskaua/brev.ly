import { eq, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import { links } from '../database/schema';
import {
  CreateLinkInput,
  DeleteLinkInput,
  IncrementAccessInput,
} from '../schemas/link-schemas';
import { generateShortUrl } from '../utils/generate-short-url';

export class LinkService {
  private shortUrlGenerator: () => Promise<string>;

  constructor(shortUrlGenerator: () => Promise<string> = generateShortUrl) {
    this.shortUrlGenerator = shortUrlGenerator;
  }

  async createLink(data: CreateLinkInput) {
    let shortUrl: string;
    let existingLink;

    do {
      shortUrl = await this.shortUrlGenerator();
      existingLink = await db
        .select()
        .from(links)
        .where(eq(links.shortUrl, shortUrl))
        .limit(1);
    } while (existingLink.length > 0);

    const [newLink] = await db
      .insert(links)
      .values({
        originalUrl: data.originalUrl,
        shortUrl,
      })
      .returning();

    return newLink;
  }

  async getAllLinks() {
    return await db.select().from(links).orderBy(links.createdAt);
  }

  async getLinkByShortUrl(shortUrl: string) {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, shortUrl))
      .limit(1);
    return link;
  }

  async deleteLink(data: DeleteLinkInput) {
    const [deletedLink] = await db
      .delete(links)
      .where(eq(links.id, data.id))
      .returning();

    return deletedLink;
  }

  async incrementAccess(data: IncrementAccessInput) {
    const [updatedLink] = await db
      .update(links)
      .set({
        accessCount: sql`${links.accessCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(links.id, data.id))
      .returning();

    return updatedLink;
  }
}
