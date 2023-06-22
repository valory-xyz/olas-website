import Image from 'next/image'
import { Inter } from 'next/font/google'
import Header from '@/components/Layout/Header'
import Hero from '@/components/HomepageSection/Hero'
import ForDAOs from '@/components/HomepageSection/ForDAOs'
import ForDevs from '@/components/HomepageSection/ForDevs'
import Flywheel from '@/components/HomepageSection/Flywheel'
import OlasUtility from '@/components/HomepageSection/OlasUtility'
import Framework from '@/components/HomepageSection/Framework'
import Services from '@/components/HomepageSection/Services'
import AppShowcase from '@/components/HomepageSection/AppShowcase'
import Footer from '@/components/Layout/Footer'
import Content from '@/components/HomepageSection/Content'
import Friends from '@/components/HomepageSection/Friends'
import PageWrapper from '@/components/Layout/PageWrapper'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      <ForDAOs />
      <ForDevs />
      <Flywheel />
      <OlasUtility />
      <Framework />
      <Services />
      <AppShowcase />
      <Content />
      <Friends />
    </PageWrapper>
  )
}
