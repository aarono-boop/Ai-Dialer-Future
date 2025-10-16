export default {
    root: {
        background: "{overlay.modal.background}",
        borderColor: "{overlay.modal.border.color}",
        color: "{overlay.modal.color}",
        borderRadius: "{overlay.modal.border.radius}",
        shadow: "{overlay.modal.shadow}"
    },
    header: {
        padding: "{overlay.modal.padding}",
        gap: "0.5rem"
    },
    title: {
        fontSize: "1.25rem",
        fontWeight: "600",
        color: "{overlay.modal.color}"
    },
    content: {
        padding: "0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}",
        color: "{overlay.modal.color}",
        fontSize: "1rem",
        lineHeight: "1.625"
    },
    footer: {
        padding: "0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}",
        gap: "0.75rem",
        display: "flex",
        justifyContent: "flex-end"
    }
} as any;
