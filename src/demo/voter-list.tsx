import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { range } from 'lodash'

import { voters } from './election-parameters'

export default function VoterList(): JSX.Element {
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Name', 'Date of Birth', 'Mailing Address', 'Email Address'].map((text: string, index: number) => (
                <TableCell
                  align={index === 0 ? 'left' : 'center'}
                  colSpan={index === 1 ? 6 : 1}
                  key={index}
                  style={{ backgroundColor: '#e6eafb', fontSize: 11, fontWeight: 'bold', lineHeight: '15px' }}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {voters.map(({ name }: { name: string }, index: number) => (
              <TableRow key={index}>
                <TableCell colSpan={6} style={{ fontSize: 12 }}>
                  {name}
                </TableCell>
                {range(3).map((col) => (
                  <TableCell align="center" key={col}>
                    ...
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <style global jsx>{`
        .MuiTableCell-sizeSmall {
          padding: 6px 10px !important;
        }
      `}</style>

      <div style={{ height: 25, marginTop: 13, position: 'relative' }}>
        <img src="./overview/pre-a-arrow.png" style={{ position: 'absolute', right: '11%', width: 20 }} />
      </div>
      <p style={{ color: '#4154af', fontWeight: 'bold', textAlign: 'right' }}>New requirement</p>
    </>
  )
}
