import Friend from "./Friend";
import friends from "@/data/friends.json";
import SectionHeading from "../SectionHeading";

const Friends = () => {
  const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section class="bg-white dark:bg-gray-900 max-w-[1000px] mx-auto">
      <div class="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
        <div className="text-center mb-12">
          <SectionHeading size="text-5xl" color="text-purple-950">
            Friends of Olas
          </SectionHeading>
        </div>
        <div class="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 md:grid-cols-5 dark:text-gray-400 items-center">
          {sortedFriends.map((friend) => {
            return (
              <div key={friend.id}>
                <Friend friend={friend} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Friends;
