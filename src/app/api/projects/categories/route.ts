import { NextResponse } from 'next/server';
import { getProjectCategories } from '../../../lib/projects';

export async function GET() {
  try {
    const categories = getProjectCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
