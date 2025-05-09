import { Link } from 'react-router';
import { Post } from './PostList';

interface Props {
  post: Post;
}

export const PostItemSkeleton = () => (
  <div className="w-80 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] flex flex-col overflow-hidden">
    {/* Header Skeleton */}
    <div className="flex items-center space-x-3 p-4">
      <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
      <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
    </div>

    {/* Image Skeleton */}
    <div className="px-4 pb-4">
      <div className="w-full aspect-video bg-gray-700 rounded-xl animate-pulse" />
    </div>

    {/* Stats Skeleton */}
    <div className="flex items-center px-4 pb-4 space-x-6">
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-6 bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-6 bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const PostItem = ({ post }: Props): React.ReactElement => (
  <div className="relative group">
    <Link to={`/post/${post.id.toString()}`} className="block">
      <div className="w-80 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col overflow-hidden transition-all duration-200 hover:border-[rgb(120,130,150)]">
        {/* Header: Avatar and Title */}
        <div className="flex items-center space-x-3 p-4">
          {post.avatar_url ? (
            <img
              src={post.avatar_url}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
          )}
          <div className="flex flex-col">
            <div className="text-lg font-medium">
              {post.title}
            </div>
          </div>
        </div>

        {/* Image Banner */}
        <div className="px-4 pb-4">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full rounded-xl object-cover aspect-video"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center px-4 pb-4 space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400"
                fill="none"
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
              <span className="text-sm text-gray-400">{post.like_count ?? 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400"
                fill="none"
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
              <span className="text-sm text-gray-400">{post.dislike_count ?? 0}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <span className="text-sm text-gray-400">{post.comment_count ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

export default PostItem;
