-- Supabase Database Schema

create table public.communities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  location_name text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  sustainable_importance text,
  traditional_knowledge text,
  community_id uuid references public.communities on delete cascade,
  biome text,
  latitude double precision,
  longitude double precision,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.comments (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products on delete cascade,
  user_name text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.likes (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products on delete cascade,
  user_session_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, user_session_id)
);

-- Enable Realtime for comments and likes
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table likes;
