import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { range } from 'lodash-es'

import { voters } from './election-parameters'

export function VoterList(): JSX.Element {
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Name', 'Mailing Address', 'Email Address'].map((text: string, index: number) => (
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
                {range(2).map((col) => (
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

      <div style={{ height: 55, marginTop: 13, position: 'relative', right: '14%' }}>
        <img src="./protocol/pre-a-arrow.png" style={{ position: 'absolute', right: '0%', width: 20 }} />
        <p style={{ color: '#4154af', fontWeight: 'bold', position: 'absolute', right: '0%', top: 22 }}>New</p>
      </div>
    </>
  )
}
