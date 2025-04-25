import { TEXT_LARGE_CLASS } from 'common-util/classes';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Card } from './ui/card';

export const StarterCards = ({
  imgUrl,
  title,
  content,
  button,
  className,
  imgClassName,
  titleClassName,
  contentClassName,
  buttonClassName,
}) => (
  <Card className={`flex flex-col w-full ${className || ''}`}>
    <div className="border-b-1.5 text-left flex flex-row gap-3 place-items-center p-6">
      <Image
        alt={title}
        src={imgUrl}
        width={40}
        height={40}
        className={imgClassName}
      />
      <h2 className={`${TEXT_LARGE_CLASS} font-bold ${titleClassName || ''}`}>
        {title}
      </h2>
    </div>
    <div
      className={`h-full flex flex-col p-6 w-full ${contentClassName || ''}`}
    >
      <div className="text-left w-full">{content}</div>
      <div className={`mt-auto ${buttonClassName || ''}`}>{button}</div>
    </div>
  </Card>
);

StarterCards.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  button: PropTypes.node,
  imgUrl: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
};
