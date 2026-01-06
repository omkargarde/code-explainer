import { Link } from "@tanstack/react-router";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import User from "./User";
import { GradientHeading } from "./GradientHeading";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 flex justify-between bg-gray-800 p-4 text-white shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-700"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <GradientHeading className="ml-4 text-2xl font-semibold">
            <Link to="/">
              Mock <span className="text-white">interviewer</span>
            </Link>
          </GradientHeading>
        </div>
        <User />
      </header>

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-80 transform flex-col bg-gray-900 text-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-800"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {/* TODO: remove or complete the route*/}
          {/* <Link
            to="/code"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-800"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
            }}
          >
            <span className="font-medium">Code</span>
          </Link>*/}
          {/* TODO: remove or complete the route*/}
          {/* <Link
            to="/upload"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-800"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
            }}
          >
            <span className="font-medium">Upload</span>
          </Link>*/}
          <Link
            to="/chat"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-800"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
            }}
          >
            <span className="font-medium">Generate questions</span>
          </Link>
          <Link
            to="/chat"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-800"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
            }}
          >
            <span className="font-medium">Chat</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
