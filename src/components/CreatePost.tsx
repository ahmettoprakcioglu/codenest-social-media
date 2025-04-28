import { ChangeEvent, FC, useState } from 'react';
import { supabase } from '../supabase-client';
import { useMutation } from '@tanstack/react-query';

interface PostInput {
  title: string;
  content: string;
}

const createPost = async (post: PostInput, imageFile: File): Promise<PostInput | null> => {
  const filePath = `${post.title}-${String(Date.now())}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from('post-images')
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from('posts')
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

const CreatePost: FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => createPost(data.post, data.imageFile),
  });
  
  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setIsSubmitted(true);
    
    if (!selectedFile) {
      setImageError('Please select an image');
      return;
    }
    
    setImageError('');
    mutate({ post: { title, content }, imageFile: selectedFile });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setSelectedFile(file);
        setImageError('');
      } else {
        setImageError('Please select a valid image file (JPG, JPEG, or PNG)');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); }}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => { setContent(e.target.value); }}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
          rows={5}
          placeholder="Write your post content here..."
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="block text-sm font-medium text-gray-300">
          Upload Image
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isSubmitted && !selectedFile ? 'border-red-500' : 'border-gray-600 hover:border-purple-500'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('border-purple-500');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-purple-500');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-purple-500');
            const file = e.dataTransfer.files[0];
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
              setSelectedFile(file);
              setImageError('');
            } else {
              setImageError('Please select a valid image file (JPG, JPEG, or PNG)');
            }
          }}
          onClick={() => document.getElementById('image')?.click()}
        >
          <input
            type="file"
            id="image"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          {selectedFile ? (
            <div className="space-y-2">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="mx-auto h-32 w-32 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-400">{selectedFile.name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (isSubmitted) {
                    setImageError('Please select an image');
                  }
                }}
                className="text-red-500 text-sm cursor-pointer hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-400">
                Drag and drop your image here, or click to select
              </p>
              <p className="text-xs text-gray-500">Supports: JPG, JPEG, PNG (Required)</p>
            </div>
          )}
        </div>
        {imageError
          ? <p className="text-sm text-red-500 mt-1">{imageError}</p>
          : (isSubmitted && !selectedFile) && (
            <p className="text-sm text-red-500 mt-1">Please select an image</p>
          )
        }
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
          <span>Create Post</span>
        )}
      </button>

      {isError && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          Error creating post. Please try again.
        </div>
      )}
    </form>
  );
};

export default CreatePost;
