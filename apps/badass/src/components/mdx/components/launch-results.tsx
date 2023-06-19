export type LaunchResultsProps = {
  firstDay: number
  firstWeek: number
  firstFourMonths: number
}

export const LaunchResults: React.FC<LaunchResultsProps> = ({
  firstDay,
  firstWeek,
  firstFourMonths,
}) => {
  return (
    <div data-launch-results="" className="not-prose">
      {/* <p className="font-condensed">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam, enim.
        Numquam eum voluptates cupiditate aspernatur praesentium nostrum minima
        facilis animi a nisi nobis deleniti doloribus nihil unde, officia sunt.
        Provident.
      </p> */}
      <div data-launch-results-item="day">
        <div data-launch-results-item-value="">{firstDay}</div>
        <h4 data-launch-results-item-title="">first day</h4>
      </div>
      <div data-launch-results-item="week">
        <div data-launch-results-item-value="">{firstWeek}</div>
        <h4 data-launch-results-item-title="">first week</h4>
      </div>
      <div data-launch-results-item="months">
        <div data-launch-results-item-value="">{firstFourMonths}</div>
        <h4 data-launch-results-item-title="">first four months</h4>
      </div>
    </div>
  )
}

export default LaunchResults
