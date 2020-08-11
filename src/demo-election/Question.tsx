import { FormControlLabel, NoSsr, Paper, Radio, RadioGroup, TextField } from '@material-ui/core'

const ballot = {
  allow_write_in: true,
  choices: ['Chocolate', 'Cookie Dough', 'Mint', 'Strawberry', 'Vanilla'],
  question: 'What is the best flavor of ice cream?',
}

export const Question = (): JSX.Element => {
  return (
    <NoSsr>
      <Paper elevation={3} style={{ marginBottom: 30, padding: '0.5rem 1.5rem' }}>
        <p
          style={{
            backgroundColor: '#e6eafb',
            fontWeight: 'bold',
            marginBottom: 10,
            padding: '5px 13px',
          }}
        >
          {ballot.question}
        </p>
        <RadioGroup style={{ paddingLeft: '1.5rem' }}>
          {ballot.choices.map((name) => (
            <FormControlLabel control={<Radio color="primary" />} key={name} label={name} value={name} />
          ))}
          <FormControlLabel
            control={<Radio color="primary" />}
            label={<TextField id="other" label="Other" size="small" variant="outlined" />}
            style={{ marginTop: 5 }}
            value={'other'}
          />
        </RadioGroup>
      </Paper>
    </NoSsr>
  )
}
