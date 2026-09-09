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

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf-8');
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
