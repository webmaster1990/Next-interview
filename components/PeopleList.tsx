"use client";
import { useState } from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';

interface Person {
  name: string;
  homeworld: string;
}

interface PeoplePage {
  results: Person[];
  next?: string;
}

const fetchPeople = async ({ pageParam = process.env.NEXT_PUBLIC_API_URL }: { pageParam?: string }) => {
  const res = await axios.get<PeoplePage>(pageParam as string);
  return res.data;
};

const PeopleList: React.FC = () => {
  const [homeworlds, setHomeworlds] = useState<Record<string, string>>({});
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Track which person has their homeworld visible

const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['people'],
    queryFn: fetchPeople,
    getNextPageParam: (lastPage: PeoplePage): string | undefined => lastPage.next || undefined,
    initialPageParam: process.env.NEXT_PUBLIC_API_URL, // Set the initial page param here
  });
  

  const fetchHomeworld = async (url: string, index: number) => {
    // Toggle off if the same person is clicked again
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse the homeworld view
      return;
    }

    if (!homeworlds[url]) {
      const response = await axios.get<any>(url);
      setHomeworlds((prev) => ({ ...prev, [url]: response.data.name }));
    }
    setExpandedIndex(index);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-white-800">Star Wars Characters</h1>
      <ul className="space-y-6">
        {data?.pages.map((page, i) => (
          <div key={i}>
            {page?.results?.map((person: Person, index: number) => (
              <li key={index} className="bg-gradient-to-r from-blue-100 to-blue-300 shadow-lg rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl m-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-gray-800">{person.name}</span>
                  <button
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => fetchHomeworld(person.homeworld, index)}
                  >
                    {expandedIndex === index ? '-' : '+'} {/* Toggle button between + and - */}
                  </button>
                </div>
                {expandedIndex === index && homeworlds[person.homeworld] && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg text-gray-700">
                    <strong>Homeworld:</strong> {homeworlds[person.homeworld]}
                  </div>
                )}
              </li>
            ))}
          </div>
        ))}
      </ul>
      <div className="mt-10 text-center">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
            isFetchingNextPage ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isFetchingNextPage || isLoading ? 'Loading...' : 'Load More'} {/* Show Loading text while fetching */}
        </button>
      </div>
    </div>
  );
};

export default PeopleList;
