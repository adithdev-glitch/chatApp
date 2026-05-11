import React, { useContext, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { MsgContext } from "../context/msgContext";
import { UserContext } from "../context/userContext";

const Sidebar = () => {
  const token = localStorage.getItem("token");
  const { fetchUsers, filteresUser, selectedUser, setSelectedUser } = useContext(MsgContext);
  const {onlineUsers} = useContext(UserContext);


  useEffect(() => {
    fetchUsers(token);
  }, []);

  return (
    <aside className="h-full w-[30%] min-w-[200px] border-r border-gray-200 flex flex-col light:bg-white dark:text-white"> 
      {/* Header */}
      <div className="border-b border-gray-200 p-4 font-semibold text-blue-300 text-center lg:text-left ">
        Contacts
      </div>

      {/* Search */}
      {/* <div className="p-2">
        <div className="relative text-gray-600">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
        </div>
      </div> */}

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {filteresUser && filteresUser.length > 0 ? (
          filteresUser.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-2 md:p-3 flex items-center gap-3 cursor-pointer rounded-lg transition-all duration-200
                ${selectedUser?._id === user._id ? "bg-indigo-400" : "hover:bg-blue-50"}
              `}
            >
              {/* Avatar */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={user.profilepic || "/avatar.png"}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-lg dark:text-white"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* User info */}
              <div className="flex flex-col min-w-0 truncate text-indigo-400">
                <span className="font-medium truncate text-indigo-400">{user.name}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
