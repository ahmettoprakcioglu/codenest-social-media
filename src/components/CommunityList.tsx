import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Community, fetchCommunities } from '../api/community';

const CommunityList = (): React.ReactElement => {
  const { data, error, isLoading } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: fetchCommunities,
  });
  
  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community) => (
        <div
          key={community.id}
          className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform"
        >
          <Link
            to={`/community/${community.id.toString()}`}
            className="text-2xl font-bold text-purple-500 hover:underline"
          >
            {community.name}
          </Link>
          <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
