import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from '../hooks/useAuth';

interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote }: { data: Vote | null } = await supabase
    .from('votes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingVote) {
    // Liked -> 0, Like -> -1
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('id', existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('votes')
        .update({ vote: voteValue })
        .eq('id', existingVote.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from('votes')
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('post_id', postId);

  if (error) throw new Error(error.message);
  return data as Vote[];
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[]>({
    queryKey: ['votes', postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error('You must be logged in to Vote!');
      return vote(voteValue, postId, user.id);
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['votes', postId] });
    },
  });

  if (isLoading) {
    return <div> Loading votes...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const likes = votes?.filter((v) => v.vote === 1).length ?? 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length ?? 0;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => { mutate(1); }}
        className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
          userVote === 1 
            ? 'bg-pink-500/20 text-pink-500 ring-1 ring-pink-500' 
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-pink-500'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-200 ${userVote === 1 ? 'scale-110' : 'group-hover:scale-110'}`}
          fill={userVote === 1 ? 'currentColor' : 'none'}
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        <span className="text-sm font-medium">{likes}</span>
      </button>
      <button
        onClick={() => { mutate(-1); }}
        className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
          userVote === -1 
            ? 'bg-blue-500/20 text-blue-500 ring-1 ring-blue-500' 
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-blue-500'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-200 ${userVote === -1 ? 'scale-110' : 'group-hover:scale-110'}`}
          fill={userVote === -1 ? 'currentColor' : 'none'}
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" 
          />
        </svg>
        <span className="text-sm font-medium">{dislikes}</span>
      </button>
    </div>
  );
};