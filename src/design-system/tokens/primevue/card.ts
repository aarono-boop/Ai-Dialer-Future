export default {
  root: {
    background: "{content.background}",
    borderColor: "{content.border.color}",
    color: "{content.color}",
    borderRadius: "{form.field.border.radius}"
  },
  body: {
    padding: "1.25rem",
    gap: "0.5rem"
  },
  header: {
    padding: "{form.field.padding.y} {form.field.padding.x}",
    gap: "0.5rem"
  },
  title: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "{content.color}"
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "{text.muted.color}"
  },
  content: {
    padding: "0 {form.field.padding.x} {form.field.padding.y} {form.field.padding.x}",
    color: "{content.color}",
    fontSize: "0.9375rem",
    lineHeight: "1.5"
  },
  footer: {
    padding: "0 {form.field.padding.x} {form.field.padding.y} {form.field.padding.x}",
    gap: "0.75rem",
    display: "flex",
    justifyContent: "flex-end"
  }
}
