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
    console.log('🔥 SCROLL TO USER MESSAGE FUNCTION CALLED!')
    await nextTick()
    setTimeout(() => {
      console.log('🔥 Inside setTimeout for scrollToUserMessage')
      if (chatMessages.value) {
        console.log('🔥 Chat messages container found')
        // Find the last user message element
        const userMessages = chatMessages.value.querySelectorAll('[data-message-type="user"]')
        console.log('🔥 Found user messages:', userMessages.length)

        if (userMessages.length > 0) {
          const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement
          console.log('🔥 Last user message element:', lastUserMessage)

          // Calculate the position of the user message within the scrollable container
          const messageOffsetTop = lastUserMessage.offsetTop
          console.log('🔥 User message offset top:', messageOffsetTop)
          console.log('🔥 Current scroll position:', chatMessages.value.scrollTop)

          // Scroll to position the user message with space above it
          const scrollPosition = Math.max(0, messageOffsetTop - 50)
          console.log('🔥 Scrolling to position (with -50px offset):', scrollPosition)
          chatMessages.value.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          })
        } else {
          console.log('🔥 No user messages found, falling back to bottom scroll')
          scrollToBottom()
        }
      } else {
        console.log('🔥 No chat messages container found!')
      }
    }, 100)
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

    // After AI message is added, re-position the user message at the top
    nextTick(() => {
      setTimeout(() => {
        console.log('🔥 AI message added, now re-positioning user message')
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
