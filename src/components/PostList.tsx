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
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  const { data, error } = response;

  if (error) throw new Error(error.message);

  return data as Post[];
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