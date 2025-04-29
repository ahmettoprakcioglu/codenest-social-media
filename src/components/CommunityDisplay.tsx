import { useQuery } from '@tanstack/react-query';
import { Post } from './PostList';
import { supabase } from '../supabase-client';
import PostItem from './PostItem';

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number,
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase.rpc('get_community_posts_with_counts', {
    community_id: communityId,
  }) as { data: Post[] | null; error: Error | null };
  
  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
};

const CommunityDisplay = ({ communityId }: Props): React.ReactElement => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[]>({
    queryKey: ['communityPost', communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  
  if (error)
    return (
      <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm text-center">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-6xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.[0]?.communities?.name ?? 'Community'} Posts
      </h2>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg">
            No posts in this community yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Be the first to share something!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityDisplay;
