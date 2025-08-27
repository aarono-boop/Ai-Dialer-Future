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
        console.log('Found user messages:', userMessages.length)

        if (userMessages.length > 0) {
          const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement
          console.log('Last user message element:', lastUserMessage)

          // Get the message position relative to its offset parent
          const messageRect = lastUserMessage.getBoundingClientRect()
          const containerRect = chatMessages.value.getBoundingClientRect()

          // Calculate how much to scroll to put the message at the top
          const scrollOffset = messageRect.top - containerRect.top + chatMessages.value.scrollTop

          console.log('Message rect top:', messageRect.top)
          console.log('Container rect top:', containerRect.top)
          console.log('Current scroll top:', chatMessages.value.scrollTop)
          console.log('Calculated scroll offset:', scrollOffset)

          // Scroll to position the message at the absolute top (no buffer)
          chatMessages.value.scrollTo({
            top: Math.max(0, scrollOffset),
            behavior: 'smooth'
          })
        } else {
          console.log('No user messages found, falling back to bottom scroll')
          // Fallback to bottom scroll if no user message found
          scrollToBottom()
        }
      }
    }, 100) // Increased delay to ensure DOM is ready
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
