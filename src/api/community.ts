import { supabase } from '../supabase-client';

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface CommunityInput {
  name: string;
  description: string;
}

export const createCommunity = async (community: CommunityInput): Promise<CommunityInput[] | null> => {
  const { error, data } = await supabase.from('communities').insert(community);

  if (error) throw new Error(error.message);
  return data;
};

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
}; 