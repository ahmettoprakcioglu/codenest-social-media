import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import PostItem, { PostItemSkeleton } from './PostItem';

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  user_name?: string;
  like_count?: number;
  dislike_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc('get_posts_with_counts') as { data: Post[] | null; error: Error | null };

  if (error) throw new Error(error.message);

  return data ?? [];
};

const PostList = (): React.ReactElement => {
  const { data, error, isLoading } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {isLoading ? (
        // Show 6 skeleton items while loading
        Array.from({ length: 6 }).map((_, index) => (
          <PostItemSkeleton key={index} />
        ))
      ) : (
        data?.map((post) => (
          <PostItem post={post} key={post.id} />
        ))
      )}
    </div>
  );
};

export default PostList;