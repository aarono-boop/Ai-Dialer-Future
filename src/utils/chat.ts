import { nextTick } from 'vue'
import { announceToScreenReader } from './focus'

export interface Message {
  type: 'ai' | 'user' | 'separator'
  content: string[]
  contactName?: string
}

export const createChatUtils = (
  messages: any,
  chatMessages: any,
  headerRef: any
) => {
  const scrollToBottom = async (): Promise<void> => {
    await nextTick()
    // Wait for DOM updates and then scroll multiple times to ensure it works
    setTimeout(() => {
      if (chatMessages.value) {
        // First scroll immediately
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight

        // Then scroll smoothly after a short delay
        setTimeout(() => {
          if (chatMessages.value) {
            chatMessages.value.scrollTo({
              top: chatMessages.value.scrollHeight,
              behavior: 'smooth'
            })
          }
        }, 100)
      }
    }, 50)
  }

  const scrollToUserMessage = async (): Promise<void> => {
    await nextTick()
    setTimeout(() => {
      if (chatMessages.value) {
        // Find the last user message element
        const userMessages = chatMessages.value.querySelectorAll('[data-message-type="user"]')
        if (userMessages.length > 0) {
          const lastUserMessage = userMessages[userMessages.length - 1]

          // Get the position of the user message relative to the scrollable container
          const messageOffsetTop = lastUserMessage.offsetTop

          // Position the user message at the absolute top edge with minimal padding
          // Use only 2px buffer to ensure it's not cut off but is as high as possible
          const targetScrollTop = Math.max(0, messageOffsetTop - 2)

          // Scroll to position the user message at the highest visible point
          chatMessages.value.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          })
        } else {
          // Fallback to bottom scroll if no user message found
          scrollToBottom()
        }
      }
    }, 50)
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

    // Establish focus context after new message appears
    nextTick(() => {
      setTimeout(() => {
        if (headerRef.value?.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
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

  return {
    scrollToBottom,
    scrollToUserMessage,
    addAIMessage,
    addAIMessageWithoutScroll,
    addUserMessage,
    addSeparatorMessage,
    addAIMessageWithDelay
  }
}
