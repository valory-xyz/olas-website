import { formatEthNumber, formatWeiNumber } from 'common-util/numberFormatter';
import { isNil } from 'lodash';

// Full (non-compact) numbers so the values are unambiguous when read as text.
const FULL_NUMBER: Intl.NumberFormatOptions = {
  notation: 'standard',
  maximumFractionDigits: 0,
};

const SUPPLY_ROWS = [
  { label: 'Total supply', key: 'totalSupplyWei' },
  { label: 'Circulating supply', key: 'circulatingSupplyWei' },
  { label: 'veOLAS (vote escrow)', key: 'veOlasWei' },
  { label: 'DAO treasury', key: 'daoWei' },
  { label: 'Valory (core contributor)', key: 'valoryWei' },
];

/**
 * Screen-reader-only semantic tables mirroring the tokenomics charts, so the
 * key numbers exist as plain DOM text (the charts render to <canvas>, which
 * is invisible to fetchers, crawlers, and assistive technology).
 */
export const TokenomicsSummaryTable = ({ tokenomics }) => {
  const supply = tokenomics?.supplyDistribution?.value;
  const schedule = tokenomics?.emissionSchedule?.value;
  const epochDistribution = tokenomics?.epochDistribution?.value;

  if (!supply && !schedule && !epochDistribution) return null;

  return (
    <section aria-label="OLAS tokenomics summary" className="sr-only">
      {supply && (
        <table>
          <caption>OLAS supply</caption>
          <tbody>
            {SUPPLY_ROWS.map(({ label, key }) => (
              <tr key={key}>
                <th scope="row">{label}</th>
                <td>{formatWeiNumber(supply[key], FULL_NUMBER)} OLAS</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {epochDistribution && (
        <table>
          <caption>{`Current emission split (epoch ${epochDistribution.epoch})`}</caption>
          <tbody>
            <tr>
              <th scope="row">Staking (operators)</th>
              <td>{epochDistribution.split.staking}%</td>
            </tr>
            <tr>
              <th scope="row">Bonders</th>
              <td>{epochDistribution.split.bonders}%</td>
            </tr>
            <tr>
              <th scope="row">Developers (builders)</th>
              <td>{epochDistribution.split.developers}%</td>
            </tr>
          </tbody>
        </table>
      )}
      {schedule && (
        <table>
          <caption>{`Max emission schedule — annual inflation cap in OLAS (currently year ${schedule.currentYear})`}</caption>
          <tbody>
            {schedule.inflationForYear.map((inflation, year) => (
              <tr key={year}>
                <th scope="row">{`Year ${year}`}</th>
                <td>
                  {isNil(inflation) ? '—' : `${formatEthNumber(inflation, FULL_NUMBER)} OLAS`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
