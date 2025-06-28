import { Search, Bell, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarTrigger } from "../components/ui/sidebar";

export function Header() {
  return (
    <header 
      className="h-16 border-b bg-white flex items-center justify-between px-6"
      role="banner"
      aria-label="Application header"
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger 
          aria-label="Toggle sidebar navigation"
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        />
        <div className="relative w-96">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
            aria-hidden="true"
          />
          <Input
            placeholder="Search posts, accounts, analytics..."
            className="pl-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Search posts, accounts, and analytics"
            role="searchbox"
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Create new post"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Create Post
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="View notifications"
          className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </Button>

        <Avatar 
          role="button"
          tabIndex={0}
          aria-label="User profile menu"
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full cursor-pointer"
        >
          <AvatarImage src="https://github.com/shadcn.png" alt="User profile picture" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
