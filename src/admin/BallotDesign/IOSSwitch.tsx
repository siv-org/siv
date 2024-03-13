import { Theme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import Switch, { SwitchClassKey, SwitchProps } from '@mui/material/Switch'

const height = 22

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string
}

export const IOSSwitch = withStyles((theme: Theme) => ({
  checked: {},
  focusVisible: {},
  root: {
    height,
    margin: 5,
    padding: 0,
    width: height * 2 - 6,
  },
  switchBase: {
    '&$checked': {
      '& + $track': {
        backgroundColor: '#009319',
        border: 'none',
        opacity: 1,
      },
      color: theme.palette.common.white,
      transform: 'translateX(16px)',
    },
    '&$focusVisible $thumb': {
      border: '6px solid #fff',
      color: '#009319',
    },
    padding: 1,
  },
  thumb: {
    height: height - 2,
    width: height - 2,
  },
  track: {
    backgroundColor: theme.palette.grey[50],
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 26 / 2,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
}))(({ classes, ...props }: { classes: Styles } & SwitchProps) => {
  return (
    <Switch
      disableRipple
      classes={{
        checked: classes.checked,
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
      }}
      focusVisibleClassName={classes.focusVisible}
      {...props}
    />
  )
})
