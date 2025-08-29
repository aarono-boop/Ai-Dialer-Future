/**
 * Design tokens for DSInput wrapper component
 * These tokens define styling for the wrapper, label, help text, and error message elements
 */

export const inputWrapperTokens = {
  wrapper: {
    width: '100%'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: 'var(--p-text-muted-color)'
  },
  required: {
    marginLeft: '0.25rem',
    color: 'var(--p-red-400)'
  },
  help: {
    display: 'block',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    color: 'var(--p-text-muted-color)'
  },
  error: {
    display: 'block',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    color: 'var(--p-red-400)'
  }
}

export default inputWrapperTokens
