import { SUB_HEADER_LG_CLASS } from "common-util/classes";
import { Card } from "components/ui/card";
import Image from "next/image";

const CARD_BG =
  "border-1.5 border-gray-200 rounded-2xl p-6 bg-gradient-to-t from-[#F2F4F7] to-white";

export const TheProcess = () => (
  <div>
    <div className="px-6 mx-auto max-w-screen-sm">
      <h2 className={`${SUB_HEADER_LG_CLASS} text-left py-8`}>The process</h2>
    </div>

    <Card
      className={`${CARD_BG} max-h-[250px] w-[750px] p-8 max-w mb-8 mx-auto`}
    >
      <Image
        alt="The process"
        src="/images/optimus-page/process.png"
        height={126}
        width={546}
        className="mx-auto"
      />
    </Card>

    <div className="px-6 mx-auto max-w-screen-sm">
      <p className="mb-3">Every 24 hours, Optimus follows a simple cycle:</p>
      <ol className="list-decimal">
        <li className="mb-2">
          <strong>Finds the best opportunities:</strong>
          <p>
            It looks for liquidity pools on{" "}
            <a
              href="https://merkl.angle.money/"
              className="text-purple-600 underline"
              target="_blank"
            >
              Merkl↗
            </a>
            , targeting those on Balancer and Uniswap with an APR (annual
            percentage rate) higher than 5%.
          </p>
        </li>
        <li>
          <strong>Makes smart investments:</strong>
          <ol className="list-[lower-alpha] mb-2 ml-4">
            <li className="py-1">
              If it&apos;s the first investment and the pool&apos;s APR is over
              5%, Optimus adds liquidity.
            </li>
            <li className="py-1">
              If it finds a pool with a higher APR than your current one,
              Optimus moves your assets to maximize your earnings.
            </li>
            <li className="py-1">
              {" "}
              If no opportunities are available, it waits until the next period
              and restarts the cycle.
            </li>
          </ol>
        </li>
        <li>
          <strong>Tracks performance:</strong>
          <p>
            By keeping track of the number of transactions performed on the
            Optimism chain, Optimus contributes to your KPIs (key performance
            indicators) for Olas staking rewards. This means that if you run
            Optimus daily, you earn staking rewards based on your agent&apos;s
            activity.
          </p>
        </li>
      </ol>
    </div>
  </div>
);
