import React, { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import Notification from "./notifications/Notification";
import Search from "./search/Search";
import Conversations from "./search/Conversations";
import SearchResult from "./search/SearchResult";

const Sidebar = ({ onlineUsers, typing }) => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div
      className="
  w-full sm:w-80 md:w-96 lg:w-[400px] xl:w-[420px] 
  sm:max-w-[35%] md:max-w-[40%] lg:max-w-[30%] 
  h-full select-none 
  flex flex-col
  bg-white dark:bg-gray-900
  border-r border-gray-200 dark:border-gray-700 sm:border-r-0
"
    >
      {/* sidebar header */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3">
        <SidebarHeader />
      </div>

      {/* notification */}
      <div className="flex-shrink-0 px-3 sm:px-4">
        <Notification />
      </div>

      {/* search */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-2">
        <Search
          searchLength={searchResults.length}
          setSearchResults={setSearchResults}
        />
      </div>

      {/* conversations - scrollable area */}
      <div className="overflow_scrollbar scrollbar">
        <div className="px-2 sm:px-3">
          {searchResults.length > 0 ? (
            <SearchResult
              setSearchResults={setSearchResults}
              searchResults={searchResults}
            />
          ) : (
            <Conversations typing={typing} onlineUsers={onlineUsers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
