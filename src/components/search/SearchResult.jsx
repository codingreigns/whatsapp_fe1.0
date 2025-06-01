import React from "react";
import Contact from "./Contact";

const SearchResult = ({ searchResults, setSearchResults }) => {
  return (
    <div className="w-full convos scrollbar">
      <div className="flex flex-col px-8 pt-8">
        <h1 className="font-extralight text-md text-green2">Contacts</h1>
        {/* <span className="w-full mt-4 ml-10 border-b border-b-darkBorder1"></span> */}
      </div>
      {/* results */}
      <ul>
        {searchResults &&
          searchResults?.map((user) => (
            <Contact
              setSearchResults={setSearchResults}
              contact={user}
              key={user?._id}
            />
          ))}
      </ul>
    </div>
  );
};

export default SearchResult;
