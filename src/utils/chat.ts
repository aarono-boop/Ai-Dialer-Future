import { nextTick } from 'vue'
import { announceToScreenReader } from './focus'

export interface Message {
  type: 'ai' | 'user' | 'separator'
  content: string[]
  contactName?: string
  typing?: boolean
  preserveUserPosition?: boolean
}

export const createChatUtils = (
  messages: any,
  chatMessages: any,
  headerRef: any
) => {
  const scrollToBottom = async (): Promise<void> => {
    await nextTick()

    // Enhanced scroll function with multiple attempts to handle dynamic content
    const performScroll = (attempt: number = 0) => {
      if (!chatMessages.value || attempt > 3) return

      const maxScrollTop = chatMessages.value.scrollHeight - chatMessages.value.clientHeight

      // Immediate scroll to bottom
      chatMessages.value.scrollTop = maxScrollTop

      // Check if we need to try again (content might still be loading)
      if (attempt < 2) {
        setTimeout(() => performScroll(attempt + 1), 100)
      } else {
        // Final smooth scroll for better UX
        chatMessages.value.scrollTo({
          top: maxScrollTop,
          behavior: 'smooth'
        })
      }
    }

    // Start with small delay to ensure DOM is updated
    setTimeout(() => performScroll(), 50)
  }

  const scrollToBottomDuringTyping = (): void => {
    // Optimized version for frequent calls during typing animation
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  }

  const scrollToUserMessage = async (): Promise<void> => {
    await nextTick()

    const performUserScroll = (attempt: number = 0) => {
      if (!chatMessages.value || attempt > 3) return

      // Find the last user message element
      const userMessages = chatMessages.value.querySelectorAll('[data-message-type="user"]')

      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement

        // Calculate the position to place the user message at the top of the viewport
        const messageOffsetTop = lastUserMessage.offsetTop

        // Position user message near the top with adequate padding for full visibility
        const targetPosition = Math.max(0, messageOffsetTop - 50)

        // Use immediate scroll for instant positioning
        chatMessages.value.scrollTop = targetPosition

        // Retry if needed to handle dynamic content
        if (attempt < 2) {
          setTimeout(() => performUserScroll(attempt + 1), 150)
        } else {
          // Final smooth adjustment for better UX
          chatMessages.value.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
        }
      } else {
        // Fallback to bottom scroll if no user messages found
        scrollToBottom()
      }
    }

    // Start with small delay to ensure DOM is updated
    setTimeout(() => performUserScroll(), 100)
  }

  const scrollToTopForGoals = async (): Promise<void> => {
    await nextTick()

    // Use multiple attempts with longer delays to ensure it works
    const forceScrollToGoal = (attempt: number = 0) => {
      if (!chatMessages.value || attempt > 5) return

      const userMessages = chatMessages.value.querySelectorAll('[data-message-type="user"]')

      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement
        const messageOffsetTop = lastUserMessage.offsetTop

        // Force scroll to show user message at top with adequate padding for full visibility
        const targetPosition = Math.max(0, messageOffsetTop - 50)

        // Force immediate scroll
        chatMessages.value.scrollTop = targetPosition

        // Continue trying to maintain position
        setTimeout(() => forceScrollToGoal(attempt + 1), 200)
      }
    }

    setTimeout(() => forceScrollToGoal(), 50)
  }

  const scrollToTopForQueuePaused = async (): Promise<void> => {
    await nextTick()

    // Use multiple attempts with longer delays to ensure it works
    const forceScrollToQueuePaused = (attempt: number = 0) => {
      if (!chatMessages.value || attempt > 5) return

      const userMessages = chatMessages.value.querySelectorAll('[data-message-type="user"]')

      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement
        const messageOffsetTop = lastUserMessage.offsetTop

        // Force scroll to show user message with more padding for Queue Paused
        const targetPosition = Math.max(0, messageOffsetTop - 200)

        // Force immediate scroll
        chatMessages.value.scrollTop = targetPosition

        // Continue trying to maintain position
        setTimeout(() => forceScrollToQueuePaused(attempt + 1), 200)
      }
    }

    setTimeout(() => forceScrollToQueuePaused(), 50)
  }

  const addAIMessage = (content: string | string[]): void => {
    const contentArray = Array.isArray(content) ? content : [content]
    messages.value.push({
      type: 'ai',
      content: contentArray
    })
    scrollToBottom()

    // Establish focus context after new message appears
    nextTick(() => {
      setTimeout(() => {
        if (headerRef.value?.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
    })
  }

  const addUserMessage = (content: string): void => {
    messages.value.push({
      type: 'user',
      content: [content]
    })

    // Use scrollToUserMessage for better positioning after user messages
    scrollToUserMessage()

    // Establish focus context after new message appears
    nextTick(() => {
      setTimeout(() => {
        if (headerRef.value?.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
    })
  }

  const addUserGoalMessage = (content: string): void => {
    messages.value.push({
      type: 'user',
      content: [content]
    })

    // Use the special goal scroll function for goal selections
    scrollToTopForGoals()

    // Establish focus context after new message appears
    nextTick(() => {
      setTimeout(() => {
        if (headerRef.value?.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
    })
  }

  const addUserQueuePausedMessage = (content: string): void => {
    messages.value.push({
      type: 'user',
      content: [content]
    })

    // Use the special queue paused scroll function with more padding
    scrollToTopForQueuePaused()

    // Establish focus context after new message appears
    nextTick(() => {
      setTimeout(() => {
        if (headerRef.value?.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
    })
  }

  const addSeparatorMessage = (contactName: string): void => {
    messages.value.push({
      type: 'separator',
      content: [],
      contactName: contactName
    })
    scrollToBottom()
  }

  const addAIMessageWithoutScroll = (content: string | string[]): void => {
    const contentArray = Array.isArray(content) ? content : [content]
    messages.value.push({
      type: 'ai',
      content: contentArray
    })
    // Don't scroll - preserve current position

    // After AI message is added, re-position the user message at the top
    nextTick(() => {
      setTimeout(() => {
        scrollToUserMessage()

        if (headerRef.value?.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 200) // Small delay to ensure DOM is updated
    })
  }

  const addAIMessageWithDelay = (
    content: string | string[],
    delay: number = 1000,
    callback?: () => void
  ): void => {
    setTimeout(() => {
      addAIMessage(content)
      callback?.()
    }, delay)
  }

  const addAIMessageWithTyping = (content: string | string[]): void => {
    const contentArray = Array.isArray(content) ? content : [content]
    messages.value.push({
      type: 'ai',
      content: contentArray,
      typing: true
    })

    // Initial scroll to position the new message
    nextTick(() => {
      scrollToBottom()
    })

    // Establish focus context after new message appears
    nextTick(() => {
      setTimeout(() => {
        if (headerRef.value?.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
    })
  }

  const addAIMessageWithTypingNoScroll = (content: string | string[]): void => {
    const contentArray = Array.isArray(content) ? content : [content]
    messages.value.push({
      type: 'ai',
      content: contentArray,
      typing: true,
      preserveUserPosition: true // Flag to indicate this should preserve user message position
    })

    // Don't scroll - preserve current user message position
    // Establish focus context after new message appears
    nextTick(() => {
      setTimeout(() => {
        if (headerRef.value?.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
    })
  }

  return {
    scrollToBottom,
    scrollToBottomDuringTyping,
    scrollToUserMessage,
    scrollToTopForGoals,
    addAIMessage,
    addAIMessageWithoutScroll,
    addUserMessage,
    addUserGoalMessage,
    addSeparatorMessage,
    addAIMessageWithDelay,
    addAIMessageWithTyping,
    addAIMessageWithTypingNoScroll
  }
}
