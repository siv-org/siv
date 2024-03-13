import { Tooltip as MUITooltip, TooltipProps } from '@mui/material'
import withStyles from '@mui/styles/withStyles';

const LightTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#fffe',
    boxShadow: '0px 1px 3px #0006',
    color: '#222',
    padding: '5px 10px',
  },
}))(MUITooltip)

export const Tooltip = (props: TooltipProps) => {
  return <LightTooltip {...props} />
}
