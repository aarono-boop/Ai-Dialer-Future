export const createContactPreviewHTML = (): string => {
  return `
    <div style="color: #ffffff;">
      <div>
        <h3 style="font-weight: bold; font-size: 1.2em;">Sarah Johnson</h3>
        <p>Sales Development Representative</p>
        <p>TechCorp Inc.</p>
      </div>
      <br>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Home Phone:</td><td style="padding: 4px 0;">(555) 123-4567</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Connect Score:</td><td style="padding: 4px 0;">High</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Mobile Phone:</td><td style="padding: 4px 0;">(555) 123-4568</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Connect Score:</td><td style="padding: 4px 0;">Medium</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Email:</td><td style="padding: 4px 0;">sarah.johnson@techcorp.com</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Address:</td><td style="padding: 4px 0;">1234 Main St, Dallas, TX</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Local Time:</td><td style="padding: 4px 0;">2:45 PM CST</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Website:</td><td style="padding: 4px 0;">techcorp.com</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">LinkedIn Profile:</td><td style="padding: 4px 0;">linkedin.com/in/sarahjohnson</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Industry:</td><td style="padding: 4px 0;">Technology</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Company Size:</td><td style="padding: 4px 0;">250-500 employees</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Lead Source:</td><td style="padding: 4px 0;">Webinar Registration</td></tr>
      </table>
    </div>
  `
}

export const showContactPreview = (
  addAIMessage: (content: string | string[]) => void,
  setShowContactPreviewButtons: (show: boolean) => void,
  scrollToBottom: () => void
): void => {
  const sampleContacts = createContactPreviewHTML()
  
  addAIMessage([
    'Perfect! I\'ve analyzed your <strong style="color: #fbbf24;">156 contacts</strong>.<br><br>Here\'s a preview of your data. Does this look correct?<br><br>',
    sampleContacts
  ])
  
  setShowContactPreviewButtons(true)
  scrollToBottom()
}
