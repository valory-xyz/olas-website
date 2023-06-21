import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SectionWrapper from '@/components/SectionWrapper';
import Videos from '../components/Videos'

const VideosPage = () => <>
<Header />
<SectionWrapper backgroundType={"SUBTLE_GRADIENT"}><Videos /></SectionWrapper>
<Footer/>
</>;

export default VideosPage;