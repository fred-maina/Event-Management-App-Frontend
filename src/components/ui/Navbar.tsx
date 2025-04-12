import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <nav className="flex items-center justify-between p-4 shadow-md bg-white fixed w-full top-0 z-50">
      <div className="text-2xl font-bold text-indigo-600">Eventify</div>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-5">
        <a href="#" className="hover:text-indigo-600">Home</a>
        <a href="#" className="hover:text-indigo-600">Events</a>
        <a href="#" className="hover:text-indigo-600">About</a>
        <a href="#" className="hover:text-indigo-600">Contact</a>
      </div>

      {/* Buttons */}
      <div className="hidden md:flex space-x-4">
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link to="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>

      {/* Mobile Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="md:hidden">
          <Menu size={28} />
        </SheetTrigger>
        <SheetContent side="right" className="p-6 flex flex-col space-y-6 w-[300px]">
          <a href="#" className="text-lg hover:text-indigo-600">Home</a>
          <a href="#" className="text-lg hover:text-indigo-600">Events</a>
          <a href="#" className="text-lg hover:text-indigo-600">About</a>
          <a href="#" className="text-lg hover:text-indigo-600">Contact</a>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
