import { useParams } from 'react-router';
import { FC } from 'react';
import PostDetail from '../components/PostDetail';

const PostPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-20">
      <PostDetail postId={Number(id)} />
    </div>
  );
};

export default PostPage;
