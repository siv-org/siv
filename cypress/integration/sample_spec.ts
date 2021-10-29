describe('Our first test', () => {
  it('ought to pass', () => {
    expect(true).to.equal(true)
  })

  it('better not pass', () => {
    expect(true).to.equal(false)
  })
})
