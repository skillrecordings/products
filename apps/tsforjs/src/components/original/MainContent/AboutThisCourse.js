import styled from 'styled-components'
import {Colors} from '../../../util/Colors'
import {device} from '../../../util/util'
import {Titles, TitlesTwo} from './CourseTitles'

import {CoursePanel} from './CoursePanel'

const CourseModulesTitle = styled.header`
  font-weight: bold;
  font-size: 28px;
  color: ${Colors.mainPurpleBright};
  margin-bottom: 20px;
`

const GridContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 70%;
  min-width: 900px;
  background-color: ${Colors.offBlack};
  border-radius: 8px;
  padding: 20px 0px;
  overflow: hidden;
  margin-bottom: 100px;
  @media ${device.tablet} {
    flex-direction: column;
    min-width: 450px;
    align-items: center;
  }
`

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const AboutThisCourse = () => {
  const DisplayTitle = (titleList) => {
    return titleList.map((title) => <CoursePanel title={title} />)
  }
  return (
    <>
      <CourseModulesTitle>Course Modules</CourseModulesTitle>
      <GridContainer>
        <MainColumn>{DisplayTitle(Titles)}</MainColumn>
        <MainColumn>
          <MainColumn>{DisplayTitle(TitlesTwo)}</MainColumn>
        </MainColumn>
      </GridContainer>
    </>
  )
}
