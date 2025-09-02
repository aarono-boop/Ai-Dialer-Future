export const AI_RESPONSES = {
  // General responses
  DEFAULT: 'I can help you find specific contacts, start calling sessions, or analyze your data. What would you like to do?',
  
  // ARKON Information
  ABOUT_ARKON: [
    '🚀 ARKON is PhoneBurner\'s revolutionary AI-powered dialer!',
    'It uses advanced algorithms to predict the best times to call prospects, automatically prioritizes your contact list, and helps you connect with more people in less time.',
    'Key features include smart scheduling, real-time connect predictions, and personalized calling strategies.',
    'What specific aspect of ARKON would you like to know more about?'
  ],

  // Calling assistance
  GET_CONNECTED: [
    '📈 Great question! Here are ARKON\'s proven strategies to boost your connect rates:',
    '• <strong>Smart Timing:</strong> Calls prospects when they\'re most likely to answer',
    '• <strong>Local Presence:</strong> Uses local numbers to increase pickup rates',
    '• <strong>Voicemail Drop:</strong> Leaves personalized messages when they don\'t answer',
    '• <strong>Follow-up Sequences:</strong> Automatically schedules optimal callback times',
    'On average, users see a 40% increase in connect rates within their first week!'
  ],

  // Demo requests
  DEMO_REQUEST: [
    '✨ I\'d love to show you ARKON in action!',
    'Let me set up a personalized demo where you can see:',
    '• Live contact scoring and prioritization',
    '• Real-time dialing with connect predictions',
    '• Smart call disposition and follow-up automation',
    'What\'s your preferred time? I can schedule something for today or tomorrow.'
  ],

  // Contact recommendations
  WHO_TO_CALL: [
    '🎯 Based on your contact data and current time analysis:',
    '<strong>Top 3 prospects to call right now:</strong>',
    '1. Sarah Johnson - 92% connect probability (last spoke 3 days ago)',
    '2. Mike Chen - 89% connect probability (opened your email yesterday)',
    '3. Jennifer Martinez - 84% connect probability (perfect timing window)',
    'Should I dial Sarah first? She\'s showing the highest engagement score today.'
  ],

  // Dial session
  DIAL_SESSION: [
    '🔥 Let\'s fire up a power dialing session!',
    'I can configure your session with:',
    '• <strong>Target audience:</strong> High-priority prospects, warm leads, or follow-ups',
    '• <strong>Call duration:</strong> 30 min, 1 hour, or 2-hour session',
    '• <strong>Connect goals:</strong> Number of conversations you want to have',
    'What type of prospects do you want to focus on for this session?'
  ],

  // Reminders
  REMINDERS: [
    '⏰ I\'ll help you set up smart reminders!',
    'ARKON can remind you to:',
    '• Follow up with specific prospects at optimal times',
    '• Call back prospects who didn\'t answer',
    '• Review and update your call notes',
    '• Start your daily calling sessions',
    'What would you like to be reminded about and when?'
  ],

  // Practice
  PRACTICE: [
    '🎭 Great idea! Call practice makes perfect.',
    'ARKON\'s practice mode can help you:',
    '• Rehearse your opening pitch with AI feedback',
    '• Practice handling common objections',
    '• Test different conversation flows',
    '• Record and review your delivery',
    'Would you like to practice a cold call opening or work on handling objections?'
  ],

  // Schedule
  APPOINTMENTS_TODAY: [
    '📅 Here\'s your schedule for today:',
    '<strong>Upcoming appointments:</strong>',
    '• 2:00 PM - Demo call with Sarah Johnson (confirmed)',
    '• 3:30 PM - Follow-up with ABC Corp (needs confirmation)',
    '• 4:15 PM - Discovery call with new lead Mike Chen',
    'You have 45 minutes before your next call. Perfect time for some prospecting!'
  ],

  // Fun
  JOKE: [
    '😄 Why did the salesperson bring a ladder to work?',
    'Because they heard the job was about making <strong>high-level</strong> connections!',
    '',
    '📈 Speaking of connections, did you know ARKON users make 3x more meaningful connections than traditional dialers?',
    'Ready to elevate your calling game?'
  ],

  // Voice simulation
  VOICE_CAPTURED: 'Voice captured! I heard: "Call my highest priority contacts"',

  // Call script for connected calls
  CALL_SCRIPT: [
    '🎯 <strong>Great! You\'re connected!</strong>',
    '',
    '📞 <strong>Here\'s your personalized script for this conversation:</strong>',
    '',
    '• <strong>Opening:</strong> "Hi {{ contact_name }}, this is {{ your_name }} from {{ your_company }}. I hope I\'m catching you at a good time..."',
    '',
    '• <strong>Value Proposition:</strong> "I\'m reaching out because we help {{ industry }} companies like {{ contact_company }} {{ value_statement }}"',
    '',
    '• <strong>Discovery Questions:</strong>',
    '  - "What\'s your biggest challenge with {{ pain_point }}?"',
    '  - "How are you currently handling {{ process }}?"',
    '  - "What would be most valuable to improve in your {{ department }}?"',
    '',
    '• <strong>Next Steps:</strong> "Based on what you\'ve shared, I\'d love to show you exactly how we could help. Would you be open to a quick 15-minute demo this week?"',
    '',
    '💡 <strong>Remember:</strong> Listen actively, take notes, and focus on their needs rather than your pitch!'
  ]
}

export const getResponseForKeywords = (message: string): string | string[] => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('anything about arkon')) {
    return AI_RESPONSES.ABOUT_ARKON
  } else if (lowerMessage.includes('connected to more calls') || lowerMessage.includes('get connected')) {
    return AI_RESPONSES.GET_CONNECTED
  } else if (lowerMessage.includes('setup a demo') || lowerMessage.includes('demo')) {
    return AI_RESPONSES.DEMO_REQUEST
  } else if (lowerMessage.includes('who i should call now') || lowerMessage.includes('who should i call')) {
    return AI_RESPONSES.WHO_TO_CALL
  } else if (lowerMessage.includes('fire up a dial session') || lowerMessage.includes('dial session')) {
    return AI_RESPONSES.DIAL_SESSION
  } else if (lowerMessage.includes('set a reminder') || lowerMessage.includes('reminder')) {
    return AI_RESPONSES.REMINDERS
  } else if (lowerMessage.includes('practice a call') || lowerMessage.includes('practice')) {
    return AI_RESPONSES.PRACTICE
  } else if (lowerMessage.includes('appointments') && lowerMessage.includes('today')) {
    return AI_RESPONSES.APPOINTMENTS_TODAY
  } else if (lowerMessage.includes('tell a joke') || lowerMessage.includes('joke')) {
    return AI_RESPONSES.JOKE
  } else if (lowerMessage.includes('jenn')) {
    return [
      'Found Jenn! 🎯',
      'I found <strong>Jenn Peterson</strong> in your contacts.',
      'She has an <strong>89% pickup rate</strong> and is most likely available now.',
      'Ready to call Jenn?'
    ]
  } else if (lowerMessage.includes('call') || lowerMessage.includes('start')) {
    return [
      'Perfect! Let\'s start calling. 📞',
      'I\'ll prioritize contacts with the highest pickup probability.',
      'Shall I begin with the top 23 most likely to answer?'
    ]
  }

  return AI_RESPONSES.DEFAULT
}
