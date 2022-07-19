import styled from 'styled-components'
import {Colors} from '../../../util/Colors'

const lineHeight = '40px'

export const CourseModulesTitle = styled.header`
  font-weight: bold;
  font-size: 28px;
  color: ${Colors.mainPurpleBright};
  margin-bottom: 20px;
`

export const GridContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 70%;
  background-color: ${Colors.offBlack};
  border-radius: 8px;
  padding: 20px 0px;
  margin-bottom: 100px;
`

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  width: 400px;
`
export const ColNumber = styled.div`
  color: ${Colors.mainPurpleBright};
  font-weight: bold;
  font-size: 20px;
  height: 40px;
  line-height: ${lineHeight};
  margin-right: 18px;
`
export const Col = styled.div`
  line-height: ${lineHeight};
  height: 40px;
  flex-wrap: wrap;
`

export const NumberContainer = styled.span`
  display: flex;
  align-items: center;
  height: 100%;
`

export const Chevron = styled.img`
  height: 8px;
  width: 12px;
  cursor: pointer;
`

export const ChevronContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`

export const AccordionPanel = styled.ul`
  padding-left: 28px;
  width: 400px;
`
