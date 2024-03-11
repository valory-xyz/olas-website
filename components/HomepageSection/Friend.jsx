import PropTypes from 'prop-types';
import Image from 'next/image';

const Friend = ({ friend }) => (
  <a href={friend.url} className="h-[50px] w-full grayscale" target="_blank" rel="noreferrer">
    <Image src={`/images/friends/${friend.imageFilename}`} alt={friend.name} width={150} height={100} className="mx-auto" />
  </a>
);

Friend.propTypes = {
  friend: PropTypes.shape({
    imageFilename: PropTypes.string,
    name: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default Friend;
