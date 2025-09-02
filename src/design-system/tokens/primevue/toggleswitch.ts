export default {
  root: {
    width: '3rem',
    height: '1.75rem',
    borderRadius: '30px',
    gap: '0px',
    shadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.03)',
    focusRing: {
      width: '1px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none'
    },
    borderWidth: '1px',
    borderColor: '{form.field.border.color}',
    hoverBorderColor: '{form.field.hover.border.color}',
    checkedBorderColor: '{primary.color}',
    checkedHoverBorderColor: '{primary.hover.color}',
    invalidBorderColor: '{form.field.invalid.border.color}',
    backgroundColor: '{form.field.background}',
    hoverBackgroundColor: '{form.field.hover.background}',
    checkedBackgroundColor: '{primary.color}',
    checkedHoverBackgroundColor: '{primary.hover.color}',
    invalidBackgroundColor: '{form.field.invalid.background}',
    transitionDuration: '{transition.duration}'
  },
  handle: {
    borderRadius: '50%',
    size: '1.5rem',
    backgroundColor: '{form.field.border.color}',
    hoverBackgroundColor: '{form.field.border.color}',
    checkedBackgroundColor: '{primary.contrast.color}',
    checkedHoverBackgroundColor: '{primary.contrast.color}',
    invalidBackgroundColor: '{form.field.invalid.border.color}',
    transitionDuration: '{transition.duration}'
  }
}
