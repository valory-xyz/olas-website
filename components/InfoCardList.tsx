import { CARD_CSS, TEXT_CLASS } from 'common-util/classes';

interface InfoCardListProps {
  wrapperClasses?: string;
  cards?: {
    icon?: unknown;
    title?: string;
    desc?: string;
  }[];
}

export const InfoCardList = ({ cards, wrapperClasses }: InfoCardListProps) => {
  if (!cards) return null;

  return (
    <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${wrapperClasses}`}>
      {cards.map(({ icon, title, desc }, index) => {
        const isLastOdd = cards.length % 2 !== 0 && index === cards.length - 1;
        return (
          <div
            key={title}
            className={`flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6 ${isLastOdd ? 'md:translate-x-1/2' : ''}`}
            style={CARD_CSS}
          >
            Remove this comment to see the full error message
            <div className="flex items-center">
              {icon || null}
              <h3 className={`text-xl font-semibold ${icon ? 'ml-2' : ''}`}>
                {title}
              </h3>
            </div>
            <div className={TEXT_CLASS}>{desc}</div>
          </div>
        );
      })}
    </div>
  );
};

InfoCardList.defaultProps = {
  cards: [],
  wrapperClasses: '',
};
