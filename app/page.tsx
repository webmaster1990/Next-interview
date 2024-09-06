"use client";
import PeopleList from "@/components/PeopleList";
/*
TASK 1:
Fetch a list of the first 10 people in the Star Wars API and display their names in a list. docs: https://swapi.dev/documentation#people
For the sake of this exercise, you do not use the built in pagination feature of the API.
TASK 2:
Add a + button next to each name that when clicked will fetch and display the person's homeworld. docs: https://swapi.dev/documentation#people
TASK 3:
Use react query to create a infinite paginated list of people from the Star Wars API. https://tanstack.com/query/latest/docs/framework/react/overview


*/
export default function Home() {
  return <div className="container mx-auto p-6">
  <PeopleList />
</div>;
}