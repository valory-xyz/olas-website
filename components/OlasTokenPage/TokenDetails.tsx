import SectionWrapper from 'components/Layout/SectionWrapper';
import TOKEN_DETAILS from 'data/tokens.json';
import SectionHeading from '../SectionHeading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

/**
 * Truncates an Ethereum address to show the first five characters, a ...,
 * and the last three characters
 * @param {string} address - The Ethereum address to truncate
 * @returns {string} The truncated address
 */
export const truncateAddress = (address) =>
  address
    ? `${address.substring(0, 7)}...${address.substring(address.length - 5)}`
    : '--';

const generateExplorerUrl = (token) =>
  `${token.explorerBaseUrl}${token.address}`;

export const TokenDetails = () => (
  <>
    <div id="token-details" />
    <SectionWrapper
      customClasses="border-b px-8 py-12 lg:p-24 text-black"
      backgroundType="SUBTLE_GRADIENT"
    >
      <div>
        <SectionHeading
          size="text-3xl sm:text-5xl lg:text-3xl xl:text-4xl lg:mb-10 text-center font-bold"
          color="text-black"
        >
          Token Details
        </SectionHeading>
        <div className="hidden md:block">
          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left border">Network</TableHead>
                <TableHead className="text-left border">Get OLAS</TableHead>
                <TableHead className="text-left border">
                  Token Address
                </TableHead>
                <TableHead className="text-left border">
                  Bridge from Ethereum to Network
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOKEN_DETAILS.map((token, index) => {
                const explorerUrl = generateExplorerUrl(token);
                return (
                  <TableRow key={index}>
                    <TableCell className="border">{token.name}</TableCell>
                    <TableCell className="border">
                      {token.exchanges ? (
                        <div className="flex flex-col gap-2">
                          {token.exchanges.map((exchange) => (
                            <a
                              key={exchange.url}
                              href={exchange.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {exchange.name} ↗
                            </a>
                          ))}
                        </div>
                      ) : (
                        'Coming soon'
                      )}
                    </TableCell>
                    <TableCell className="border break-all">
                      <a
                        href={explorerUrl}
                        title={token.address}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {truncateAddress(token.address)} ↗
                      </a>
                    </TableCell>
                    <TableCell className="border">
                      {token.bridge ? (
                        <a
                          href={token.bridge.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {token.bridge.name} ↗
                        </a>
                      ) : (
                        'n/a'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden flex flex-col space-y-4">
          {TOKEN_DETAILS.map((token, index) => {
            const explorerUrl = generateExplorerUrl(token);
            return (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-bold mb-2">{token.name}</h3>
                <p>
                  <strong>Get OLAS:</strong>{' '}
                  {token.exchanges ? (
                    <div className="flex gap-x-2 flex-wrap">
                      {token.exchanges.map((exchange) => (
                        <a
                          key={exchange.url}
                          href={exchange.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {exchange.name} ↗
                        </a>
                      ))}
                    </div>
                  ) : (
                    'TBD'
                  )}
                </p>
                <p>
                  <strong>Token Address:</strong>{' '}
                  <a
                    href={explorerUrl}
                    title={token.address}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {truncateAddress(token.address)} ↗
                  </a>
                </p>
                <p>
                  <strong>Bridge:</strong>{' '}
                  {token.bridge ? (
                    <a
                      href={token.bridge.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {token.bridge.name} ↗
                    </a>
                  ) : (
                    'n/a'
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  </>
);
