import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../supabase-client';

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput): Promise<CommunityInput[] | null> => {
  const { error, data } = await supabase.from('communities').insert(community);

  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity: FC = (): React.ReactElement => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] })
        .then(() => navigate('/communities'))
        .catch(() => navigate('/communities'));
    },
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    mutate({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>
      
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Community Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => { setName(e.target.value); }}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter community name"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => { setDescription(e.target.value); }}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Describe your community..."
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Creating...</span>
          </>
        ) : (
          <span>Create Community</span>
        )}
      </button>

      {isError && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          Error creating community. Please try again.
        </div>
      )}
    </form>
  );
};