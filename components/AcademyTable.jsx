import academyMetrics from 'data/academyMetrics.json';

const academyTotals = academyMetrics.reduce(
  (acc, val) => {
    acc.participants += val.participants;
    acc.graduates += val.graduates;
    acc.placed += val.placed;
    acc.hired += val.hired;
    return acc;
  },
  {
    participants: 0,
    graduates: 0,
    placed: 0,
    hired: 0,
  },
);

export const AcademyTable = () => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-[800px] table-fixed mx-auto text-center divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="w-1/5">Cohort</th>
              <th className="w-1/5">Total Participants</th>
              <th className="w-1/5">Graduates</th>
              <th className="w-1/5">Placed with Projects</th>
              <th className="w-1/5">Hired by Valory</th>
            </tr>
          </thead>
          <tbody>
            {academyMetrics.map((metric, index) => (
              <tr key={index}>
                <td className="font-bold">{index + 1}</td>
                <td>{metric.participants}</td>
                <td>{metric.graduates}</td>
                <td>{metric.placed === 0 ? '-' : metric.placed}</td>
                <td>{metric.hired}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td>Total</td>
              <td>{academyTotals.participants}</td>
              <td>{academyTotals.graduates}</td>
              <td>{academyTotals.placed}</td>
              <td>{academyTotals.hired}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="caption-bottom text-xs text-center mt-8">
        * Official project placements began with Cohort 7, marking a significant
        milestone in connecting developers with real-world opportunities.
      </p>
    </>
  );
};
