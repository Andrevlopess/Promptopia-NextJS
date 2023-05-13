"use client";

import { useEffect, useState } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => {
        return (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        );
      })}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return allPosts.filter(
      (post) =>
        regex.test(post.creator.username) ||
        regex.test(post.tag) ||
        regex.test(post.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  useEffect(() => {
    const fecthPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setAllPosts(data);
    };

    fecthPosts();
  }, []);

  const handleTagClick = () => {}

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a prompt"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {searchText ? (
        searchedResults.length ? 
         <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
        :
         <h2 className="mt-5 font-inter text-center">No results for "{searchText}"</h2>
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
