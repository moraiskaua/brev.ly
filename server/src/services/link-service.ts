import { eq, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import { links } from '../database/schema';
import {
  CreateLinkInput,
  DeleteLinkInput,
  IncrementAccessInput,
} from '../schemas/link-schemas';

export class LinkService {
  async createLink(data: CreateLinkInput) {
    const existingLink = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, data.shortUrl))
      .limit(1);
    if (existingLink.length > 0) {
      throw new Error('Esse link encurtado já existe. Escolha outro.');
    }
    const [newLink] = await db
      .insert(links)
      .values({
        originalUrl: data.originalUrl,
        shortUrl: data.shortUrl,
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
