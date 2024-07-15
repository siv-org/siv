type Section = [Section_Title, Feature[]]
type Feature = [Code, Description]
type Section_Title = string
type Code = string
type Description = string

const advancedFeatures: Section[] = [
  [
    'Per question',
    [
      ['"description": "your description here"', 'More info below the question title, in smaller font.'],
      [
        '"randomize_order": true',
        'To improve fairness, randomize the displayed order of all options, unique per voter.',
      ],
    ],
  ],
  [
    'Per option',
    [
      [
        '"sub": "your sub-text here"',
        'Add extra info below an option, such as their Party Affiliation or a longer description.',
      ],
    ],
  ],
]

export const AdvancedFeatures = () => {
  return (
    <div className="px-4 text-xs">
      <h3>
        Advanced Features <span className="opacity-50">(not in Wizard)</span>
      </h3>

      {advancedFeatures.map(([title, items]) => (
        <>
          <div>{title}</div>
          <ul className="space-y-2">
            {items.map(([code, description]) => (
              <li key={code}>
                <code className="p-1 rounded bg-orange-100/70">{code}</code> - {description}
              </li>
            ))}
          </ul>
        </>
      ))}
    </div>
  )
}
