import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import faker from 'faker/locale/en_US'
import { range } from 'lodash'

export default function VoterList(): JSX.Element {
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>{['Name', 'Date of Birth', 'Mailing Address', 'Email Address'].map(HeaderCell)}</TableRow>
          </TableHead>
          <TableBody>{range(5).map(randomPersonRow)}</TableBody>
        </Table>
      </TableContainer>
      <br />
    </>
  )
}

function HeaderCell(text: string, index: number) {
  return (
    <TableCell
      align={index === 0 ? 'left' : 'center'}
      colSpan={index === 1 ? 6 : 1}
      key={text}
      style={{ backgroundColor: '#E6EAFB', fontSize: 11, fontWeight: 'bold', lineHeight: '15px' }}
    >
      {text}
    </TableCell>
  )
}

function randomPersonRow(row: number) {
  return (
    <TableRow key={row}>
      {/* <TableCell style={{ fontSize: 12 }}>{row + 1}</TableCell> */}
      <TableCell colSpan={6} style={{ fontSize: 12 }}>
        {faker.name.firstName()} {faker.name.lastName()}
      </TableCell>
      {range(3).map((col) => (
        <TableCell align="center" key={col}>
          ...
        </TableCell>
      ))}
    </TableRow>
  )
}
