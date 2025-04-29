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

const PostItem = ({ post }: Props) => (
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
      </div>
    </Link>
  </div>
);

export default PostItem;
