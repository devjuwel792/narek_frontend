import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuBell } from "react-icons/lu";
import { Link } from "react-router-dom";
export function NotificationsDropdown() {
  const [notifications] = useState([
    { id: 1, message: "New user registered", time: "5m ago" },
    { id: 2, message: "Content awaiting approval", time: "10m ago" },
    { id: 3, message: "System update scheduled", time: "1h ago" },
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {" "}
        <div className="text-pink-500 relative p-1">
          <div className="h-2 w-2 bg-pink-500 absolute top-0 right-0  rounded-full"></div>
          <LuBell className="text-2xl" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black  !outline-none text-white mt-0 mr-6 p-5 w-72 border-gray-500/50">
        <div className="text-lg border-b-4 font-medium pb-3 border-gray-300/50">
          Notification
        </div>
        <div className="space-y-3 mt-3">
          {notifications.map((notification) => (
            <div>
              <Link className="" key={notification.id}>
                <div
                  className="
                 text-white  font-normal 
                  "
                >
                  {notification.message}
                </div>

                <div className="text-gray-400 mt-0.5">{notification.time}</div>
              </Link>
            </div>
          ))}
        </div>

        <div className=" text-center cursor-pointer mt-2 justify-center text-pink-500  font-normal ">
          Mark all as read
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
