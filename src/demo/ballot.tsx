import { FormControlLabel, Paper, Radio, RadioGroup } from '@material-ui/core'

export default function VoterList(): JSX.Element {
  return (
    <Paper elevation={3} style={{ marginBottom: 30, padding: '0.5rem 1.5rem' }}>
      <p style={{ backgroundColor: '#e6eafb', fontWeight: 'bold', marginBottom: 10, padding: '5px 13px' }}>
        Who should become the next Mayor of San Francisco?
      </p>
      <RadioGroup style={{ paddingLeft: '1.5rem' }} value="">
        {['Angela Alioto', 'London Breed', 'Mark Leno', 'Jane Kim'].map((name) => (
          <FormControlLabel control={<Radio color="primary" />} key={name} label={name} value={name} />
        ))}
      </RadioGroup>
    </Paper>
  )
}
