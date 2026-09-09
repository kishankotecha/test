import { promises as fs } from 'fs';
import path from 'path';
import type {
  Category,
  MenuItem,
  Offer,
  Order,
  RestaurantSettings,
  Testimonial,
} from '@/types';
import {
  defaultCategories,
  defaultMenu,
  defaultOffers,
  defaultOrders,
  defaultSettings,
  defaultTestimonials,
} from '@/lib/seed';

/**
 * Vercel serverless can't write to the project dir.
 * Read bundled/seed data from cwd, write runtime changes to /tmp when available.
 */
const BUNDLE_DIR = path.join(process.cwd(), 'data');
const RUNTIME_DIR = process.env.VERCEL
  ? path.join('/tmp', 'qissa-data')
  : BUNDLE_DIR;

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  const runtimePath = path.join(RUNTIME_DIR, file);
  const bundlePath = path.join(BUNDLE_DIR, file);

  try {
    const raw = await fs.readFile(runtimePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    // fall through
  }

  try {
    const raw = await fs.readFile(bundlePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    // fall through
  }

  try {
    await ensureDir(RUNTIME_DIR);
    await fs.writeFile(runtimePath, JSON.stringify(fallback, null, 2), 'utf-8');
  } catch {
    // Read-only / ephemeral FS — return in-memory defaults
  }

  return fallback;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  try {
    await ensureDir(RUNTIME_DIR);
    await fs.writeFile(path.join(RUNTIME_DIR, file), JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Failed to persist ${file}:`, error);
    throw new Error(
      'Could not save data on this host. Local/dev works; on Vercel use a real database for permanent admin edits.'
    );
  }
}

export const db = {
  getSettings: () => readJson<RestaurantSettings>('settings.json', defaultSettings),
  saveSettings: (data: RestaurantSettings) => writeJson('settings.json', data),

  getCategories: () => readJson<Category[]>('categories.json', defaultCategories),
  saveCategories: (data: Category[]) => writeJson('categories.json', data),

  getMenu: () => readJson<MenuItem[]>('menu.json', defaultMenu),
  saveMenu: (data: MenuItem[]) => writeJson('menu.json', data),

  getOffers: () => readJson<Offer[]>('offers.json', defaultOffers),
  saveOffers: (data: Offer[]) => writeJson('offers.json', data),

  getTestimonials: () => readJson<Testimonial[]>('testimonials.json', defaultTestimonials),
  saveTestimonials: (data: Testimonial[]) => writeJson('testimonials.json', data),

  getOrders: () => readJson<Order[]>('orders.json', defaultOrders),
  saveOrders: (data: Order[]) => writeJson('orders.json', data),
};

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
