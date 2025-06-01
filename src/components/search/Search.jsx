import React, { useState } from "react";
import { FilterIcon, ReturnIcon, SearchIcon } from "../../svg";
import axios from "axios";
import { useSelector } from "react-redux";
const { VITE_API_ENDPOINT } = import.meta.env;

const Search = ({ searchLength, setSearchResults }) => {
  const { user } = useSelector((state) => state.user);
  const token = user.access_token;
  const [show, setShow] = useState(false);

  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      try {
        const { data } = await axios.get(
          `${VITE_API_ENDPOINT}/api/v1/user?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults([data]);
      } catch (error) {
        console.log(error.response.data.error.message);
      }
    } else {
      setSearchResults([]);
    }
  };
  return (
    <div className="h-[49px] py-1.5">
      {/* container */}
      <div className="px-[10px]">
        {/* search input */}
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:bg-darkBg2 rounded-lg pl-2">
            {show || searchLength > 0 ? (
              <span
                className="w-8 items-center flex justify-center rotateAnimation cursor-pointer"
                onClick={() => setSearchResults([])}
              >
                <ReturnIcon className={"fill-green1 w-5"} />
              </span>
            ) : (
              <span className="w-8 items-center flex justify-center rotateAnimation">
                <SearchIcon className={"dark:fill-darkSvg2 w-5"} />
              </span>
            )}
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="input"
              onFocus={() => setShow(true)}
              onBlur={() => searchLength === 0 && setShow(false)}
              onKeyDown={(e) => handleSearch(e)}
            />
          </div>
          <button className="btn">
            <FilterIcon className={"dark:fill-darkSvg2"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
