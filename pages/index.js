import Image from 'next/image'
import { Inter, Manrope } from 'next/font/google'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ForDAOs from '@/components/ForDAOs'
import ForDevs from '@/components/ForDevs'
import Flywheel from '@/components/Flywheel'
import OlasUtility from '@/components/OlasUtility'
import Framework from '@/components/Framework'
import Services from '@/components/Services'
import Footer from '@/components/Footer'
import Resources from '@/components/Resources'
import Friends from '@/components/Friends'

const inter = Inter({ subsets: ['latin'] })
const manrope = Manrope({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <ForDAOs />
      <ForDevs />
      <Flywheel />
      <OlasUtility />
      <Framework />
      <Services />
      <Resources />
      <Friends />
      <Footer />
    </>
  )
}
