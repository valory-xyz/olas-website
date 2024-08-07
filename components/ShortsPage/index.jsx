import SectionWrapper from 'components/Layout/SectionWrapper';
import {
  LightbulbIcon,
  FastForwardIcon,
  CopyrightIcon,
  CircleDollarSign,
} from 'lucide-react';

const benefits = [
  {
    id: '1',
    title: 'Start with an Idea',
    description: 'Don\'t worry about over-detailed scripting. Just enter your initial idea, and the intelligent agents do the rest, crafting a detailed narrative from your initial spark.',
    icon: LightbulbIcon,
  },
  {
    id: '2',
    title: 'Get it in 30 minutes',
    description: 'From concept to film in just 30 minutes. Submit your ideas and agents swiftly produce a complete short film complete with video and audio. It\'s rapid content creation without the wait.',
    icon: FastForwardIcon,
  },
  {
    id: '3',
    title: 'Own it forever',
    description: 'Your film, your rights-- forever. Each film is minted as an NFT, granting you exclusive ownership and the freedom to showcase or sell your creation as you see fit.',
    icon: CopyrightIcon,
  },
  {
    id: '4',
    title: 'Hassle-free payment',
    description: 'Skip the multiple transactions. One simple crypto payment covers everything, making the process straightforward and seamless.',
    icon: CircleDollarSign,
  },
];

const getStarted = [
  {
    id: '1',
    title: 'Visit shorts.wtf',
  },
  {
    id: '2',
    title: 'Connect your wallet with xDAI',
  },
  {
    id: '3',
    title: 'Enter your idea.',
    description: 'Type in your film concept or inspiration--no detail needed, just a starting point.',
  },
  {
    id: '4',
    title: 'Wait for 30 minutes',
    description: 'Grab a coffee while the AI agents work their magic, transforming your idea into a complete short film.',
  },
  {
    id: '5',
    title: 'Voila',
    description: 'In no time, your film is ready to watch, share, or even sell.',
  },
];

export const ShortsPage = () => (
  <SectionWrapper>
    <div className="">
      <img
        src="/images/shorts/robot.jpeg"
        alt="robot"
        width={500}
        height={500}
        className=""
      />
      <div className="flex flex-col items-start gap-5 w-full max-w-screen-lg text-start">
        <h1 className="text-sm font-semibold">SHORTS.WTF</h1>
        <h2 className="text-5xl font-bold">
          Create a short film
          <br />
          with just one prompt
        </h2>
        <p className="font-light mt-4 leading-relaxed">
          Start with an idea and get a complete AI agent-generated short film
          <br />
          in 30 minutes.
        </p>
      </div>
      <div className="flex flex-col justify-start px-4 mt-20 md:px-8 lg:px-16">
        <h3 className="text-2xl font-semibold">
          Turn your ideas into films
          <br />
          with just one click
        </h3>
        <p className="mt-4">
          From concept to complete film in just 30 minutes, shorts.wtf uses
          <br />
          autonomous AI agents that craft detailed narratives from your initial
          <br />
          ideas and then turn them into videos, including audio.
          <br />
          Designed for creatives and professionals who need quick, compelling
          <br />
          video content without thinking too much.
        </p>
      </div>
      <div className="flex flex-col px-2 md:px-8 lg:px-16">
        <h4 className="text-4xl font-bold mb-10 text-center mt-20">Benefits</h4>
        <div className="grid grid-cols-2 gap-10 p-6 max-w-screen-lg text-sm mx-auto">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="bg-slate-100 rounded-lg p-3 flex items-start">
              <div className="text-blue-500 mr-4 text-xl">
                <benefit.icon />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-700 text-lg">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start px-4 md:px-8 lg:px-16">
          <h4 className="text-2xl text-start font-bold mb-4 mt-20">Get Started</h4>
          <div className="max-w-screen-md mx-auto p-6 font-light">
            <ol className="list-decimal space-y-4 text-xl font-light">
              {getStarted.map((step) => (
                <li key={step.id}>
                  <h3 className="text-xl text-left items-start font-semibold">{step.title}</h3>
                  {step.description && <p className="text-gray-700 mt-2">{step.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

export default ShortsPage;
