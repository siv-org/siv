import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { BudgetItem } from './BudgetItem'

test('budget amounts display commas without rounding stored decimal digits', () => {
  const html = renderToStaticMarkup(
    <BudgetItem
      budget_available={100000}
      dispatch={() => {}}
      options={[{ name: 'Park' }, { name: 'Library' }]}
      state={{
        encoded: {},
        encrypted: {},
        plaintext: { vote_Library: 'BLANK', vote_Park: '12345.6789' },
        randomizer: {},
      }}
      title="Community budget"
      write_in_allowed={false}
    />,
  )
  expect(html).toContain('value="12,345.6789"')
  expect(html).toContain('value=""')
  expect(html).toContain('100,000')
  expect(html).toContain('87,654.321')
})
