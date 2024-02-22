import Friend from "./Friend";
import friends from "@/data/friends.json";
import SectionHeading from "../SectionHeading";
import SectionWrapper from "../Layout/SectionWrapper";


const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));
const Friends = () => {

  return (
    <SectionWrapper id="friends">
    <section class="bg-white max-w-[1000px] mx-auto md:p-12">
      <div class="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
        <div className="text-center mb-12">
          <SectionHeading size="text-5xl" color="text-purple-950">
            Friends of Olas
          </SectionHeading>
        </div>
        <div class="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 md:grid-cols-2 lg:grid-cols-3  items-center">
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
    </SectionWrapper>
  );
};

export default Friends;
