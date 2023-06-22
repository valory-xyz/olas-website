import Image from "next/image";

const Friend = ({ friend }) => {
  return (
      <a href={friend.url} className='relative'>
        <Image src={`/images/friends/${friend.imageFilename}`} alt={friend.name} width={150} height={100}  className="mx-auto max-h-[100px]" />
      </a>
  );
}

export default Friend;