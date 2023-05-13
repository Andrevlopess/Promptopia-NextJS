"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Profile from "@components/Profile";

const MyProfile = () => {


  const {data:session} = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fecthPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };

    if(session?.user.id)fecthPosts();
  }, []);

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete?")
    
    if(hasConfirmed){
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: 'DELETE',
        });

        const filteredPosts = posts.filter(p => p._id !== post._id)
        setPosts(filteredPosts);

      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your profile Page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
