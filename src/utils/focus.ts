import { nextTick } from 'vue'

export const clearFocusAndEstablishContext = (
  headerRef: any,
  announceMessage?: string
): void => {
  nextTick(() => {
    // Remove focus from any current element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Establish focus context by mimicking header click
    setTimeout(() => {
      if (headerRef?.value?.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)

    // Announce to screen readers if message provided
    if (announceMessage) {
      announceToScreenReader(announceMessage)
    }
  })
}

export const focusArkonLogo = (): void => {
  setTimeout(() => {
    const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
    if (arkonLogo) {
      arkonLogo.focus()
      arkonLogo.blur()
    }
  }, 50)
}

export const focusChatInput = (
  chatInputRef: any,
  delay: number = 500,
  logMessage?: string
): void => {
  setTimeout(() => {
    if (chatInputRef?.value?.focus) {
      chatInputRef.value.focus()
      if (logMessage) {
        console.log(logMessage)
      }
    } else {
      console.log('Chat input ref not available for auto-focus')
    }
  }, delay)
}

export const announceToScreenReader = (message: string): void => {
  const announcer = document.getElementById('sr-announcements')
  if (announcer) {
    announcer.textContent = message
    // Clear after announcement to allow repeat announcements
    setTimeout(() => {
      if (announcer) {
        announcer.textContent = ''
      }
    }, 1000)
  }
}
