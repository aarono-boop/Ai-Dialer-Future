export async function askChatGPT(prompt: string, model: string = 'gpt-4o-mini'): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model })
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Chat error')
  }
  const data = await res.json().catch(() => ({}))
  return data.text || ''
}
