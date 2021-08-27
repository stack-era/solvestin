import React from 'react'
import SearchIcon from "../assets/icons/Search-icon.svg";
import Image from 'next/image';

const SearchBar = () => {
    return (
      <div>
        <div className="flex items-center">
          <div className="flex flex-col ml-6 mt-7">
            <h2 className="__text-cario font-bold text-xl bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] to-[#FAA08A]">
              Get started with Investing
            </h2>
        
          </div>
          <div className="__dashboard-input-bg flex items-center gap-2 ml-28   h-12 mt-7 p-3 opacity-70 border border-[#333335]">
            <Image
              src={SearchIcon}
              alt="Dashboard Icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              placeholder="Search anything here..."
              className=" h-9 w-[20rem] bg-transparent outline-none"
            />
          </div>
        </div>
      </div>
    );
}

export default SearchBar
