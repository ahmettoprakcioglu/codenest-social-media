import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from '../hooks/useAuth';
import CommentItem from './CommentItem';

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author) {
    throw new Error('You must be logged in to comment.');
  }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id ?? null,
    user_id: userId,
    author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};

const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>('');
  const { user, signInWithGitHub } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata.user_name,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText('');
  };

  /* Map of Comments - Organize Replies - Return Tree  */
  const buildCommentTree = (
    flatComments: Comment[],
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children: Comment[] }>();
    const roots: (Comment & { children: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          const child = map.get(comment.id);
          if (child) {
            parent.children.push(child);
          }
        }
      } else {
        const root = map.get(comment.id);
        if (root) {
          roots.push(root);
        }
      }
    });

    return roots;
  };

  if (isLoading) {
    return <div> Loading comments...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center space-x-3">
        <h3 className="text-xl font-semibold text-gray-100">Comments</h3>
        <div className="flex items-center space-x-1.5 bg-gray-900/50 border border-gray-700 rounded-full px-3 py-1">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm font-medium text-gray-300">{comments?.length ?? 0}</span>
        </div>
      </div>
      
      {/* Create Comment Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={newCommentText}
              onChange={(e) => { setNewCommentText(e.target.value); }}
              className="w-full min-h-[100px] bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
              placeholder="Share your thoughts..."
              rows={3}
            />
            <div className="absolute bottom-4 right-4">
              <button
                type="submit"
                disabled={isPending}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {isError && (
            <p className="text-red-400 text-sm">Error posting comment. Please try again.</p>
          )}
        </form>
      ) : (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
          <p className="text-gray-400">
            Please{' '}
            <button
              onClick={() => { signInWithGitHub(); }}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              sign in
            </button>{' '}
            to post a comment
          </p>
        </div>
      )}

      {/* Comments Display Section */}
      <div className="space-y-6">
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;