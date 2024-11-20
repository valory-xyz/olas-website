import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import { Button } from '../Button';
import SectionHeading from '../SectionHeading';

const Hero = () => (
  <SectionWrapper backgroundType='SUBTLE_GRADIENT' customClasses='py-16 border-y text-black'>
    <div className='grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center'>
      <div className='lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12'>
        <div className='mb-6 text-lg tracking-widest uppercase'>OLAS Token</div>
        <SectionHeading size='text-6xl sm:text-7xl lg:text-5xl xl:text-6xl lg:mb-12 font-bold' color='text-black'>
          Unlock the Olas network
        </SectionHeading>
        <Button href='#get-olas'>Get OLAS</Button>
      </div>
      <div className='lg:mt-0 lg:col-span-6 lg:flex'>
        <Image src='/images/olas-token-page/hero.png' alt='hero' width={500} height={500} className='mx-auto' />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
