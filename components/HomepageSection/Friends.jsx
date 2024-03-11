import friends from 'data/friends.json';
import Friend from './Friend';
import SectionHeading from '../SectionHeading';
import SectionWrapper from '../Layout/SectionWrapper';

const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));
const Friends = () => (
  <SectionWrapper id="friends">
    <section className="bg-white max-w-[1000px] mx-auto md:p-12">
      <div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
        <div className="text-center mb-12">
          <SectionHeading size="text-5xl" color="text-purple-950">
            Friends of Olas
          </SectionHeading>
        </div>
        <div className="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 md:grid-cols-2 lg:grid-cols-3  items-center">
          {sortedFriends.map((friend) => (
            <div key={friend.id}>
              <Friend friend={friend} />
            </div>
          ))}
        </div>
      </div>
    </section>
  </SectionWrapper>
);

export default Friends;
