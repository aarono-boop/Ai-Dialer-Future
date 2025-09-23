export default {
  root: {
    borderRadius: '9999px',
    paddingX: '0.5rem',
    paddingY: '0.25rem',
    fontWeight: '600',
    gap: '0.25rem'
  },
  colorScheme: {
    light: {
      root: {
        background: '{surface.600}',
        color: '{surface.0}'
      },
      info: {
        background: '{sky.500}',
        color: '{sky.0}'
      },
      success: {
        background: '{green.500}',
        color: '{green.0}'
      },
      warning: {
        background: '{orange.500}',
        color: '{orange.0}'
      },
      danger: {
        background: '{red.500}',
        color: '{red.0}'
      }
    },
    dark: {
      root: {
        background: '{surface.500}',
        color: '{surface.0}'
      },
      info: {
        background: '{sky.400}',
        color: '{sky.950}'
      },
      success: {
        background: '{green.400}',
        color: '{green.950}'
      },
      warning: {
        background: '{orange.400}',
        color: '{orange.950}'
      },
      danger: {
        background: '{red.500}',
        color: '{red.0}'
      }
    }
  }
}
