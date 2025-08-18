const addSessionSummaryToChat = (): void => {
  // Create session summary content as HTML
  const summaryHTML = `
    <div style="background-color: rgb(31, 41, 55); border-radius: 12px; padding: 24px; margin: 12px 0;">
      <h2 style="color: white; font-size: 24px; font-weight: 600; margin-bottom: 24px;">Queue Paused!</h2>

      <!-- Statistics Grid - 6 cards in 2 rows -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px; text-align: center;">
          <div style="color: white; font-size: 14px; margin-bottom: 8px;">👥</div>
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 4px;">\${contacts.length - currentContactIndex.value - 1}</div>
          <div style="color: rgb(156, 163, 175); font-size: 12px;">Contacts Left to Call</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px; text-align: center;">
          <div style="color: white; font-size: 14px; margin-bottom: 8px;">👥</div>
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 4px;">\${currentContactIndex.value + 1}</div>
          <div style="color: rgb(156, 163, 175); font-size: 12px;">Contacts Dialed</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px; text-align: center;">
          <div style="color: white; font-size: 14px; margin-bottom: 8px;">⏰</div>
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 4px;">\${queueTime.value}s</div>
          <div style="color: rgb(156, 163, 175); font-size: 12px;">Queue Duration</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px; text-align: center;">
          <div style="color: white; font-size: 14px; margin-bottom: 8px;">📞</div>
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 4px;">\${totalCalls.value}</div>
          <div style="color: rgb(156, 163, 175); font-size: 12px;">Total Calls Made</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px; text-align: center;">
          <div style="color: white; font-size: 14px; margin-bottom: 8px;">💬</div>
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 4px;">\${connectedCalls.value}</div>
          <div style="color: rgb(156, 163, 175); font-size: 12px;">Connected Calls</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px; text-align: center;">
          <div style="color: white; font-size: 14px; margin-bottom: 8px;">⏭️</div>
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 4px;">\${skippedNumbers.value}</div>
          <div style="color: rgb(156, 163, 175); font-size: 12px;">Skipped Numbers</div>
        </div>
      </div>

      <!-- Call Log Section -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Call Log</h3>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; overflow: hidden;">
          <!-- Table Header -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 16px; border-bottom: 1px solid rgb(75, 85, 99); background-color: rgb(45, 55, 72);">
            <div style="color: rgb(156, 163, 175); font-size: 12px; font-weight: 600; text-transform: uppercase;">CONTACT</div>
            <div style="color: rgb(156, 163, 175); font-size: 12px; font-weight: 600; text-transform: uppercase;">DURATION</div>
            <div style="color: rgb(156, 163, 175); font-size: 12px; font-weight: 600; text-transform: uppercase;">DISPOSITION</div>
            <div style="color: rgb(156, 163, 175); font-size: 12px; font-weight: 600; text-transform: uppercase;">NOTES</div>
          </div>
          <!-- Table Rows -->
          \${callLog.value.map(call => \`
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 16px; border-bottom: 1px solid rgb(75, 85, 99);">
              <div style="color: white; font-size: 14px;">\${call.contact}</div>
              <div style="color: white; font-size: 14px;">\${call.duration}</div>
              <div style="color: white; font-size: 14px;">\${call.disposition}</div>
              <div style="color: white; font-size: 14px;">\${call.notes || ''}</div>
            </div>
          \`).join('')}
        </div>
      </div>

      <!-- Results Section -->
      <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px;">
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <div style="color: rgb(96, 165, 250); font-size: 24px;">📈</div>
          <div style="flex: 1;">
            <h4 style="color: white; font-size: 16px; font-weight: 600; margin-bottom: 8px;">Your Calling Results</h4>
            <p style="color: rgb(209, 213, 219); font-size: 14px; line-height: 1.5; margin-bottom: 16px;">
              Great work! Your queue is paused. While you were calling, I enriched your contact file data with Connect Scores, call outcomes, and notes. You can export your enriched results now or keep calling to build even more value.
            </p>
            <button style="background-color: rgb(59, 130, 246); color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;" onclick="handleExportFile()">
              📁 Export Enriched File
            </button>
          </div>
        </div>
      </div>
    </div>
  \`

  addAIMessage([summaryHTML])

  // Show action buttons for continuing or loading new file
  if (shouldCompleteQueue.value) {
    showLoadNewFileButton.value = true
  } else {
    showContinueQueueButton.value = true
    showLoadNewFileButton.value = true
  }
}