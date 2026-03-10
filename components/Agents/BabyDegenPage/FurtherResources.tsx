import { TELEGRAM_INVITE_URL } from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';

const resources = [
  {
    title: 'Contribute a strategy',
    description:
      'Built a trading bot? Expert trader? Share your knowledge and add to the strategy library.',
    url: TELEGRAM_INVITE_URL,
    urlName: 'Reach out on Telegram',
    isExternal: true,
  },
];

export const FurtherResources = () => (
  <div className="max-w-[670px] mx-auto">
    <GetInvolvedCards id="babydegen-resources" title="Further resources" list={resources} />
  </div>
);
