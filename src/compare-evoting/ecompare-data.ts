type Row = [string, (0 | 1)[]]

// Columns: Email, OmniBallot, Voatz, SIV
// [name, does_column_meet[]]
export const tableData: Row[] = [
  ['Can print received votes onto standard ballots', [0, 1, 1, 1]],
  ['Voters can verify their vote was received correctly', [0, 0, 1, 1]],
  ['Protects against malware on device', [0, 0, 0, 1]],
  ['Strong privacy against anyone, including admins, from seeing individual votes', [0, 0, 0, 1]],
  ['Individual votes can be remediated to correct errors', [1, 1, 0, 1]],
  ['Does not require voters to install any new software', [1, 1, 0, 1]],
  ['Supports providing drawn signatures, like Vote by Mail', [0, 0, 0, 1]],
]
