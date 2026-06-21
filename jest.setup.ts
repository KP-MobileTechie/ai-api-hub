import '@testing-library/jest-dom'

// Reset the URL between tests. Components that sync view state to the URL
// (e.g. ApiGrid) write to the shared jsdom location via history.replaceState,
// which would otherwise leak across test cases.
beforeEach(() => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/')
  }
})
