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
      <div data-launch-results-item="day">
        <div data-launch-results-item-value="">
          {new Intl.NumberFormat('en-IN').format(firstDay)}
        </div>
        <h4 data-launch-results-item-title="">first day</h4>
      </div>
      <div data-launch-results-item="week">
        <div data-launch-results-item-value="">
          {new Intl.NumberFormat('en-IN').format(firstWeek)}
        </div>
        <h4 data-launch-results-item-title="">first week</h4>
      </div>
      <div data-launch-results-item="months">
        <div data-launch-results-item-value="">
          {new Intl.NumberFormat('en-IN').format(firstFourMonths)}
        </div>
        <h4 data-launch-results-item-title="">first four months</h4>
      </div>
    </div>
  )
}

export default LaunchResults
