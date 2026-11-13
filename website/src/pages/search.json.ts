import { getCollection } from 'astro:content';
export async function GET(){ const posts=await getCollection('blog'); return Response.json(posts.map(p=>({title:p.data.title,description:p.data.description,category:p.data.category,url:`/blog/${p.id}/` }))); }
