import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db, generateId } from '@/lib/store';
import type { Testimonial } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const testimonials = await db.getTestimonials();
  if (!getAdminSession()) {
    return NextResponse.json(
      testimonials
        .filter((t) => t.approved)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  }
  return NextResponse.json(
    testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const isAdmin = getAdminSession();

  const testimonial: Testimonial = {
    id: body.id || generateId('fb'),
    customerName: String(body.customerName || '').trim() || 'Guest',
    message: String(body.message || '').trim(),
    rating: Math.min(5, Math.max(1, Number(body.rating || 5))),
    approved: isAdmin ? body.approved !== false : false,
    createdAt: new Date().toISOString(),
    orderId: body.orderId,
  };

  if (!testimonial.message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const testimonials = await db.getTestimonials();
  testimonials.unshift(testimonial);
  await db.saveTestimonials(testimonials);
  return NextResponse.json(testimonial, { status: 201 });
}

export async function PUT(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const testimonials = await db.getTestimonials();
  const index = testimonials.findIndex((t) => t.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  testimonials[index] = { ...testimonials[index], ...body };
  await db.saveTestimonials(testimonials);
  return NextResponse.json(testimonials[index]);
}

export async function DELETE(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const testimonials = await db.getTestimonials();
  await db.saveTestimonials(testimonials.filter((t) => t.id !== id));
  return NextResponse.json({ ok: true });
}
