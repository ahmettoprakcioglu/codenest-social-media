import { useQuery } from '@tanstack/react-query';
import { Post } from './PostList';
import { supabase } from '../supabase-client';
import { LikeButton } from './LikeButton';
import CommentSection from './CommentSection';

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error }: { data: Post | null; error: Error | null } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Post not found');

  return data;
};

const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto" />
          <div className="h-64 bg-gray-700 rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-700 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {data?.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-2">
              {data?.avatar_url ? (
                <img
                  src={data.avatar_url}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
              )}
              <span className="text-sm">Posted by {data?.user_name ?? 'Anonymous'}</span>
            </div>
            <span className="text-sm">
              {data?.created_at ? new Date(data.created_at).toLocaleDateString() : ''}
            </span>
          </div>
        </div>

        {/* Image */}
        {data?.image_url && (
          <div className="relative aspect-[32/9] rounded-xl overflow-hidden bg-gray-800">
            <img
              src={data.image_url}
              alt={data.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed">
            {data?.content}
          </p>
        </div>

        <LikeButton postId={postId} />
        <CommentSection postId={postId} />
      </div>
    </div>
  );
};

export default PostDetail;
