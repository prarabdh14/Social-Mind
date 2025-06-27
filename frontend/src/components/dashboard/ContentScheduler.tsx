import React, { useEffect, useState } from 'react';
import { postService } from '../../services/api';
import { Post } from '../../types';
import PostComposer from './PostComposer';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const platformIcons: Record<string, JSX.Element> = {
  Instagram: <Instagram className="inline w-5 h-5 text-pink-500" />,
  Twitter: <Twitter className="inline w-5 h-5 text-blue-400" />,
  Facebook: <Facebook className="inline w-5 h-5 text-blue-700" />,
  YouTube: <Youtube className="inline w-5 h-5 text-red-500" />,
};

const ContentScheduler: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postService.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
      setSuccess('Post deleted successfully!');
      setTimeout(() => setSuccess(null), 2000);
    } catch {
      setError('Failed to delete post');
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingPost(null);
  };

  const handleModalSubmit = async (data: any) => {
    try {
      if (editingPost) {
        await postService.updatePost(editingPost.id, data);
        setSuccess('Post updated successfully!');
      } else {
        await postService.createPost(data);
        setSuccess('Post scheduled successfully!');
      }
      setModalOpen(false);
      setEditingPost(null);
      fetchPosts();
      setTimeout(() => setSuccess(null), 2000);
    } catch {
      setError('Failed to save post');
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Content Calendar & Scheduler</h2>
          <button onClick={handleCreate} className="bg-[#4ECDC4] text-white px-4 py-2 rounded font-semibold hover:bg-[#45b7af]">+ New Post</button>
        </div>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div>Loading posts...</div>
        ) : (
          <div>
            <h3 className="font-semibold mb-2">Scheduled Posts</h3>
            {posts.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">No scheduled posts.</div>
            ) : (
              <table className="w-full text-left border">
                <thead>
                  <tr>
                    <th className="p-2 border">Content</th>
                    <th className="p-2 border">Platform</th>
                    <th className="p-2 border">Scheduled At</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="p-2 border max-w-xs truncate">{post.content}</td>
                      <td className="p-2 border">
                        {platformIcons[post.platform] || post.platform}
                        <span className="ml-2">{post.platform}</span>
                      </td>
                      <td className="p-2 border">{new Date(post.scheduledAt).toLocaleString()}</td>
                      <td className="p-2 border">{post.status}</td>
                      <td className="p-2 border space-x-2">
                        <button onClick={() => handleEdit(post)} className="text-blue-500 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
      {modalOpen && (
        <PostComposer
          onClose={handleModalClose}
          post={editingPost}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default ContentScheduler; 