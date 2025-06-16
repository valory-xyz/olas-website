import Markdown from 'common-util/Markdown';
import { Card } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

export const TrustedByItem = ({ quote, className }) => (
  <Card
    className={`flex flex-col p-6 border-2 border-white rounded-2xl shadow-sm bg-white gap-4 bg-slate-50 ${className}`}
  >
    <div className="text-purple-600">
      <Markdown className="text-black">{quote.quote}</Markdown>
      {quote.blogUrl && (
        <div className="mt-4 font-semibold">
          <Link href={quote.blogUrl}>Read more</Link>
        </div>
      )}
    </div>
    <div className="mt-auto flex flex-row gap-3">
      <div className="aspect-square mt-auto">
        <Image
          src={`/images/homepage/${quote.userIcon || quote.icon}`}
          alt="Build"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col mr-auto">
        <a href={quote.nameUrl} target="_blank" className="font-semibold">
          {quote.name}
        </a>
        <p className="text-slate-500 text-sm">{quote.title}</p>
      </div>
    </div>
  </Card>
);

TrustedByItem.propTypes = {
  quote: PropTypes.shape({
    quote: PropTypes.string.isRequired,
    blogUrl: PropTypes.string.isRequired,
    userIcon: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    nameUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

TrustedByItem.defaultProps = {
  className: '',
};
