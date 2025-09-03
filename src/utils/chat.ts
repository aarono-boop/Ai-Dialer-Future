import { nextTick } from 'vue'
import { announceToScreenReader } from './focus'

export interface Message {
  type: 'ai' | 'user' | 'separator'
  content: string[]
  contactName?: string
  typing?: boolean
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
    console.log('🔥 SCROLL TO USER MESSAGE - Starting')
    await nextTick()

    const performUserScroll = (attempt: number = 0) => {
      console.log(`🔥 SCROLL TO USER MESSAGE - Attempt ${attempt}`)
      if (!chatMessages.value || attempt > 3) {
        console.log('🔥 SCROLL TO USER MESSAGE - Exiting, no container or max attempts')
        return
      }

      // Find the last user message element
      const userMessages = chatMessages.value.querySelectorAll('[data-message-type="user"]')
      console.log(`🔥 SCROLL TO USER MESSAGE - Found ${userMessages.length} user messages`)

      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement
        console.log('🔥 SCROLL TO USER MESSAGE - Last user message:', lastUserMessage)

        // Calculate the position to place the user message at the top of the viewport
        const messageOffsetTop = lastUserMessage.offsetTop
        const containerHeight = chatMessages.value.clientHeight
        const currentScrollTop = chatMessages.value.scrollTop

        console.log(`🔥 SCROLL TO USER MESSAGE - messageOffsetTop: ${messageOffsetTop}, containerHeight: ${containerHeight}, currentScrollTop: ${currentScrollTop}`)

        // Position user message at the very top with minimal offset for better visibility
        const targetPosition = Math.max(0, messageOffsetTop - 20)
        console.log(`🔥 SCROLL TO USER MESSAGE - Setting scroll to: ${targetPosition}`)

        // Use immediate scroll for instant positioning
        chatMessages.value.scrollTop = targetPosition

        // Retry if needed to handle dynamic content
        if (attempt < 2) {
          setTimeout(() => performUserScroll(attempt + 1), 150)
        } else {
          // Final smooth adjustment for better UX
          console.log(`🔥 SCROLL TO USER MESSAGE - Final smooth scroll to: ${targetPosition}`)
          chatMessages.value.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
        }
      } else {
        console.log('🔥 SCROLL TO USER MESSAGE - No user messages found, falling back to bottom scroll')
        // Fallback to bottom scroll if no user messages found
        scrollToBottom()
      }
    }

    // Start with small delay to ensure DOM is updated
    setTimeout(() => performUserScroll(), 100)
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
    console.log('🔥 ADD USER MESSAGE - Called with content:', content)
    messages.value.push({
      type: 'user',
      content: [content]
    })

    console.log('🔥 ADD USER MESSAGE - Message added, calling scrollToUserMessage')
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
    console.log('🔥 ADD AI MESSAGE WITH TYPING NO SCROLL - Called')
    const contentArray = Array.isArray(content) ? content : [content]
    messages.value.push({
      type: 'ai',
      content: contentArray,
      typing: true
    })

    console.log('🔥 ADD AI MESSAGE WITH TYPING NO SCROLL - Message added, preserving scroll position')
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
    addAIMessage,
    addAIMessageWithoutScroll,
    addUserMessage,
    addSeparatorMessage,
    addAIMessageWithDelay,
    addAIMessageWithTyping,
    addAIMessageWithTypingNoScroll
  }
}
