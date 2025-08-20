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
