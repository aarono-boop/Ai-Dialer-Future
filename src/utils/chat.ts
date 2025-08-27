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

          // Get the position of the user message relative to the container
          const containerRect = chatMessages.value.getBoundingClientRect()
          const messageRect = lastUserMessage.getBoundingClientRect()
          const currentScrollTop = chatMessages.value.scrollTop

          // Calculate the scroll position to put the user message at the top of the viewport
          const targetScrollTop = currentScrollTop + (messageRect.top - containerRect.top)

          // Scroll to position the user message at the top
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

  const addSeparatorMessage = (contactName: string): void => {
    messages.value.push({
      type: 'separator',
      content: [],
      contactName: contactName
    })
    scrollToBottom()
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
    addAIMessage,
    addUserMessage,
    addSeparatorMessage,
    addAIMessageWithDelay
  }
}
