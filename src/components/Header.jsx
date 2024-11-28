import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

export const Header = ({ onSearch, logoClick, hideSearchBar }) => {
    const [query, setQuery] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);

    const handleSearch = e => {
        e.preventDefault();
        if (isFiltered) {
            setQuery("");
            onSearch("");
            setIsFiltered(false);
            return;
        }
        setIsFiltered(true);
        onSearch(query);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Menu className="w-6 h-6" />
                    </button>
                    <a
                        href="/"
                        onClick={e => {
                            e.preventDefault();
                            logoClick();
                        }}
                        className="flex items-center cursor-pointer"
                    >
                        <div className="flex items-center cursor-pointer">
                            <span className="text-xl font-bold">Maalsi Tube</span>
                        </div>
                    </a>
                </div>
                {!hideSearchBar && (
                    <div>
                        <form className="hidenn md:flex flex-1 max-w-2xl mx-4" onSubmit={handleSearch}>
                            <div className="flex flex-1">
                                <input
                                    type="text"
                                    placeholder="Recherche"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    readOnly={isFiltered}
                                />
                                <button type="submit" className="px-6 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200">
                                    {isFiltered ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                <div>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};
