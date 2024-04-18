import Articles from "components/Content/Articles"
import Videos from "components/Content/Videos"
import SectionWrapper from "components/Layout/SectionWrapper"

const Media = () => {
    return <SectionWrapper backgroundType="SUBTLE_GRADIENT">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-10">
            <Videos limit={3}/>
            <Articles limit={3} tagFilter="bonds" showSeeAll={true}/>
        </div>
    </SectionWrapper>
}

export default Media