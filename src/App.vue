<template>
  <!-- Test change for PR functionality -->
  <div class="min-h-screen text-white relative overflow-x-hidden dark" :class="showDialer ? 'dialer-active' : ''">
    
    <!-- Sidebar Navigation -->
    <Sidebar
      ref="headerRef"
      :isSignedIn="isSignedIn"
      :currentPage="currentPage"
      @login="handleLogin"
      @logout="handleLogout"
      @show-product="showProductPage"
      @go-home="goToMainApp"
    />

    <!-- Main App Content -->
    <main v-if="currentPage === 'main' && !managementMode && !showCoachDashboard" class="ml-16 flex-1 flex items-start justify-center p-8 relative z-[5]" :style="(showDialer || showCoachInfoPanel) ? 'margin-right: 33.333333%' : ''">
      <div class="flex gap-6 w-full max-w-[1400px] h-[80vh] mt-2.5">
        <!-- Chat Container -->
        <div class="w-full max-w-6xl mx-auto rounded-xl px-5">
          <div class="w-full h-full flex flex-col">
          <!-- Top content area - scrollable -->
          <div class="flex-1 flex flex-col gap-8 pr-2 overflow-x-hidden" :class="[showDialer ? 'pb-10' : 'pb-32', showCoachCarousel ? 'overflow-y-hidden' : 'overflow-y-auto']" ref="chatMessages">
            <!-- Chat Messages Area -->
            <div class="flex flex-col">
              <template v-for="(message, index) in messages" :key="index">
                <!-- Regular Chat Message -->
                <ChatMessage v-if="message.type !== 'separator'" :message="message" :isWide="shouldBeWideMessage(message, index)" :fullWidth="showCoachCarousel && index === 0" :onTypingProgress="message.preserveUserPosition ? undefined : scrollToBottomDuringTyping" :coachParameter="coachParameter" :aiCoachEnabled="aiCoachEnabled" @typing-complete="handleTypingComplete(index)">
                  <template #additional-content>
                    <!-- File Upload Area - shown inside welcome message for new users or ready to upload message for returning users -->
                    <CoachCarousel v-if="index === 0 && showCoachCarousel" @learn-more="openCoachInfoPanel" @practice="startPracticeCall" />
                    <!-- Email drafts selector inside AI bubble -->
                    <div v-if="showEmailDraftsCta && message.type === 'ai' && message.content.some(c => c.includes('What email drafts would you like use?'))" class="mt-3">
                      <Listbox v-model="selectedEmailTemplate" :options="emailTemplates" optionLabel="label" optionValue="value" class="w-full email-drafts-listbox" :pt="{ root: { style: { width: '100%' } } }" />
                    </div>
                    <div v-if="!showCoachCarousel && ((index === 0 && !isSignedIn && welcomeTypingComplete) || (isSignedIn && showFileUploadForReturningUser && isReadyToUploadMessage(message, index)))" class="mt-5">
                      <div class="flex flex-col gap-4 items-stretch">
                        <div class="w-full" style="order: 3;">
                          <FileUpload
                            height="calc(13rem - 20px)"
                            :no-top-margin="true"
                            @trigger-upload="simulateFileUpload"
                            @file-selected="onFileSelect"
                            @file-dropped="simulateFileUpload"
                          />
                        </div>
                        <div class="flex items-center justify-center my-1" style="order: 2;">
                          <span class="text-sm" style="color: var(--p-surface-200);">OR</span>
                        </div>
                        <Card class="w-full" :pt="{ root: { style: { background: 'var(--p-surface-800)', border: '1px solid var(--p-surface-600)', borderRadius: '8px', height: 'calc(13rem - 20px)', display: 'flex', flexDirection: 'column', order: 1 } }, body: { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' } } }">
                          <template #title>
                            <div style="padding-bottom: 10px;">Connect your CRM</div>
                          </template>
                          <template #content>
                            <div class="grid grid-cols-4 w-full h-full items-center justify-items-center" style="column-gap: 18px; row-gap: 6px;">
                              <Button
                                v-for="n in 8"
                                :key="n"
                                text
                                class="p-0"
                                :pt="{ root: { style: { background: 'transparent', border: 'none', padding: 0 } } }"
                                :aria-label="n === 1 ? 'Connect Follow Up Boss' : n === 2 ? 'Connect HubSpot' : n === 3 ? 'Connect Insightly' : n === 4 ? 'Connect Pipedrive' : n === 5 ? 'Connect Salesforce' : n === 6 ? 'Connect SugarCRM' : n === 7 ? 'Connect Zendesk' : 'Connect Zoho'"
                                @click="n === 1 ? openCrmModal('Follow Up Boss') : n === 2 ? openCrmModal('HubSpot') : n === 3 ? openCrmModal('Insightly') : n === 4 ? openCrmModal('Pipedrive') : n === 5 ? openCrmModal('Salesforce') : n === 6 ? openCrmModal('SugarCRM') : n === 7 ? openCrmModal('Zendesk') : openCrmModal('Zoho')"
                              >
                                <img
                                  v-if="n === 1"
                                  src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fe999ed7796124b4ba95e483edf6cc182?format=webp&width=800"
                                  alt="Follow Up Boss logo"
                                  style="height: 28px; width: auto; display: block; object-fit: contain;"
                                />
                                <img
                                  v-else-if="n === 2"
                                  src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fe1e0d2b2dedf4f5c99650544aa5db11f?format=webp&width=800"
                                  alt="HubSpot logo"
                                  style="height: 28px; width: auto; display: block; object-fit: contain;"
                                />
                                <img
                                  v-else-if="n === 3"
                                  src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F12a89d7381b9422bb8e5b31e99815f59?format=webp&width=800"
                                  alt="Insightly logo"
                                  style="height: 33px; width: auto; display: block; object-fit: contain;"
                                />
                                <img
                                  v-else-if="n === 4"
                                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Pipedrive_logo.svg"
                                  alt="Pipedrive logo"
                                  style="height: 56px; width: auto; display: block; object-fit: contain; filter: brightness(0) invert(1);"
                                />
                                <img
                                  v-else-if="n === 5"
                                  src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F3019387748a04b48af354bc9f50e69b2?format=webp&width=800"
                                  alt="Salesforce logo"
                                  style="height: 56px; width: auto; display: block; object-fit: contain;"
                                />
                                <img
                                  v-else-if="n === 6"
                                  src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fc76e447676844822add4c32826ad616f?format=webp&width=800"
                                  alt="SugarCRM logo"
                                  style="height: 28px; width: auto; display: block; object-fit: contain;"
                                />
                                <img
                                  v-else-if="n === 7"
                                  src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Ffeb76e03801644de813c9e6913bb9fc7?format=webp&width=800"
                                  alt="Zendesk logo"
                                  style="height: 28px; width: auto; display: block; object-fit: contain;"
                                />
                                <img
                                  v-else
                                  src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F711ac6df51024c5c9eabc4321b5595a1?format=webp&width=800"
                                  alt="Zoho logo"
                                  style="height: calc(28px * 4 / 3); width: auto; display: block; object-fit: contain; background: transparent;"
                                />
                              </Button>
                            </div>
                          </template>
                        </Card>
                      </div>
                    </div>
                  </template>
                </ChatMessage>

                <!-- Call Separator -->
                <CallSeparator v-else-if="message.type === 'separator'" :contactName="message.contactName || ''" />
              </template>
            </div>

            <!-- File Upload for Returning Users - now embedded in chat message instead -->


          </div>

          <!-- CRM Sign-in Modal -->
          <Dialog v-model:visible="showCrmModal" modal :header="`Connect ${selectedCrmName}`" :style="{ width: '28rem' }" :breakpoints="{ '960px': '90vw' }">
            <div class="flex flex-col gap-3">
              <div class="text-sm" style="color: var(--p-surface-200)">Sign in to your {{ selectedCrmName }} account</div>
              <div class="flex flex-col gap-2">
                <label class="text-sm" for="crm-email">Email</label>
                <InputText id="crm-email" v-model="crmEmail" class="w-full" placeholder="you@company.com" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm" for="crm-pass">Password / API Key</label>
                <Password id="crm-pass" v-model="crmPassword" toggleMask :feedback="false" class="w-full" :inputStyle="{ width: '100%' }" />
              </div>
            </div>
            <template #footer>
              <div class="flex items-center justify-end gap-2 w-full">
                <Button label="Cancel" severity="secondary" @click="showCrmModal = false" />
                <Button label="Connect" icon="pi pi-check" @click="connectCrm" :disabled="!crmEmail || !crmPassword" />
              </div>
            </template>
          </Dialog>

          <!-- Action Buttons - positioned above chat input -->
          <div v-if="showActionButtons && !actionButtonsUsed" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%]">
              <ActionButtons
                @action-selected="handleActionButton"
              />
            </div>
          </div>

          <!-- Queue Action Buttons - shown when queue is paused -->
          <div v-if="showContinueQueueButton" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <Button
                v-if="showContinueQueueButton"
                @click="continueQueue"
                severity="primary"
                label="Continue Call Queue"
                class="w-1/2 px-6 py-3 font-semibold"
              />
            </div>
          </div>

          <!-- Contact Preview Buttons - always visible when active -->
          <div v-if="showContactPreviewButtons && !contactPreviewButtonsUsed" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex gap-3">
              <Button
                @click="handleLooksGood"
                severity="primary"
                label="Contact Looks Good"
                class="flex-1 px-6 py-3 font-semibold"
                tabindex="3"
              />
              <Button
                @click="handleTryAgain"
                severity="secondary"
                label="Try Again"
                class="flex-1 px-6 py-3 font-semibold"
                tabindex="4"
              />
            </div>
          </div>

          <!-- Call Now CTA - appears after leads list response -->
          <div v-if="showCallNowCta && !showEmailDraftsCta" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <div class="w-full grid grid-cols-2 gap-3">
                <!-- Top-left primary -->
                <Button label="Yes let's call them now" icon="pi pi-phone" @click="startDialerFromPrompt" class="w-full px-6 py-3 font-semibold" />
                <!-- Top-right secondary -->
                <Button v-if="isSignedIn" label="Send Follow-up Emails" severity="secondary" @click="sendFollowUpEmails" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-left secondary -->
                <Button v-if="isSignedIn" label="Save as Call List" severity="secondary" @click="saveAsCallList" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-right secondary -->
                <Button v-if="isSignedIn" label="Not Now" severity="secondary" @click="dismissCallOptions" class="w-full px-5 py-3 font-medium" />
              </div>
            </div>
          </div>

          <!-- New Leads Added This Week CTA -->
          <div v-if="showNewLeadsCta" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <div class="w-full grid grid-cols-2 gap-3">
                <!-- Top-left primary -->
                <Button label="Start New Lead Dial Session" icon="pi pi-phone" @click="startNewLeadDialSession" class="w-full px-6 py-3 font-semibold" />
                <!-- Top-right secondary -->
                <Button v-if="isSignedIn" label="Send Welcome Emails First" severity="secondary" @click="sendWelcomeEmailsFirst" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-left secondary -->
                <Button v-if="isSignedIn" label="Schedule for Later" severity="secondary" @click="scheduleForLater" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-right secondary -->
                <Button v-if="isSignedIn" label="Not Now" severity="secondary" @click="dismissNewLeadOptions" class="w-full px-5 py-3 font-medium" />
              </div>
            </div>
          </div>

          <!-- Email Drafts Actions (buttons only) -->
          <div v-if="showEmailDraftsCta" class="mt-2 pt-3 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <div class="w-full grid grid-cols-2 gap-3">
                <Button label="Send Emails" icon="pi pi-send" @click="sendSelectedEmails" class="w-full px-6 py-3 font-semibold" />
                <Button label="Save For Later" severity="secondary" @click="saveEmailsForLater" class="w-full px-6 py-3 font-medium" />
              </div>
            </div>
          </div>

          <!-- Yesterday No-Answer CTA -->
          <div v-if="showYesterdayNoAnswerCta" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <div class="w-full grid grid-cols-2 gap-3">
                <!-- Top-left primary -->
                <Button label="Start Follow-up Calls" icon="pi pi-phone" @click="startFollowUpCalls" class="w-full px-6 py-3 font-semibold" />
                <!-- Top-right secondary -->
                <Button v-if="isSignedIn" label="Send Text Messages" severity="secondary" @click="sendTextsToNoAnswers" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-left secondary -->
                <Button v-if="isSignedIn" label="Try at Different Time" severity="secondary" @click="tryDifferentTime" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-right secondary -->
                <Button v-if="isSignedIn" label="Skip These" severity="secondary" @click="skipTheseNoAnswers" class="w-full px-5 py-3 font-medium" />
              </div>
            </div>
          </div>

          <!-- Today's Follow-ups CTA -->
          <div v-if="showTodayFollowupsCta" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <div class="w-full grid grid-cols-2 gap-3">
                <!-- Top-left primary -->
                <Button label="Call in Order of Time" icon="pi pi-phone" @click="callInOrderOfTime" class="w-full px-6 py-3 font-semibold" />
                <!-- Top-right secondary -->
                <Button v-if="isSignedIn" label="Call Highest Priority First" severity="secondary" @click="callHighestPriorityFirst" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-left secondary -->
                <Button v-if="isSignedIn" label="Send Reminder Emails" severity="secondary" @click="sendReminderEmails" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-right secondary -->
                <Button v-if="isSignedIn" label="Reschedule All" severity="secondary" @click="rescheduleAllFollowups" class="w-full px-5 py-3 font-medium" />
              </div>
            </div>
          </div>

          <!-- High Attempts Without Live Answer CTA -->
          <div v-if="showHighAttemptsCta" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <div class="w-full grid grid-cols-2 gap-3">
                <!-- Top-left primary -->
                <Button label="Switch to Email" icon="pi pi-envelope" @click="switchToEmailHighAttempts" class="w-full px-6 py-3 font-semibold" />
                <!-- Top-right secondary -->
                <Button v-if="isSignedIn" label="Try SMS Instead" severity="secondary" @click="trySmsInsteadHighAttempts" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-left secondary -->
                <Button v-if="isSignedIn" label="Try Different Times" severity="secondary" @click="tryDifferentTimesHighAttempts" class="w-full px-5 py-3 font-medium" />
                <!-- Bottom-right secondary -->
                <Button v-if="isSignedIn" label="Move to Inactive" severity="secondary" @click="moveToInactiveHighAttempts" class="w-full px-5 py-3 font-medium" />
              </div>
            </div>
          </div>

          <!-- Create Account CTA - shown after upload or CRM connect for new users -->
          <div v-if="showCreateAccountCTA && !isSignedIn" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <Button
                @click="proceedToCreateAccount"
                severity="primary"
                label="Create Account to Continue"
                class="w-1/2 px-8 py-3 font-semibold"
                tabindex="3"
              />
            </div>
          </div>

          <!-- Phone Verification Button - always visible when active -->
          <div v-if="showPhoneVerificationButton && verificationStep === 'default'" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <Button
                @click="handlePhoneVerification"
                severity="primary"
                label="Now lets verify my phone number"
                class="w-1/2 px-8 py-3 font-semibold"
                tabindex="3"
              />
            </div>
          </div>

          <!-- Verification Code Buttons - always visible when active -->
          <div v-if="showVerificationButtons && verificationCodeTypingComplete && !phoneVerified && verificationStep === 'enter-code'" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex gap-3">
              <Button
                @click="handleResendCode"
                severity="secondary"
                label="Resend Code"
                class="flex-1 px-6 py-3 font-semibold"
                tabindex="3"
              />
              <Button
                @click="handleTryAnotherNumber"
                severity="secondary"
                label="Try Another Number"
                class="flex-1 px-6 py-3 font-semibold"
                tabindex="4"
              />
            </div>
          </div>

          <!-- Caller ID Choice Buttons (shown after verification message) -->
          <div v-if="showCallerIdChoiceButtons" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex gap-3">
              <Button
                @click="selectCallerId('personal')"
                severity="secondary"
                label="Use Personal Caller ID"
                class="flex-1 px-6 py-3 font-semibold"
                tabindex="3"
              />
              <Button
                @click="selectCallerId('armor')"
                severity="primary"
                label="Use ARMOR® Number (Recommended)"
                class="flex-1 px-6 py-3 font-semibold"
                tabindex="4"
              />
            </div>
          </div>

          <!-- Audio Check Step (shown before Start Dialing) -->
          <div v-if="showStartDialingButton && !audioCheckPassed" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex flex-col items-center gap-3">
              <div class="text-sm text-gray-300 flex items-center gap-2">
                <i class="pi pi-microphone" aria-hidden="true"></i>
                <i class="pi pi-volume-up" aria-hidden="true"></i>
                <span>Before you start, please test your mic and speakers.</span>
              </div>
              <Button
                icon="pi pi-check"
                label="Run Audio Check"
                class="w-1/2 py-3 font-semibold"
                @click="showMicSpeakerCheck = true"
                tabindex="3"
              />
            </div>
          </div>

          <!-- Start Dialing Button (only after audio check passes) -->
          <div v-if="showStartDialingButton && audioCheckPassed" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <Button
                @click="handleStartDialing"
                severity="primary"
                label="Start Dialing"
                class="w-1/2 py-3 font-semibold"
                tabindex="3"
              />
            </div>
          </div>

          <!-- Disposition Buttons - always visible when active -->
          <div v-if="showDispositionButtons && showDialer && !showContinueQueueButton" class="mt-1 pt-2 flex justify-center">
            <!-- Voicemail Disposition Buttons for George Sample -->
            <div v-if="isVoicemailScenario" class="w-[70%] grid grid-cols-3 gap-3">
              <Button
                @click="handleDisposition('Voicemail Left')"
                severity="primary"
                label="Voicemail Left"
                class="py-3 px-4 font-medium"
                tabindex="3"
              />
              <Button
                @click="handleDisposition('No Voicemail Left')"
                severity="secondary"
                label="No Voicemail Left"
                class="py-3 px-4 font-medium"
                tabindex="4"
              />
              <Button
                @click="handleDisposition('No Answer')"
                severity="secondary"
                label="No Answer"
                class="py-3 px-4 font-medium"
                tabindex="5"
              />
            </div>
            <!-- Regular Disposition Buttons for other contacts -->
            <div v-else class="w-[70%] grid grid-cols-4 gap-3">
              <Button
                @click="handleDisposition('Follow up')"
                severity="secondary"
                label="Follow up"
                class="py-3 px-4 font-medium"
                tabindex="3"
              />
              <Button
                @click="handleDisposition('Not interested')"
                severity="secondary"
                label="Not interested"
                class="py-3 px-4 font-medium"
                tabindex="4"
              />
              <Button
                @click="handleDisposition('Do Not Call')"
                severity="secondary"
                label="Do Not Call"
                class="py-3 px-4 font-medium"
                tabindex="5"
              />
              <Button
                @click="handleDisposition('Set Appointment')"
                severity="primary"
                label="Set Appointment"
                class="py-3 px-4 font-medium"
                tabindex="6"
              />
            </div>
          </div>

          <!-- Signup Buttons - always visible when active -->
          <div v-if="showSignupButtons && !isSignedIn" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%]">
              <SignupButtons
                @google-signup="handleGoogleSignup"
                @email-signup="handleEmailSignup"
              />
            </div>
          </div>

          <!-- Load New File Button - shown when queue is completed -->
          <div v-if="showLoadNewFileButton || (isPracticeMode && !showDialer)" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex justify-center">
              <Button
                v-if="!isPracticeMode"
                @click="triggerFileUpload"
                severity="secondary"
                label="Load New File"
                icon="pi pi-upload"
                class="w-1/2 px-6 py-3 font-semibold flex items-center justify-center gap-2"
              />
              <Button
                v-else
                @click="returnToCoachesSelection"
                severity="secondary"
                label="Return to coaches selection"
                icon="pi pi-users"
                class="w-1/2 px-6 py-3 font-semibold flex items-center justify-center gap-2"
              />
            </div>
          </div>

          <!-- Chat Input - positioned at bottom -->
          <div class="mt-2 pt-2.5 mb-4">
            <ChatInput
              ref="chatInputRef"
              :customPlaceholder="getPlaceholderText()"
              :showPromptLibraryIcon="isSignedIn"
              @open-prompt-library="openPromptLibrary"
              @send-message="sendMessage"
              @voice-input="handleVoiceInput"
            />
          </div>

          <!-- Prompt Library Dialog -->
          <Dialog v-model:visible="showPromptLibrary" modal header="Prompt Library" :style="{ width: '51%' }" :pt="{ root: { style: { marginLeft: '50px', overflow: 'hidden' } }, content: { style: { height: '345px', overflowY: 'auto', overflowX: 'hidden', paddingRight: '12px', paddingBottom: '10px', boxSizing: 'border-box', scrollbarGutter: 'stable', borderBottomRightRadius: 'inherit' } } }" :breakpoints="{ '960px': '95vw' }">
            <div class="flex flex-col gap-3 text-left w-full">
              <div v-if="favoritePrompts.length" class="w-full">
                <div class="mb-2 font-semibold" style="color: var(--p-blue-500); font-size: 14px;">Favorites</div>
                <div class="flex flex-col gap-1 w-full">
                  <div v-for="(p, i) in favoritePrompts" :key="'fav-'+i" class="w-full flex items-center justify-between" :style="{ fontSize: '14px', lineHeight: '18px' }">
                    <a href="#" @click.prevent="selectPrompt(p)" class="inline-flex items-center gap-2 no-underline hover:no-underline" style="padding-left: 25px;" :aria-label="p">
                      <i class="pi pi-circle-fill" aria-hidden="true" style="font-size: 0.3rem; color: var(--p-surface-0);"></i>
                      <span style="color: var(--p-surface-0);">{{ p }}</span>
                    </a>
                    <Button
                      @click="toggleFavorite(p)"
                      link
                      rounded
                      severity="secondary"
                      class="w-5 h-5"
                      :pt="{ root: { style: { padding: '0', width: '20px', height: '20px', minWidth: '20px !important', minHeight: '20px !important', lineHeight: '20px', borderRadius: '50%', background: 'transparent', boxShadow: 'none', '--p-button-hover-background': 'transparent', '--p-button-active-background': 'transparent', '--p-button-padding-x': '0', '--p-button-padding-y': '0', '--p-button-icon-only-width': '20px' } }, icon: { style: { fontSize: '1rem' } } }"
                      :icon="isFavorite(p) ? 'pi pi-star-fill' : 'pi pi-star'"
                      :aria-label="isFavorite(p) ? 'Remove from favorites' : 'Add to favorites'"
                    />
                  </div>
                </div>
              </div>

              <div v-for="(section, si) in promptSections" :key="si" class="w-full">
                <div class="mb-2 text-sm font-semibold">
                  <Button
                    @click="toggleSection(section.title)"
                    link
                    severity="secondary"
                    :label="section.title"
                    icon="pi pi-chevron-right"
                    class="p-0 inline-flex items-center gap-2 no-underline hover:no-underline"
                    :pt="{ root: { style: { padding: '0', background: 'transparent', boxShadow: 'none', color: 'var(--p-blue-500)', minWidth: '20px !important', minHeight: '20px !important', textDecoration: 'none' } }, icon: { style: { fontSize: '0.8rem', color: 'var(--p-blue-500)', transform: isSectionCollapsed(section.title) ? 'rotate(0deg)' : 'rotate(90deg)' } }, label: { style: { color: 'var(--p-blue-500)', textDecoration: 'none', fontSize: '14px' } } }"
                    :aria-label="(isSectionCollapsed(section.title) ? 'Expand ' : 'Collapse ') + section.title"
                  />
                </div>
                <div v-if="!isSectionCollapsed(section.title)" class="flex flex-col gap-1 w-full">
                  <div v-for="(p, i) in section.items" :key="i" class="w-full flex items-center justify-between" :style="{ fontSize: '14px', lineHeight: '18px' }">
                    <a href="#" @click.prevent="selectPrompt(p)" class="inline-flex items-center gap-2 no-underline hover:no-underline" style="padding-left: 25px;" :aria-label="p">
                      <i class="pi pi-circle-fill" aria-hidden="true" style="font-size: 0.3rem; color: var(--p-surface-0);"></i>
                      <span style="color: var(--p-surface-0);">{{ p }}</span>
                    </a>
                    <Button
                      @click="toggleFavorite(p)"
                      link
                      rounded
                      severity="secondary"
                      class="w-5 h-5"
                      :pt="{ root: { style: { padding: '0', width: '20px', height: '20px', minWidth: '20px !important', minHeight: '20px !important', lineHeight: '20px', borderRadius: '50%', background: 'transparent', boxShadow: 'none', '--p-button-hover-background': 'transparent', '--p-button-active-background': 'transparent', '--p-button-padding-x': '0', '--p-button-padding-y': '0', '--p-button-icon-only-width': '20px' } }, icon: { style: { fontSize: '1rem' } } }"
                      :icon="isFavorite(p) ? 'pi pi-star-fill' : 'pi pi-star'"
                      :aria-label="isFavorite(p) ? 'Remove from favorites' : 'Add to favorites'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Dialog>

          </div>
        </div>

        <!-- Dialer Container -->
        <div v-if="showDialer" class="fixed top-0 right-0 w-1/3 h-screen z-20 bg-gray-900">
          <Dialer
            :callState="callState"
            :callDuration="callDuration"
            :queueTime="queueTime"
            :currentContact="currentContact"
            :nextContactName="nextContactName"
            :shouldCompleteQueue="shouldCompleteQueue"
            :isLastContact="isLastContact"
            :dispositionSet="dispositionSet"
            :queueCompletionReady="queueCompletionReady"
            :currentContactIndex="currentContactIndex"
            :totalContacts="contacts.length"
            :coachParameter="coachParameter"
            :aiCoachEnabled="aiCoachEnabled"
            @call-back="handleCallBack"
            @next-contact="handleNextContact"
            @hang-up="handleHangUp"
            @mute="handleMute"
            @hold="handleHold"
            @keypad="handleKeypad"
            @pause-queue="handlePauseQueue"
            @complete-queue="handleCompleteQueue"
            @ai-coach-toggle="handleAICoachToggle"
          />
        </div>

        <!-- Coach Info Panel -->
        <div v-if="showCoachInfoPanel" class="fixed top-0 right-0 w-1/3 h-screen z-20 bg-gray-900 border-l border-gray-700">
          <div class="h-full flex flex-col">
            <div class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/90 sticky top-0 z-10">
              <div class="flex items-center gap-3 min-w-0">
                <img v-if="selectedCoachForInfo?.avatarUrl" :src="selectedCoachForInfo.avatarUrl" :alt="selectedCoachForInfo.displayName" class="w-24 h-24 rounded-full object-cover" />
                <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-3xl">
                  {{ selectedCoachForInfo?.displayName?.charAt(0) || 'C' }}
                </div>
                <h3 class="text-2xl font-semibold truncate">{{ selectedCoachForInfo?.displayName || 'Coach' }}</h3>
              </div>
              <div class="flex items-center gap-2">
                <Button v-if="selectedCoachForInfo" :label="'Select ' + selectedCoachFirstName + ' as your coach'" size="small" severity="primary" @click="selectCoachFromPanel" :aria-label="'Select ' + selectedCoachFirstName + ' as your coach'" />
                <Button icon="pi pi-times" text severity="secondary" @click="closeCoachInfoPanel" aria-label="Close coach info" />
              </div>
            </div>
            <div class="p-4 overflow-y-auto flex-1 space-y-4">
              <div v-if="selectedCoachForInfo" class="space-y-4">

                <div v-if="selectedCoachForInfo.videoId" class="space-y-2">
                  <div class="aspect-video rounded-lg overflow-hidden bg-black/30">
                    <iframe
                      :src="`https://www.youtube.com/embed/${selectedCoachForInfo.videoId}?autoplay=1&mute=1&playsinline=1`"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      class="w-full h-full"
                    ></iframe>
                  </div>
                </div>

                <div v-if="selectedCoachForInfo.highlights && selectedCoachForInfo.highlights.length" class="space-y-1 pl-5 py-[10px]">
                  <label class="text-xl font-medium">Highlights</label>
                  <ul class="text-xs text-gray-300 list-disc list-inside">
                    <li v-for="(h,i) in selectedCoachForInfo.highlights" :key="i">{{ h }}</li>
                  </ul>
                </div>


                <!-- Basic Information -->
                <div class="space-y-2 pl-5 border-t border-white/10 pt-[22px] pb-[10px] mt-3">
                  <h4 class="text-xl font-medium">Basic Information</h4>
                  <ul class="text-xs text-gray-300 list-disc list-inside">
                    <li>Role: Sales Coach & Speaker</li>
                    <li>Experience: 12+ years</li>
                    <li>Signature Program: Momentum Calls Framework</li>
                  </ul>
                </div>

                <!-- Key Statistics -->
                <div class="space-y-2 pl-5 border-t border-white/10 pt-[22px] pb-[10px] mt-3">
                  <h4 class="text-xl font-medium">Key Statistics</h4>
                  <ul class="text-xs text-gray-300 list-disc list-inside">
                    <li>Avg. connect-rate lift: 27%</li>
                    <li>Time-to-first-meeting reduced: 34%</li>
                    <li>Teams coached: 250+; reps impacted: 10,000+</li>
                  </ul>
                </div>

                <!-- Platform Impact -->
                <div class="space-y-2 pl-5 border-t border-white/10 pt-[22px] pb-[10px] mt-3">
                  <h4 class="text-xl font-medium">Platform Impact</h4>
                  <ul class="text-xs text-gray-300 list-disc list-inside">
                    <li>Prioritizes best-time-to-call windows</li>
                    <li>Applies objection handling snippets in real time</li>
                    <li>Auto-generates follow-up tasks with proven cadences</li>
                  </ul>
                </div>

                <!-- About Coach -->
                <div class="space-y-2 pl-5 border-t border-white/10 pt-[22px] pb-[10px] mt-3">
                  <h4 class="text-xl font-medium">About {{ selectedCoachFirstName }}</h4>
                  <p class="text-xs text-gray-300">{{ selectedCoachFirstName }} is known for disciplined daily call blocks, clean qualification, and tight follow‑up cycles. Their approach balances energy with structure so reps stay consistent and close more.</p>
                </div>

                <!-- Industries Served -->
                <div class="space-y-2 pl-5 border-t border-white/10 pt-[22px] pb-[10px] mt-3">
                  <h4 class="text-xl font-medium">Industries Served</h4>
                  <ul class="text-xs text-gray-300 list-disc list-inside">
                    <li>SaaS</li>
                    <li>Insurance & Financial Services</li>
                    <li>Real Estate</li>
                    <li>Home Services</li>
                    <li>B2B Services</li>
                  </ul>
                </div>

                <!-- Sales Methodology -->
                <div class="space-y-2 pl-5 border-t border-white/10 pt-[22px] pb-[10px] mt-3">
                  <h4 class="text-xl font-medium">Sales Methodology</h4>
                  <ul class="text-xs text-gray-300 list-disc list-inside">
                    <li>Pattern interrupts to earn attention fast</li>
                    <li>Discovery that surfaces business impact early</li>
                    <li>Micro‑commitments that advance every call</li>
                  </ul>
                </div>

                <!-- Testimonials -->
                <div class="space-y-2 pl-5 border-t border-white/10 pt-[22px] pb-[10px] mt-3">
                  <h4 class="text-xl font-medium">Testimonials</h4>
                  <div class="text-xs text-gray-300 space-y-2">
                    <p>“Our connect rate and meetings doubled in 60 days.” — VP Sales, SaaS</p>
                    <p>“The talk tracks are simple and deadly effective.���� — SDR Lead, Insurance</p>
                  </div>
                <div v-if="selectedCoachForInfo?.websiteUrl" class="sticky bottom-0 -mb-4 -mx-4 px-4 py-3 border-t border-gray-700 bg-gray-900/90 flex justify-center">
                  <a :href="selectedCoachForInfo.websiteUrl" target="_blank" rel="noopener" class="text-link text-sm inline-flex items-center gap-2 text-center"><i class="pi pi-external-link text-sm" aria-hidden="true"></i>Visit {{ selectedCoachForInfo?.displayName }}'s Website</a>
                </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Coach Dashboard Page -->
    <div v-if="showCoachDashboard" class="ml-16">
      <CoachDashboard :coachName="dashboardCoachName" />
    </div>

    <!-- Product Page -->
    <div v-if="currentPage === 'product'" class="ml-16">
      <ProductPage
        @go-to-app="goToMainApp"
      />
    </div>

    <!-- Login Page -->
    <div v-if="currentPage === 'login'" class="ml-16">
      <LoginPage
        @google-signin="handleGoogleSignin"
        @login-success="handleLoginSuccess"
        @show-signup="showSignupFromLogin"
      />
    </div>

    <!-- Signup Page -->
    <div v-if="currentPage === 'signup'" class="ml-16">
      <SignupPage
        @google-signup="handleGoogleSignupFromSignup"
        @switch-to-signin="switchToSigninFromSignup"
      />
    </div>

    <!-- Coach Management Interface -->
    <CoachManagement v-if="managementMode === 'admin' && currentPage === 'main' && !showCoachDashboard" />

    <!-- Coach Creation Page for create-coach URL -->
    <CoachCreationPage
      v-if="managementMode === 'create'"
      @coach-created="handleCoachCreated"
      @cancel="handleCoachModalClose"
    />

    <!-- Footer -->
    <Footer v-if="currentPage === 'main' && !managementMode" :style="(showDialer || showCoachInfoPanel) ? 'margin-right: 33.333333%' : ''" :showDialer="showDialer" :queuePaused="queuePaused" @skip-to-dialer="skipToDialer" />

    <!-- Screen Reader Live Region for Announcements -->
    <div
      id="sr-announcements"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
      ref="screenReaderAnnouncements"
    ></div>


    <!-- Terms of Service Modal -->
    <TermsModal
      :visible="showTermsModal"
      @close="closeTermsModal"
      @cancel="handleTermsCancel"
      @agree="handleTermsAgree"
    />

    <!-- Account Creation Modal -->
    <AccountCreation
      v-if="showAccountCreation"
      @close="closeAccountCreation"
      @switch-to-signin="switchToSignin"
      @account-created="handleAccountCreated"
      @google-signup="handleGoogleSignupFromAccount"
      @show-terms="showTermsFromAccount"
    />

    <!-- Pricing Page -->
    <PricingPage
      v-if="showPricingPage"
      @upgrade-selected="handleUpgradeSelected"
      @show-payment="showPaymentFromPricing"
      @close="closePricingPage"
    />

    <!-- Payment Page -->
    <PaymentPage
      v-if="showPaymentPage"
      @purchase-completed="handlePurchaseCompleted"
      @close="closePaymentPage"
    />

    <!-- Mic/Speaker Check Modal -->
    <MicSpeakerCheck
      :visible="showMicSpeakerCheck"
      @close="showMicSpeakerCheck = false"
      @passed="onAudioCheckPassed"
    />

    <!-- Session Summary now displayed in chat area -->

  </div>
</template>

<style>

/* Spinner animation for export buttons */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { showContactPreview } from './utils/contactPreview'
import { clearFocusAndEstablishContext, focusChatInput, announceToScreenReader } from './utils/focus'
import { createChatUtils, type Message } from './utils/chat'
import { getResponseForKeywords, AI_RESPONSES } from './utils/aiResponses'
import { useCoaches } from './composables/useCoaches'
import type { CoachManagementMode, CoachCreateData } from './types/coach'

// Components
import Sidebar from './components/Sidebar.vue'
import ChatMessage from './components/ChatMessage.vue'
import FileUpload from './components/FileUpload.vue'
import ActionButtons from './components/ActionButtons.vue'
import SignupButtons from './components/SignupButtons.vue'
import ChatInput from './components/ChatInput.vue'
import TermsModal from './components/modals/TermsModal.vue'
import AccountCreation from './components/AccountCreation.vue'
import ProductPage from './components/ProductPage.vue'
import LoginPage from './components/LoginPage.vue'
import SignupPage from './components/SignupPage.vue'
import PricingPage from './components/PricingPage.vue'
import PaymentPage from './components/PaymentPage.vue'
import Footer from './components/Footer.vue'
import Dialer from './components/Dialer.vue'
import CallSeparator from './components/CallSeparator.vue'
import YouTubeVideo from './components/YouTubeVideo.vue'
import CoachManagement from './components/CoachManagement.vue'
import CoachCreationPage from './components/CoachCreationPage.vue'
import CoachCarousel from './components/CoachCarousel.vue'
import CoachDashboard from './components/CoachDashboard.vue'
import MicSpeakerCheck from './components/modals/MicSpeakerCheck.vue'

// PrimeVue Components (adding Button)
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Listbox from 'primevue/listbox'

// PrimeVue Components

// Types
import type { Coach } from './types/coach'
const selectedCoachFirstName = computed(() => selectedCoachForInfo.value?.displayName?.split(' ')[0] || 'Coach')
const isPracticeMode = ref<boolean>(false)

// CRM sign-in modal state
const showCrmModal = ref(false)
const selectedCrmName = ref('HubSpot')
const crmEmail = ref('')
const crmPassword = ref('')
const openCrmModal = (name: string) => {
  selectedCrmName.value = name
  showCrmModal.value = true
}
const connectCrm = () => {
  showCrmModal.value = false
  if (isSignedIn.value) {
    addAIMessageWithTyping(`You're now connected to <strong>${selectedCrmName.value}</strong>. We'll start analyzing your data.`)
    scrollToBottom()
  } else {
    addAIMessageWithTyping(`Success! <strong>${selectedCrmName.value}</strong> is connected. We'll begin analyzing your data, but first please create an account to continue.`)
    showCreateAccountCTA.value = true
    scrollToBottom()
  }
}

const returnToCoachesSelection = (): void => {
  isPracticeMode.value = false
  showDialer.value = false
  showLoadNewFileButton.value = false
  showContinueQueueButton.value = false
  setCurrentCoach(null)
  showCoachCarousel.value = true
  currentPage.value = 'main'
  const newUrl = `${window.location.pathname}?coach=all`
  window.history.replaceState({}, '', newUrl)
  messages.value = [
    {
      type: 'ai',
      content: [
        'Welcome to ARKON by PhoneBurner.<br><br>I\'m here to help you call with confidence and close more deals.<br><br>Choose your sales coach first - everything from your scripts to follow-up strategies will be tailored to their winning approach.'
      ],
      typing: false
    }
  ]
  nextTick(() => scrollToBottom())
}

interface Message {
  type: 'ai' | 'user' | 'separator'
  content: string[]
  contactName?: string
}


// Helper function to handle Connect Score text (no tooltip)
const wrapConnectScoreWithTooltip = (text: string): string => {
  return text // Just return the original text without any wrapping
}

// Generate dynamic coaching feedback
const getDynamicCoachingFeedback = (): string => {
  const coachingMessages = [
    'Great connection! I heard you building rapport early—that\'s your sweet spot. Next call, try mirroring their pace a bit more to deepen that connection.',
    'Nice work staying patient through their objections. I noticed you got stronger as the call progressed. Carry that momentum into the next one.',
    'You handled that beautifully! Your confidence really came through. Next time, try asking one more discovery question before presenting����it\'ll make your close even stronger.',
    'I loved how you listened for their pain points. Your empathy is one of your strongest assets. Now let\'s work on creating more urgency in your next call.',
    'Solid call! You kept them engaged throughout. I\'d love to see you slow down just a touch during the value proposition—let it sink in.',
    'That was textbook rapport building! Your energy is infectious. Next call, try to qualify their budget earlier in the conversation.',
    'Really strong finish! You didn\'t give up when they hesitated. For your next call, lead with a stronger hook to grab their attention faster.',
    'I can tell you\'re finding your rhythm! Your questioning technique is improving with each call. Next one, focus on getting them to commit to a specific time.',
    'Excellent persistence! You turned a \'no\' into a \'maybe\'—that\'s skill. Keep that same energy but try to get more specific about their timeline.',
    'That call showed real growth! Your objection handling is getting smoother. Next call, trust your instincts and go for the close sooner.'
  ]

  return coachingMessages[Math.floor(Math.random() * coachingMessages.length)]
}

// Generate personalized call script
const generateCallScript = (contact: any): string[] => {
  const scriptTemplate = AI_RESPONSES.CALL_SCRIPT

  // Replace template variables with actual contact information
  return scriptTemplate.map(line =>
    line
      .replace(/\{\{ contact_name \}\}/g, contact.name || 'there')
      .replace(/\{\{ your_name \}\}/g, '[Your Name]')
      .replace(/\{\{ your_company \}\}/g, '[Your Company]')
      .replace(/\{\{ industry \}\}/g, contact.industry || 'your industry')
      .replace(/\{\{ contact_company \}\}/g, contact.company || 'your company')
      .replace(/\{\{ value_statement \}\}/g, 'increase efficiency and reduce costs')
      .replace(/\{\{ pain_point \}\}/g, contact.industry ? `${contact.industry.toLowerCase()} operations` : 'current processes')
      .replace(/\{\{ process \}\}/g, contact.industry ? `${contact.industry.toLowerCase()} workflow` : 'your current workflow')
      .replace(/\{\{ department \}\}/g, contact.title ? contact.title.toLowerCase().includes('sales') ? 'sales process' : 'your operations' : 'your operations')
  )
}

// Show call connected message followed by script and objection handling
const showCallConnectedMessages = (contact: any): void => {
  // Add coach-specific intro message when coach parameter is set AND AI Coach is enabled
  if (coachParameter.value && aiCoachEnabled.value) {
    const getCoachCallMessage = (): string => {
      switch (coachParameter.value) {
        case 'jordan-stupar':
          return 'I\'m on the call with you - let\'s crush this together!'
        default:
          return 'I\'m on the call with you...'
      }
    }

    addAIMessageWithTyping(getCoachCallMessage())

    // Delay before showing connection message
    setTimeout(() => {
      showRegularConnectedMessages(contact)
    }, 1500)
    return
  }

  // Show regular messages for no coach or other coaches
  showRegularConnectedMessages(contact)
}

// Helper function for regular connected messages
const showRegularConnectedMessages = (contact: any): void => {
  if (!aiCoachEnabled.value) {
    // Just show basic connection message if AI Coach is disabled
    addAIMessageWithTyping('Great! You\'re connected!')
    scrollToBottom()
    return
  }

  // Combine connection message and script into single bubble with proper spacing
  const combinedMessage = [
    'Great! You\'re connected!',
    '<br>',
    'Script:',
    '<span style="color: #fbbf24; font-style: italic;">[The AI learns the nuances of this coach\'s approach to generate contextual scripts that reflect their unique sales philosophy, language patterns, and proven conversation starters tailored to this specific prospect.]</span>'
  ]

  addAIMessageWithTyping(combinedMessage)
  scrollToBottom()

  // Wait 3 seconds then show objection handling (only if AI Coach is still enabled)
  setTimeout(() => {
    if (aiCoachEnabled.value) {
      addAIMessageWithTyping(AI_RESPONSES.OBJECTION_RESPONSE)
      scrollToBottom()
    }
  }, 3000)
}

// Reactive data
const currentPage = ref<string>('main') // 'main', 'product', 'login', 'signup'
const showCoachDashboard = ref(false)
const dashboardCoachName = ref<string | null>(null)
const chatInputRef = ref<any>(null)
const chatMessages = ref<HTMLElement | null>(null)
const screenReaderAnnouncements = ref<HTMLElement | null>(null)
const headerRef = ref<any>(null)
const hasUploadedFile = ref<boolean>(false)
const showSignupButtons = ref<boolean>(false)
const showTermsModal = ref<boolean>(false)
const showAccountCreation = ref<boolean>(false)
const showPricingPage = ref<boolean>(false)
const showPaymentPage = ref<boolean>(false)
const showMicSpeakerCheck = ref<boolean>(false)
const audioCheckPassed = ref<boolean>(false)
const showCreateAccountCTA = ref<boolean>(false)
const isSignedIn = ref<boolean>(false)
const isReturningUser = ref<boolean>(false) // Track if user logged in vs created new account
const showActionButtons = ref<boolean>(false)
const showCallNowCta = ref<boolean>(false)
const showNewLeadsCta = ref<boolean>(false)
const showYesterdayNoAnswerCta = ref<boolean>(false)
const showTodayFollowupsCta = ref<boolean>(false)
const showHighAttemptsCta = ref<boolean>(false)
const showEmailDraftsCta = ref<boolean>(false)
const emailTemplates = ref<Array<{ label: string; value: string }>>([
  { label: 'Polite Check-in', value: 'Polite Check-in' },
  { label: 'We Missed You', value: 'We Missed You' },
  { label: 'Value Follow-up', value: 'Value Follow-up' },
  { label: 'Case Study Share', value: 'Case Study Share' },
  { label: 'Last Attempt Before Pause', value: 'Last Attempt Before Pause' }
])
const selectedEmailTemplate = ref<string | null>(emailTemplates.value[0].value)
const showFileUploadForReturningUser = ref<boolean>(false)
const welcomeTypingComplete = ref<boolean>(false)
const congratulationsTypingComplete = ref<boolean>(false)
const actionButtonsUsed = ref<boolean>(false)
const contactPreviewTypingComplete = ref<boolean>(false)
const contactPreviewButtonsUsed = ref<boolean>(false)
const connectionAnalysisTypingComplete = ref<boolean>(false)
const showContactPreviewButtons = ref<boolean>(false)
const showPhoneVerificationButton = ref<boolean>(false)
const phoneVerificationButtonUsed = ref<boolean>(false)
const verificationCodeTypingComplete = ref<boolean>(false)
const verificationStep = ref<string>('default') // 'default', 'enter-phone', 'enter-code'
const enteredPhoneNumber = ref<string>('')
const showVerificationButtons = ref<boolean>(false)
const phoneVerified = ref<boolean>(false) // Track if phone has been verified in this session
const showStartDialingButton = ref<boolean>(false)
const showCallerIdChoiceButtons = ref<boolean>(false)
const showDialer = ref<boolean>(false)
const showCoachInfoPanel = ref<boolean>(false)
const selectedCoachForInfo = ref<Coach | null>(null)
const showDispositionButtons = ref<boolean>(false)
const aiCoachEnabled = ref<boolean>(true)
const showSessionSummary = ref<boolean>(false)
const showContinueQueueButton = ref<boolean>(false)
const waitingForTryAgainResponse = ref<boolean>(false)
const waitingForNotesInput = ref<boolean>(false)
const currentDisposition = ref<string>('')
const dispositionSet = ref<boolean>(false)
const dispositionButtonClicked = ref<boolean>(false)
const queuePaused = ref<boolean>(false)
const queueCompletionReady = ref<boolean>(false)
const callLog = ref<Array<{contact: string, duration: string, disposition: string, notes: string}>>([])
const totalCalls = ref<number>(0)
const connectedCalls = ref<number>(0)
const skippedNumbers = ref<number>(3) // Default for demo
const callState = ref<string>('idle') // 'idle', 'ringing', 'connected', 'ended'
const callDuration = ref<number>(0)
const isManualHangUp = ref<boolean>(false) // Track if hang up was manual vs automatic
const queueTime = ref<number>(14)
const showLoadNewFileButton = ref<boolean>(false)

// Prompt Library state
const showPromptLibrary = ref<boolean>(false)
const favoritePrompts = ref<string[]>([])
const isFavorite = (p: string): boolean => favoritePrompts.value.includes(p)
const toggleFavorite = (p: string): void => {
  if (isFavorite(p)) {
    favoritePrompts.value = favoritePrompts.value.filter(x => x !== p)
  } else {
    if (!favoritePrompts.value.includes(p)) favoritePrompts.value = [...favoritePrompts.value, p]
  }
}

const promptSections = ref<{ title: string; items: string[] }[]>([
  {
    title: 'Time-Based Contact Queries',
    items: [
      "Show me leads not called in 3 weeks",
      'Which leads were added this week but not contacted yet?',
      "Find all prospects I called yesterday who didn't answer",
      'Show me follow-ups scheduled for today',
      'Which contacts have I called more than 5 times without a live answer?'
    ]
  },
  {
    title: 'Performance & Outcome Analysis',
    items: [
      'Show me my highest converting lead sources from last month',
      "Which contacts answered my calls but haven't scheduled appointments?",
      "Find leads that opened my emails but haven't been called",
      "Show me contacts marked as 'interested' but no follow-up scheduled",
      'Which prospects went to voicemail 3+ times in a row?'
    ]
  },
  {
    title: 'Lead Prioritization & Scoring',
    items: [
      'Show me my hottest prospects based on recent activity',
      "Find contacts in my pipeline who haven't been touched in 2 weeks",
      'Which leads responded positively to my last SMS?',
      'Show me prospects from high-value companies I should call first',
      'Find contacts who visited our website after my last call'
    ]
  },
  {
    title: 'Segmentation & Targeting',
    items: [
      'Show me all real estate contacts in California',
      'Find prospects in the mortgage industry with upcoming renewals',
      'Which contacts are decision makers vs. influencers?',
      'Show me leads from referral partners who need follow-up',
      "Find all contacts tagged as 'warm' but not called this month"
    ]
  },
  {
    title: 'Campaign & List Management',
    items: [
      "Create a call list of prospects who didn't answer last week",
      'Show me contacts ready for my next nurture sequence',
      'Which leads bounced from my email campaign?',
      "Find prospects who fit my ideal customer profile but aren't being worked",
      'Show me contacts who should be moved from cold to warm status'
    ]
  },
  {
    title: 'Relationship & Context Queries',
    items: [
      "What's the history with [contact name]?",
      'Show me all contacts at [company name]',
      'Which prospects mentioned budget concerns in my notes?',
      'Find contacts who expressed interest in [specific product/service]',
      'Show me leads who asked to be called back at specific times'
    ]
  },
  {
    title: 'Compliance & Data Quality',
    items: [
      'Show me contacts with missing phone numbers',
      "Which leads haven't been dispositioned properly?",
      'Find duplicate contacts in my database',
      'Show me contacts who requested to be removed from calling',
      'Which phone numbers are flagged as potentially spam?'
    ]
  },
  {
    title: 'Goal-Oriented Tasks',
    items: [
      'Help me build a call list to hit 100 dials today',
      'Show me the 20 most promising prospects for this week',
      'Find contacts most likely to convert based on my recent wins',
      "Which prospects should I prioritize to hit my monthly quota?",
      'Show me contacts that match my recent closed deals'
    ]
  }
])
const collapsedSections = ref<Record<string, boolean>>(
  Object.fromEntries(promptSections.value.map(s => [s.title, true]))
)
const isSectionCollapsed = (title: string): boolean => collapsedSections.value[title] !== false
const toggleSection = (title: string): void => { collapsedSections.value[title] = !isSectionCollapsed(title) }
const openPromptLibrary = (): void => {
  showPromptLibrary.value = true
}
const selectPrompt = (text: string): void => {
  if (chatInputRef.value && chatInputRef.value.setInputValue) {
    chatInputRef.value.setInputValue(text)
  }
  nextTick(() => {
    if (chatInputRef.value && chatInputRef.value.focus) {
      chatInputRef.value.focus()
    }
  })
  showPromptLibrary.value = false
}

// Initialize coach management system
const {
  currentCoachId,
  currentCoach,
  welcomeMessage,
  managementMode,
  setCurrentCoach,
  setManagementMode,
  addCoach,
  coachList,
  generateCoachUrl
} = useCoaches()

// Show carousel of all coaches when ?coach=all
const showCoachCarousel = ref<boolean>(false)

// Computed to maintain compatibility with existing code
const coachParameter = computed(() => currentCoachId.value || '')

// Contact data
const contacts = [
  {
    name: 'Sam Sample',
    title: 'Sales Development Representative',
    company: 'Innovate Inc.',
    phone: '(312) 586-9748',
    connectScore: 'High',
    email: 'samsample@getitonline.com',
    address: 'Address 1, Apt/Suite, CHICAGO, Illinois 60606',
    localTime: '12:59 PM (CHICAGO, IL)',
    website: 'https://www.innovate.com',
    linkedin: 'https://www.linkedin.com/in/samsample-fake',
    industry: 'Technology / SaaS',
    companySize: '250-500 employees',
    leadSource: 'Webinar Registration',
    sourceType: 'crm',
    sourceName: 'Salesforce',
    sourceUrl: 'https://example.my.salesforce.com/lightning/r/Lead/00Q5g00000ABC123/view',
    notes: ''
  },
  {
    name: 'George Sample',
    title: 'Marketing Manager',
    company: 'Solutions Co.',
    phone: '(202) 744-9556',
    connectScore: 'High',
    email: 'george@solutions.co',
    address: '123 Fake Street, Suite 100, Washington, DC 20001',
    localTime: '1:59 PM (WASHINGTON, DC)',
    website: 'https://www.solutions.co',
    linkedin: 'https://www.linkedin.com/in/georgesample-fake',
    industry: 'Marketing & Advertising',
    companySize: '11-50 employees',
    leadSource: 'Conference Booth',
    sourceType: 'crm',
    sourceName: 'HubSpot',
    sourceUrl: 'https://app.hubspot.com/contacts/1234567/record/0-1/987654321',
    notes: ''
  },
  {
    name: 'Jennifer Martinez',
    title: 'VP of Sales',
    company: 'TechFlow Inc.',
    phone: '(555) 456-7890',
    connectScore: 'Medium',
    email: 'jennifer@techflow.com',
    address: '456 Business Ave, San Francisco, CA 94102',
    localTime: '11:15 AM (SAN FRANCISCO, CA)',
    website: 'https://www.techflow.com',
    linkedin: 'https://www.linkedin.com/in/jennifermartinez',
    industry: 'Software Development',
    companySize: '100-250 employees',
    leadSource: 'LinkedIn Outreach',
    sourceType: 'spreadsheet',
    sourceName: 'Google Sheets',
    sourceUrl: 'https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890/edit#gid=0',
    notes: ''
  },
  {
    name: 'David Wilson',
    title: 'Operations Director',
    company: 'Global Systems',
    phone: '(555) 321-0987',
    connectScore: 'High',
    email: 'david@globalsystems.com',
    address: '789 Corporate Blvd, Austin, TX 78701',
    localTime: '1:30 PM (AUSTIN, TX)',
    website: 'https://www.globalsystems.com',
    linkedin: 'https://www.linkedin.com/in/davidwilson',
    industry: 'Enterprise Solutions',
    companySize: '500+ employees',
    leadSource: 'Trade Show',
    sourceType: 'crm',
    sourceName: 'Pipedrive',
    sourceUrl: 'https://example.pipedrive.com/person/42',
    notes: ''
  }
]

const currentContactIndex = ref<number>(0)
const currentContact = computed(() => contacts[currentContactIndex.value])
const nextContactName = computed(() => {
  const nextIndex = currentContactIndex.value + 1
  return nextIndex < contacts.length ? contacts[nextIndex].name : 'No more contacts'
})

const shouldCompleteQueue = computed(() => {
  // Show "Queue Completed" button when on 3rd contact (index 2) or have 3+ calls
  return currentContactIndex.value >= 2 || callLog.value.length >= 3
})

const isLastContact = computed(() => {
  return currentContactIndex.value >= contacts.length - 1
})

// Check if current contact is George Sample (voicemail scenario)
const isVoicemailScenario = computed(() => {
  return currentContact.value && currentContact.value.name === 'George Sample'
})

// Use the welcome message from the coach system
const getCoachWelcomeMessage = welcomeMessage

// Chat messages array
const messages: Ref<Message[]> = ref([
  {
    type: 'ai',
    content: [''], // Will be updated with coach-specific message after URL parsing
    // Only show typing animation for completely new users (not signed in and not returning)
    typing: !isSignedIn.value && !isReturningUser.value
  }
])

// Initialize chat utilities
const chatUtils = createChatUtils(messages, chatMessages, headerRef)
const { scrollToBottom, scrollToBottomDuringTyping, scrollToUserMessage, scrollToTopForGoals, addAIMessage, addAIMessageWithoutScroll, addUserMessage, addUserGoalMessage, addUserQueuePausedMessage, addUserQueueCompletedMessage, addSeparatorMessage, addAIMessageWithTyping, addAIMessageWithTypingNoScroll, suppressScrolling } = chatUtils

// Hide the Call Now CTA automatically when the dialer is shown
watch(() => showDialer.value, (val) => {
  if (val) { showCallNowCta.value = false; showNewLeadsCta.value = false; showYesterdayNoAnswerCta.value = false; showTodayFollowupsCta.value = false; showHighAttemptsCta.value = false; showEmailDraftsCta.value = false }
})

watch(() => showEmailDraftsCta.value, (on) => {
  if (on) {
    showCallNowCta.value = false
    showNewLeadsCta.value = false
    showYesterdayNoAnswerCta.value = false
    showTodayFollowupsCta.value = false
    showHighAttemptsCta.value = false
  }
})

// Ensure chat container and window scroll are reset to the very top
const scrollChatToTop = () => {
  const el = chatMessages.value
  if (el) {
    el.scrollTop = 0
    try {
      el.scrollTo({ top: 0, behavior: 'auto' })
    } catch {}
  }
  try {
    window.scrollTo({ top: 0, behavior: 'auto' })
  } catch {}
}

// Helper function to identify if a message is the "Ready to upload" message for returning users
const isReadyToUploadMessage = (message: Message, index: number): boolean => {
  if (message.type !== 'ai') return false
  const content = Array.isArray(message.content) ? message.content[0] : message.content
  return content.includes('Ready to upload your contact file and start dialing') ||
         content.includes('Ready to load a new file. Please upload your contact list')
}

// Helper function to determine which messages should be wide (for file upload)
const shouldBeWideMessage = (message: Message, index: number): boolean => {
  // Make message wide if it contains file upload content
  return (index === 0 && (!isSignedIn.value || showCoachCarousel.value)) || // Welcome or All Coaches message
         (isSignedIn.value && showFileUploadForReturningUser.value && isReadyToUploadMessage(message, index)) // Upload message for returning users
}

// Handle typing completion for welcome message
const handleTypingComplete = (index: number): void => {
  // If this is the welcome message (index 0) and user is not signed in
  if (index === 0 && !isSignedIn.value) {
    welcomeTypingComplete.value = true
  }

  // Show call-now button after leads-not-called list finishes typing
  if (!showDialer.value && messages.value[index] && messages.value[index].content.some(line => line.includes('Here are 10 leads not called in the last 3 weeks'))) {
    setTimeout(() => {
      if (!showDialer.value) showCallNowCta.value = true
    }, 150)
  }
  if (!showDialer.value && messages.value[index] && messages.value[index].content.some(line => line.includes("Here are new leads added this week that haven't been contacted yet"))) {
    setTimeout(() => {
      if (!showDialer.value) showNewLeadsCta.value = true
    }, 150)
  }
  if (!showDialer.value && messages.value[index] && messages.value[index].content.some(line => line.includes("Here are prospects you called yesterday who didn't answer"))) {
    setTimeout(() => {
      if (!showDialer.value) showYesterdayNoAnswerCta.value = true
    }, 150)
  }
  if (!showDialer.value && messages.value[index] && messages.value[index].content.some(line => line.includes("Here are today's scheduled callbacks"))) {
    setTimeout(() => {
      if (!showDialer.value) showTodayFollowupsCta.value = true
    }, 150)
  }
  if (!showDialer.value && messages.value[index] && messages.value[index].content.some(line => line.includes('Here are contacts with 5+ call attempts without a live answer'))) {
    setTimeout(() => {
      if (!showDialer.value) showHighAttemptsCta.value = true
    }, 150)
  }

  // Check if this is the congratulations message
  if (messages.value[index] && messages.value[index].content[0]?.includes('Congratulations! You\'ve successfully upgraded to the Pro plan')) {
    congratulationsTypingComplete.value = true
    // Only show action buttons if they haven't been used yet
    if (!actionButtonsUsed.value) {
      setTimeout(() => {
        showActionButtons.value = true
      }, 200) // Small delay for better UX
    }
  }

  // Check if this is a contact preview message (starts with goal responses)
  if (messages.value[index] && messages.value[index].content[0] && (
    messages.value[index].content[0].includes('Perfect! Setting appointments is our bread and butter') ||
    messages.value[index].content[0].includes('Outstanding! Closing live sales is where the magic happens') ||
    messages.value[index].content[0].includes('Perfect! Creating opportunities is all about finding the right prospects') ||
    messages.value[index].content[0].includes('Smart choice! Follow-ups are where deals are won') ||
    messages.value[index].content[0].includes('Brilliant! Live transfers maximize your team\'s efficiency') ||
    messages.value[index].content[0].includes('Fantastic! Live conversations are the heart of great sales')
  )) {
    contactPreviewTypingComplete.value = true
    // Only show contact preview buttons if they haven't been used yet
    if (!contactPreviewButtonsUsed.value) {
      setTimeout(() => {
        showContactPreviewButtons.value = true
      }, 200) // Small delay for better UX
    }
  }

  // Check if this is the connection analysis message
  if (messages.value[index] && messages.value[index].content[0]?.includes('I\'ve analyzed your contact\'s phone numbers using real connection data')) {
    connectionAnalysisTypingComplete.value = true
    // Show phone verification button after typing completes (for new users only) and if not already used
    if (!isReturningUser.value && !phoneVerified.value && !phoneVerificationButtonUsed.value) {
      setTimeout(() => {
        showPhoneVerificationButton.value = true
      }, 200) // Small delay for better UX
    }
  }

  // Check if this is the verification code message
  if (messages.value[index] && messages.value[index].content[0]?.includes('Perfect. We\'ve sent a text with 6-digit verification code')) {
    verificationCodeTypingComplete.value = true
    // Show verification buttons after typing completes only if phone is not yet verified and we're still in verification step
    if (!phoneVerified.value && verificationStep.value === 'enter-code') {
      setTimeout(() => {
        showVerificationButtons.value = true

        // Focus the chat input after the buttons appear
        setTimeout(() => {
          if (chatInputRef.value && chatInputRef.value.focus) {
            chatInputRef.value.focus()
            console.log('Auto-focused chat input for verification code after typing')
          } else {
            console.log('Chat input ref not available for verification code auto-focus after typing')
          }
        }, 100)
      }, 200) // Small delay for better UX
    }
  }
}

// Update welcome message typing status based on user status
const updateWelcomeMessageTyping = (): void => {
  if (messages.value.length > 0 && messages.value[0].type === 'ai') {
    const welcomeMessage = messages.value[0]
    if (welcomeMessage.content[0].includes('Welcome to <strong>ARKON</strong>') || welcomeMessage.content[0].includes('Drop your contact file here')) {
      // Update typing property based on current user status
      welcomeMessage.typing = !isSignedIn.value && !isReturningUser.value
    }
  }
}

const openCoachInfoPanel = (coach: Coach): void => {
  selectedCoachForInfo.value = coach
  showCoachInfoPanel.value = true
}

const closeCoachInfoPanel = (): void => {
  showCoachInfoPanel.value = false
}

const selectCoachFromPanel = (): void => {
  if (!selectedCoachForInfo.value) return
  const url = generateCoachUrl(selectedCoachForInfo.value.name)
  window.location.href = url
}

const startPracticeCall = (coach: Coach): void => {
  // Set selected coach and hide carousel
  isPracticeMode.value = true
  setCurrentCoach(coach.id)
  showCoachCarousel.value = false

  // Ensure main app/dialer visible
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = true
  hasUploadedFile.value = true
  updateWelcomeMessageTyping()
  showDialer.value = true

  // Reset dialer state
  callState.value = 'idle'
  currentContactIndex.value = 0
  totalCalls.value = 0
  connectedCalls.value = 0
  callLog.value = []

  // Clear chat and announce practice
  messages.value = []
  addAIMessage(`Practice mode activated with <strong>${coach.displayName}</strong>. Placing a sample call...`)

  // Start call after short delay
  setTimeout(() => {
    callState.value = 'ringing'
    queueTimer = setInterval(() => { queueTime.value++ }, 1000)

    // Add separator for the first (and only) practice contact
    addSeparatorMessage(currentContact.value.name)

    setTimeout(() => {
      // Connect the call
      callState.value = 'connected'
      callDuration.value = 0
      connectedCalls.value++
      callTimer = setInterval(() => { callDuration.value++ }, 1000)

      // Coach connection message + advice
      showCallConnectedMessages(currentContact.value)

      // Remain connected for manual user hang-up and disposition in practice mode
    }, 2000) // ring duration
  }, 800)
}

// Header Methods
const handleLogin = () => {
  currentPage.value = 'login'

  // Clear any existing focus when navigating to login page
  nextTick(() => {
    // Remove focus from any current element so page loads with no focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Establish focus context by mimicking header click
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)

    // Announce page change to screen readers
    announceToScreenReader('Navigated to login page. Press Tab to navigate with keyboard.')
  })
}

const handleLogout = () => {
  // Reset user state
  isSignedIn.value = false
  isReturningUser.value = false
  phoneVerified.value = false // Reset phone verification status
  welcomeTypingComplete.value = false // Reset typing completion state
  congratulationsTypingComplete.value = false // Reset congratulations typing state
  actionButtonsUsed.value = false // Reset action buttons used state
  contactPreviewTypingComplete.value = false // Reset contact preview typing state
  contactPreviewButtonsUsed.value = false // Reset contact preview buttons used state
  connectionAnalysisTypingComplete.value = false // Reset connection analysis typing state
  phoneVerificationButtonUsed.value = false // Reset phone verification button used state
  verificationCodeTypingComplete.value = false // Reset verification code typing state

  // Reset UI state
  showDialer.value = false
  showCoachInfoPanel.value = false
  selectedCoachForInfo.value = null
  showActionButtons.value = false
  showContactPreviewButtons.value = false
  showPhoneVerificationButton.value = false
  showStartDialingButton.value = false
  showDispositionButtons.value = false
  showContinueQueueButton.value = false
  showFileUploadForReturningUser.value = false
  waitingForNotesInput.value = false
  currentDisposition.value = ''

  // Reset calling state
  callState.value = 'ended'
  callDuration.value = 0
  queueTime.value = 14
  currentContactIndex.value = 0
  dispositionSet.value = false
  queuePaused.value = false
  queueCompletionReady.value = false
  waitingForTryAgainResponse.value = false
  waitingForNotesInput.value = false
  currentDisposition.value = ''
  dispositionButtonClicked.value = false

  // Reset verification state
  verificationStep.value = 'default'
  enteredPhoneNumber.value = ''
  showVerificationButtons.value = false

  // Clear call log
  callLog.value = []
  totalCalls.value = 0
  connectedCalls.value = 0

  // Reset typing state
  welcomeTypingComplete.value = false
  congratulationsTypingComplete.value = false
  actionButtonsUsed.value = false
  contactPreviewTypingComplete.value = false
  contactPreviewButtonsUsed.value = false
  connectionAnalysisTypingComplete.value = false

  // Reset to welcome message
  messages.value = [
    {
      type: 'ai',
      content: [
        getCoachWelcomeMessage.value
      ],
      // Only show typing animation for completely new users (not signed in and not returning)
      typing: !isSignedIn.value && !isReturningUser.value
    }
  ]

  // Clear any timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
  if (queueTimer) {
    clearInterval(queueTimer)
    queueTimer = null
  }
  if (callSimulationTimeout) {
    clearTimeout(callSimulationTimeout)
    callSimulationTimeout = null
  }

  // Scroll to top
  scrollToBottom()

  // Announce to screen readers
  nextTick(() => {
    announceToScreenReader('Logged out successfully. Returned to welcome page.')

    // Establish focus context
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
  })
}

const handleSwitchToVulcan = () => {
  console.log('Switch to Vulcan')
}

const showProductPage = () => {
  currentPage.value = 'product'

  // Clear any existing focus when navigating to product page
  nextTick(() => {
    // Remove focus from any current element so page loads with no focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Establish focus context by mimicking header click
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)

    // Announce page change to screen readers
    announceToScreenReader('Navigated to product page. Press Tab to navigate with keyboard.')
  })
}

const goToMainApp = () => {
  // Set page and clear any special modes/panels
  currentPage.value = 'main'
  showCoachDashboard.value = false
  dashboardCoachName.value = null
  setManagementMode(null)
  showDialer.value = false
  showCoachInfoPanel.value = false
  selectedCoachForInfo.value = null

  // Clean URL of special parameters
  try {
    const url = new URL(window.location.href)
    ;['coach-dashboard','coach-admin','create-coach','coach'].forEach(p => url.searchParams.delete(p))
    const qs = url.searchParams.toString()
    window.history.replaceState({}, '', qs ? `${url.pathname}?${qs}` : url.pathname)
  } catch {}

  // Clear any existing focus when navigating to main app
  nextTick(() => {
    // Remove focus from any current element so page loads with no focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Establish focus context by mimicking header click
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)

    // Temporarily suppress auto-scroll-to-bottom from chat utils
    suppressScrolling(2000)

    // Ensure scroll position is at the very top (account for async rendering)
    scrollChatToTop()
    requestAnimationFrame(() => scrollChatToTop())
    setTimeout(scrollChatToTop, 100)
    setTimeout(scrollChatToTop, 300)

    // Announce page change to screen readers
    announceToScreenReader('Returned to main application. Press Tab to navigate with keyboard.')
  })
}

// Accessibility helper for screen reader announcements
const announceToScreenReader = (message: string) => {
  if (screenReaderAnnouncements.value) {
    screenReaderAnnouncements.value.textContent = message
    // Clear after announcement to allow repeat announcements
    setTimeout(() => {
      if (screenReaderAnnouncements.value) {
        screenReaderAnnouncements.value.textContent = ''
      }
    }, 1000)
  }
}

// Redirect focus from tab trap to ARKON logo
const redirectToArkonLogo = () => {
  const arkonLogo = document.querySelector('button[aria-label="Return to ARKON home page"]') as HTMLElement
  if (arkonLogo) {
    arkonLogo.focus()
  }
}

// Login Page Methods

const handleGoogleSignin = (): void => {
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = true // This is a returning user
  phoneVerified.value = true // Returning users don't need to verify phone again
  // Remove initial long welcome bubble when returning
  messages.value = []
  // Show brief prior welcome bubble, then welcome-back bubble
  addAIMessage('Welcome to the ARMOR® AI Dialer, your AI calling assistant.')
  addAIMessageWithTyping("Welcome back! You're signed in with Google.<br><br>What would you like to do?")
  // Do not prompt for upload; assume user already connected/uploaded previously
  showFileUploadForReturningUser.value = false

  // Clear any existing focus when navigating back to main app
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
      if (arkonLogo) {
        arkonLogo.focus()
        arkonLogo.blur()
      }
    }, 50)
    announceToScreenReader('Signed in with Google successfully. Returned to main application.')
  })
}

const handleLoginSuccess = (userData: any): void => {
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = true // This is a returning user
  phoneVerified.value = true // Returning users don't need to verify phone again
  // Remove initial long welcome bubble when returning
  messages.value = []

  // Show brief prior welcome bubble, then welcome-back bubble
  addAIMessage('Welcome to the ARMOR® AI Dialer, your AI calling assistant.')
  addAIMessage(`Welcome back, ${userData.name}!`)
  // Returning user: do not show upload prompt
  showFileUploadForReturningUser.value = false

  // Clear any existing focus when navigating back to main app
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
      if (arkonLogo) {
        arkonLogo.focus()
        arkonLogo.blur()
      }
    }, 50)
    announceToScreenReader('Returned to main application after login.')
  })
}

const showSignupFromLogin = (): void => {
  currentPage.value = 'signup'

  // Clear any existing focus when navigating to signup page
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
  })
}

const handleGoogleSignupFromSignup = (): void => {
  // Show terms modal for new Google signup users
  showTermsModal.value = true
}

const switchToSigninFromSignup = (): void => {
  currentPage.value = 'login'

  // Clear any existing focus when navigating to login page
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to login page. Press Tab to navigate with keyboard.')
  })
}

// Navigate to signup page helper
const proceedToCreateAccount = (): void => {
  // Stop any pending 'create an account' typing bubbles
  messages.value.forEach((m: any) => {
    if (m?.type === 'ai' && m?.typing && Array.isArray(m.content) && m.content.join(' ').toLowerCase().includes('create an account')) {
      m.typing = false
    }
  })
  currentPage.value = 'signup'
  showCreateAccountCTA.value = false
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
  })
}

const showCreateAccountPrompt = (type: 'upload' | 'crm'): void => {
  const msg = type === 'upload'
    ? "Success! Your contact sheet has been uploaded. We'll begin analyzing your data, but first please create an account to continue."
    : "Success! You're connected to your CRM. We'll begin analyzing your data, but first please create an account to continue."
  addAIMessageWithTyping(msg)
  showCreateAccountCTA.value = true
  scrollToBottom()
}

// File Upload Methods
const simulateFileUpload = () => {
  hasUploadedFile.value = true
  showFileUploadForReturningUser.value = false

  // Announce to screen readers
  announceToScreenReader('File uploaded successfully. Analyzing contact data.')

  if (isSignedIn.value) {
    // User is already signed in, go directly to contact preview
    setTimeout(() => {
      announceToScreenReader('Contact file analysis complete. Preview available.')
      const sampleContacts = `
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
      </div>`

      addAIMessage([
        'Perfect! I\'ve analyzed your <strong style="color: #fbbf24;">156 contacts</strong>.<br><br>Here\'s a preview of your data. Does this look correct?<br><br>',
        sampleContacts
      ])
      showContactPreviewButtons.value = true
      scrollToBottom()
    }, 1500)
  } else {
    showCreateAccountPrompt('upload')
  }
}

const onFileSelect = (file: File): void => {
  hasUploadedFile.value = true
  showFileUploadForReturningUser.value = false

  if (isSignedIn.value) {
    // User is already signed in, go directly to contact preview
    setTimeout(() => {
      showContactPreview(addAIMessage, (show: boolean) => showContactPreviewButtons.value = show, scrollToBottom)
    }, 1500)
  } else {
    showCreateAccountPrompt('upload')
  }
}

// Chat Input Methods
const sendMessage = (message: string): void => {
  // Add user message
  addUserMessage(message)

  // If user says yes, start the dialer immediately
  const trimmed = message.trim().toLowerCase()
  if (trimmed === 'yes' || trimmed.startsWith('yes ')) {
    addAIMessage('Great, starting the dialer now...')
    showCallNowCta.value = false
    setTimeout(() => skipToDialer(), 300)
    return
  }

  // Handle notes input for disposition (but not during session summary)
  if (waitingForNotesInput.value && showDialer.value && !showContinueQueueButton.value) {
    waitingForNotesInput.value = false

    // Update contact notes
    if (currentContact.value) {
      currentContact.value.notes = message.trim()
    }

    // Update call log entry with notes
    if (callLog.value.length > 0) {
      const lastCall = callLog.value[callLog.value.length - 1]
      lastCall.notes = message.trim()
    }

    // Set disposition flag to enable next button
    dispositionSet.value = true

    // Complete the disposition process
    setTimeout(() => {
      // Check if this is the 3rd contact (index 2) - if so, enable queue completion
      if (currentContactIndex.value >= 2) {
        queueCompletionReady.value = true
        addAIMessageWithTyping(`The call outcome and notes have been saved for ${currentContact.value.name}. Click "Queue Completed" to finish your dialing session.`)
      } else {
        addAIMessageWithTyping(`The call outcome and notes have been saved for ${currentContact.value.name}. Click "Next" to continue to the next contact.`)
      }
      scrollToBottom()
    }, 1000)
    return
  }

  // Handle try again response flow
  if (waitingForTryAgainResponse.value) {
    waitingForTryAgainResponse.value = false
    setTimeout(() => {
      addAIMessage('I understand. Let\'s try uploading your contact file again.<br><br>Ready to upload your contact file and start dialing?')
      // Reset states to show file upload
      hasUploadedFile.value = false
      showFileUploadForReturningUser.value = true
      scrollToBottom()
    }, 1000)
    return
  }

  // Handle verification flow
  if (verificationStep.value === 'enter-phone') {
    enteredPhoneNumber.value = message
    verificationStep.value = 'enter-code'
    verificationCodeTypingComplete.value = false // Reset typing state

    setTimeout(() => {
      const fm = formatPhoneNumber(message)
      // Maintain top position like goals while typing the verification prompt
      const maintainTop = () => {
        scrollToTopForGoals()
      }
      const maintainer = setInterval(maintainTop, 300)
      // Add without auto-scroll to keep the phone input message pinned
      addAIMessageWithTypingNoScroll(`Perfect. We've sent a text with 6-digit verification code to ${fm}. Please enter it below to continue.`)
      // Stop maintaining after the typing starts
      setTimeout(() => clearInterval(maintainer), 2000)
    }, 1000)
    return
  }

  if (verificationStep.value === 'enter-code') {
    // Immediately hide all verification UI elements
    showVerificationButtons.value = false
    showPhoneVerificationButton.value = false
    verificationCodeTypingComplete.value = false
    phoneVerificationButtonUsed.value = true

    // Mark verification as complete and reset step
    phoneVerified.value = true
    verificationStep.value = 'default'

    // Next: present caller ID choice instead of jumping to audio check
    showCallerIdChoiceButtons.value = true
    audioCheckPassed.value = false

    // Pin the user's 6-digit code message to the top like goals/account-created flows
    scrollToTopForGoals()
    const maintainTop = () => {
      scrollToTopForGoals()
    }
    const maintainer = setInterval(maintainTop, 300)

    const formatted = formatPhoneNumber(enteredPhoneNumber.value)
    setTimeout(() => {
      // Add AI response without auto-scrolling; keep the user message pinned
      addAIMessageWithTypingNoScroll([
        `Great! Your number ${formatted} is verified, but our ARMOR® test results across 3 carriers show 1 flag for spam on AT&T.<br><br><div style="margin: 4px 0 10px 0; color: var(--p-surface-200); font-size: 0.9em;">Carrier results</div><div style="display: flex; gap: 12px; justify-content: space-between;">
  <div style="text-align: center; width: 32%; display: flex; flex-direction: column;">
    <div style="font-weight: 600; margin-bottom: 6px;">AT&amp;T</div>
    <img src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fde975ceb671f4509ba23ee1c030bec02?format=webp&width=800" alt="AT&T flagged as spam" style="width: 100%; max-width: 140px; border-radius: 8px; margin: 0 auto; display: block;" />
  </div>
  <div style="text-align: center; width: 32%; display: flex; flex-direction: column; margin: 0 auto;">
    <div style="font-weight: 600; margin-bottom: 6px;">T-Mobile</div>
    <img src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fe853c377f12e40d1ae7e549eb5a11cfa?format=webp&width=800" alt="T-Mobile clean" style="width: 100%; max-width: 140px; border-radius: 8px; margin: 0 auto; display: block;" />
  </div>
  <div style="text-align: center; width: 32%; display: flex; flex-direction: column;">
    <div style="font-weight: 600; margin-bottom: 6px;">Verizon</div>
    <img src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fe853c377f12e40d1ae7e549eb5a11cfa?format=webp&width=800" alt="Verizon clean" style="width: 100%; max-width: 140px; border-radius: 8px; margin: 0 auto; display: block;" />
  </div>
</div><br>To ensure your calls connect, we've provided you with a free ARMOR® number to protect against false flags. This includes comprehensive number monitoring, remediation, and answer rate analytics.<br><br>Which number would you like to use for your Caller ID?`
      ])
      // Stop maintaining after typing starts
      setTimeout(() => clearInterval(maintainer), 2000)
    }, 1000)
    return
  }

  // Handle custom disposition input when disposition buttons are showing
  if (showDispositionButtons.value && showDialer.value) {
    // Treat the input as a custom disposition - same logic as handleDisposition
    showDispositionButtons.value = false

    // Mark that this was custom input, not a button click
    dispositionButtonClicked.value = false

    const userInput = message.trim()

    // Store the disposition for later use
    currentDisposition.value = userInput

    // Update the last call log entry with the disposition and notes
    if (callLog.value.length > 0) {
      const lastCall = callLog.value[callLog.value.length - 1]
      lastCall.disposition = userInput
      lastCall.notes = userInput // Always use custom input as notes

      // Update contact notes too
      if (currentContact.value) {
        currentContact.value.notes = userInput
      }
    }

    // Set disposition flag to enable next button immediately
    dispositionSet.value = true

    // User provided custom input, consider it complete (no additional notes prompt)
    waitingForNotesInput.value = false

    setTimeout(() => {
      // Check if this is the 3rd contact (index 2) - if so, enable queue completion
      if (currentContactIndex.value >= 2) {
        queueCompletionReady.value = true
        addAIMessageWithTyping(`The notes have been saved for ${currentContact.value.name}. Click "Queue Completed" to finish your dialing session.`)
      } else {
        addAIMessageWithTyping(`The notes have been saved for ${currentContact.value.name}. Click "Next" to continue to the next contact.`)
      }
      scrollToBottom()
    }, 1000)
    return
  }

  // Simulate AI processing for regular messages
  setTimeout(() => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('anything about arkon')) {
      addAIMessage([
        '<i class="pi pi-rocket"></i> ARKON is PhoneBurner\'s revolutionary AI-powered dialer!',
        'It uses advanced algorithms to predict the best times to call prospects, automatically prioritizes your contact list, and helps you connect with more people in less time.',
        'Key features include smart scheduling, real-time connect predictions, and personalized calling strategies.',
        'What specific aspect of ARKON would you like to know more about?'
      ])
    } else if (lowerMessage.includes('connected to more calls') || lowerMessage.includes('get connected')) {
      addAIMessage([
        '<i class="pi pi-chart-line"></i> Great question! Here are ARKON\'s proven strategies to boost your connect rates:',
        '��� <strong>Smart Timing:</strong> Calls prospects when they\'re most likely to answer',
        '• <strong>Local Presence:</strong> Uses local numbers to increase pickup rates',
        '• <strong>Voicemail Drop:</strong> Leaves personalized messages when they don\'t answer',
        '• <strong>Follow-up Sequences:</strong> Automatically schedules optimal callback times',
        'On average, users see a 40% increase in connect rates within their first week!'
      ])
    } else if (lowerMessage.includes('setup a demo') || lowerMessage.includes('demo')) {
      addAIMessage([
        '<i class="pi pi-star"></i> I\'d love to show you ARKON in action!',
        'Let me set up a personalized demo where you can see:',
        '• Live contact scoring and prioritization',
        '• Real-time dialing with connect predictions',
        '���� Smart call disposition and follow-up automation',
        'What\'s your preferred time? I can schedule something for today or tomorrow.'
      ])
    } else if (lowerMessage.includes('who i should call now') || lowerMessage.includes('who should i call')) {
      addAIMessage([
        '<i class="pi pi-bullseye"></i> Based on your contact data and current time analysis:',
        '<strong>Top 3 prospects to call right now:</strong>',
        '1. Sarah Johnson - 92% connect probability (last spoke 3 days ago)',
        '2. Mike Chen - 89% connect probability (opened your email yesterday)',
        '3. Jennifer Martinez - 84% connect probability (perfect timing window)',
        'Should I dial Sarah first? She\'s showing the highest engagement score today.'
      ])
    } else if (lowerMessage.includes('fire up a dial session') || lowerMessage.includes('dial session')) {
      addAIMessage([
        '<i class="pi pi-bolt"></i> Let\'s fire up a power dialing session!',
        'I can configure your session with:',
        '• <strong>Target audience:</strong> High-priority prospects, warm leads, or follow-ups',
        '• <strong>Call duration:</strong> 30 min, 1 hour, or 2-hour session',
        '• <strong>Connect goals:</strong> Number of conversations you want to have',
        'What type of prospects do you want to focus on for this session?'
      ])
    } else if (lowerMessage.includes('set a reminder') || lowerMessage.includes('reminder')) {
      addAIMessage([
        '<i class="pi pi-clock"></i> I\'ll help you set up smart reminders!',
        'ARKON can remind you to:',
        '• Follow up with specific prospects at optimal times',
        '• Call back prospects who didn\'t answer',
        '• Review and update your call notes',
        '• Start your daily calling sessions',
        'What would you like to be reminded about and when?'
      ])
    } else if (lowerMessage.includes('practice a call') || lowerMessage.includes('practice')) {
      addAIMessage([
        '<i class="pi pi-users"></i> Great idea! Call practice makes perfect.',
        'ARKON\'s practice mode can help you:',
        '• Rehearse your opening pitch with AI feedback',
        '• Practice handling common objections',
        '��� Test different conversation flows',
        '�� Record and review your delivery',
        'Would you like to practice a cold call opening or work on handling objections?'
      ])
    } else if (lowerMessage.includes('appointments') && lowerMessage.includes('today')) {
      addAIMessage([
        '<i class="pi pi-calendar"></i> Here\'s your schedule for today:',
        '<strong>Upcoming appointments:</strong>',
        '<i class="pi pi-check"></i> 2:00 PM - Demo call with Sarah Johnson (confirmed)',
        '• 3:30 PM - Follow-up with ABC Corp (needs confirmation)',
        '• 4:15 PM - Discovery call with new lead Mike Chen',
        'You have 45 minutes before your next call. Perfect time for some prospecting!'
      ])
    } else if (lowerMessage.includes('tell a joke') || lowerMessage.includes('joke')) {
      addAIMessage([
        '<i class="pi pi-heart"></i> Why did the salesperson bring a ladder to work?',
        'Because they heard the job was about making <strong>high-level</strong> connections!',
        '',
        'Speaking of connections, did you know ARKON users make 3x more meaningful connections than traditional dialers?',
        'Ready to elevate your calling game?'
      ])
    } else if (lowerMessage.includes('jenn')) {
      addAIMessage([
        'Found Jenn!',
        'I found <strong>Jenn Peterson</strong> in your contacts.',
        'She has an <strong>89% pickup rate</strong> and is most likely available now.',
        'Ready to call Jenn?'
      ])
    } else if (
      (lowerMessage.includes('not called') && (lowerMessage.includes('3 weeks') || lowerMessage.includes('three weeks') || lowerMessage.includes('21 days')))
      || lowerMessage.includes('leads not called in 3 weeks')
    ) {
      const names = ['Avery Collins','Noah Price','Mia Turner','Liam Brooks','Sofia Perez','Ethan Gray','Isabella Reed','Mason Clark','Olivia Hayes','James Walker']
      const rows = names.map((n, i) => `
        <tr>
          <td style="padding: 6px 8px 6px 0; width: 28px; color: var(--p-surface-300);">${i + 1}.</td>
          <td style="padding: 6px 0;">${n}</td>
          <td style="padding: 6px 0; text-align: right; color: var(--p-surface-200);">${22 + i} days ago</td>
        </tr>
      `).join('')
      const table = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 4px;">
          <tbody>
            ${rows}
          </tbody>
        </table>
      `
      addAIMessageWithTyping([
        '<i class="pi pi-users"></i> Here are 10 leads not called in the last 3 weeks:<br><br>',
        table,
        '<br>Would you like me to start calling these now?'
      ])
    } else if (
      (lowerMessage.includes('more than 5 times') || lowerMessage.includes('5+')) && (lowerMessage.includes('without a live answer') || lowerMessage.includes('no live answer'))
    ) {
      const records = [
        { name: 'Taylor Reed', attempts: 7, disposition: 'No Answer' },
        { name: 'Jamal Carter', attempts: 6, disposition: 'Voicemail' },
        { name: 'Hannah Kim', attempts: 8, disposition: 'Busy' },
        { name: 'Miguel Alvarez', attempts: 9, disposition: 'No Answer' },
        { name: 'Ava Thompson', attempts: 6, disposition: 'Voicemail' },
        { name: 'Ryan Patel', attempts: 7, disposition: 'No Answer' }
      ]
      const rows = records.map((r, i) => `
        <tr>
          <td style=\"padding: 6px 8px 6px 0; width: 28px; color: var(--p-surface-300);\">${i + 1}.</td>
          <td style=\"padding: 6px 0;\">${r.name}</td>
          <td style=\"padding: 6px 0; text-align: right; color: var(--p-surface-0); font-weight: 600;\">${r.attempts}</td>
          <td style=\"padding: 6px 0; text-align: right; color: var(--p-surface-200);\">${r.disposition}</td>
        </tr>
      `).join('')
      const table = `
        <table style=\"width: 100%; border-collapse: collapse; margin-top: 4px;\">
          <thead>
            <tr>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\"></th>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Name</th>
              <th style=\"text-align: right; color: var(--p-surface-200); font-weight: 600; padding-bottom: 6px;\">Attempts</th>
              <th style=\"text-align: right; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Last Disposition</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `
      addAIMessageWithTyping([
        '<i class="pi pi-chart-line"></i> Here are contacts with 5+ call attempts without a live answer:<br><br>',
        table,
        '<br>What would you like to do next?'
      ])
    } else if (
      lowerMessage.includes('follow-ups') && lowerMessage.includes('today')
    ) {
      const callbacks = [
        { time: '09:30 AM', name: 'Tanya Brooks', notes: 'Pricing follow-up' },
        { time: '10:15 AM', name: 'Raj Kapoor', notes: 'Requested callback about onboarding' },
        { time: '11:45 AM', name: 'Marta Lopez', notes: 'Send case studies before call' },
        { time: '02:00 PM', name: 'Chris Young', notes: 'Demo recap and next steps' },
        { time: '03:30 PM', name: 'Amelia Wright', notes: 'Budget approval check-in' }
      ]
      const rows = callbacks.map((c, i) => `
        <tr>
          <td style=\"padding: 6px 8px 6px 0; width: 28px; color: var(--p-surface-300);\">${i + 1}.</td>
          <td style=\"padding: 6px 0; color: var(--p-surface-0); font-weight: 600;\">${c.time}</td>
          <td style=\"padding: 6px 0;\">${c.name}</td>
          <td style=\"padding: 6px 0; text-align: right; color: var(--p-surface-200);\">${c.notes}</td>
        </tr>
      `).join('')
      const table = `
        <table style=\"width: 100%; border-collapse: collapse; margin-top: 4px;\">
          <thead>
            <tr>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\"></th>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 600; padding-bottom: 6px;\">Time</th>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Name</th>
              <th style=\"text-align: right; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `
      addAIMessageWithTyping([
        '<i class="pi pi-calendar"></i> Here are today\'s scheduled callbacks:<br><br>',
        table,
        '<br>How would you like to proceed?'
      ])
    } else if (
      lowerMessage.includes('yesterday') && (lowerMessage.includes("didn't answer") || lowerMessage.includes('did not answer') || lowerMessage.includes('no answer') || lowerMessage.includes('busy') || lowerMessage.includes('voicemail'))
    ) {
      const prospects = [
        { name: 'Samantha Lee', disposition: 'Voicemail' },
        { name: 'Marcus Allen', disposition: 'Busy' },
        { name: 'Priya Desai', disposition: 'No Answer' },
        { name: 'Diego Ramos', disposition: 'Voicemail' },
        { name: 'Emily Chen', disposition: 'No Answer' },
        { name: 'Owen Wright', disposition: 'Busy' }
      ]
      const rows = prospects.map((p, i) => `
        <tr>
          <td style=\"padding: 6px 8px 6px 0; width: 28px; color: var(--p-surface-300);\">${i + 1}.</td>
          <td style=\"padding: 6px 0;\">${p.name}</td>
          <td style=\"padding: 6px 0; text-align: right; color: var(--p-surface-200);\">Yesterday</td>
          <td style=\"padding: 6px 0; text-align: right; color: var(--p-surface-0); font-weight: 600;\">${p.disposition}</td>
        </tr>
      `).join('')
      const table = `
        <table style=\"width: 100%; border-collapse: collapse; margin-top: 4px;\">
          <thead>
            <tr>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\"></th>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Name</th>
              <th style=\"text-align: right; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Date</th>
              <th style=\"text-align: right; color: var(--p-surface-200); font-weight: 600; padding-bottom: 6px;\">Disposition</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `
      addAIMessageWithTyping([
        '<i class="pi pi-history"></i> Here are prospects you called yesterday who didn\'t answer:<br><br>',
        table,
        '<br>Would you like to start follow-up calls or take a different action?'
      ])
    } else if (
      lowerMessage.includes('added this week') && (lowerMessage.includes('not contacted') || lowerMessage.includes('not contacted yet') || lowerMessage.includes('uncontacted'))
    ) {
      const leads = [
        { name: 'Chloe Harris', date: 'Mon', source: 'Website' },
        { name: 'Evan Brooks', date: 'Mon', source: 'HubSpot' },
        { name: 'Zoe Mitchell', date: 'Tue', source: 'Referral' },
        { name: 'Lucas Nguyen', date: 'Tue', source: 'LinkedIn' },
        { name: 'Aiden Rivera', date: 'Wed', source: 'Salesforce' },
        { name: 'Layla Scott', date: 'Wed', source: 'Website' },
        { name: 'Henry Adams', date: 'Thu', source: 'Zoho' },
        { name: 'Nora Bennett', date: 'Thu', source: 'Pipedrive' }
      ]
      const rows = leads.map((l, i) => `
        <tr>
          <td style=\"padding: 6px 8px 6px 0; width: 28px; color: var(--p-surface-300);\">${i + 1}.</td>
          <td style=\"padding: 6px 0;\">${l.name}</td>
          <td style=\"padding: 6px 0; text-align: right; color: var(--p-surface-200);\">${l.date}</td>
          <td style=\"padding: 6px 0; text-align: right; color: var(--p-surface-200);\">${l.source}</td>
        </tr>
      `).join('')
      const table = `
        <table style=\"width: 100%; border-collapse: collapse; margin-top: 4px;\">
          <thead>
            <tr>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\"></th>
              <th style=\"text-align: left; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Name</th>
              <th style=\"text-align: right; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Date Added</th>
              <th style=\"text-align: right; color: var(--p-surface-200); font-weight: 500; padding-bottom: 6px;\">Source</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `
      addAIMessageWithTyping([
        '<i class="pi pi-user-plus"></i> Here are new leads added this week that haven\'t been contacted yet:<br><br>',
        table,
        '<br>How would you like to proceed?'
      ])
    } else if (lowerMessage.includes('call') || lowerMessage.includes('start')) {
      addAIMessage([
        'Perfect! Let\'s start calling. <i class="pi pi-phone"></i>',
        'I\'ll prioritize contacts with the highest pickup probability.',
        'Shall I begin with the top 23 most likely to answer?'
      ])
    } else {
      addAIMessage('I can help you find specific contacts, start calling sessions, or analyze your data. What would you like to do?')
    }
  }, 1000)
}

const handleVoiceInput = () => {
  addAIMessage('<i class="pi pi-microphone"></i> Listening... (voice recognition simulated)')

  // Simulate voice input
  setTimeout(() => {
    chatInputRef.value?.setInputValue("Call my highest priority contacts")
    addAIMessage('Voice captured! I heard: "Call my highest priority contacts"')
  }, 2000)
}

// Contact Preview Button Methods
const handleLooksGood = (): void => {
  // Hide contact preview buttons and mark as used
  showContactPreviewButtons.value = false
  contactPreviewButtonsUsed.value = true
  // Reset connection analysis typing state for new message
  connectionAnalysisTypingComplete.value = false

  // Add user message showing what button was clicked
  addUserMessage('Contact Looks Good')

  if (isReturningUser.value || phoneVerified.value) {
    // Skip phone verification for returning users or if phone was already verified
    setTimeout(() => {
      addAIMessageWithTyping([
        'I\'ve analyzed your contact\'s phone numbers using real connection data from 900M+ calls, recent phone engagement, calling patterns, and carrier signals—so you only dial numbers likely to connect.<br><br>I\'ve prioritized the phone numbers most likely to connect so you spend time talking, not hitting dead lines.<br><br>Here\'s what I found:<br><div style="margin-left: 1em; text-indent: -1em;">• 40 numbers have \'High\' Connect Scores and show consistent calling activity in the last 12 months. These are highly likely to be connected and assigned to active subscribers.</div><br><div style="margin-left: 1em; text-indent: -1em;">• 67 numbers have \'Medium\' Connect Scores and are worth calling after you exhaust your \'High\' Connect Score numbers.</div><br><div style="margin-left: 1em; text-indent: -1em;">• 54 numbers have \'Low\' Connect Scores and are likely disconnected or inactive lines that won\'t answer when dialed.</div>'
      ])

      // Present caller ID choice after verification/returning user
      setTimeout(() => {
        const personal = enteredPhoneNumber.value ? formatPhoneNumber(enteredPhoneNumber.value) : '(971) 235-1723'
        addAIMessage([
          `Great! Your number ${personal} is verified, but our ARMOR�� test results across 3 carriers show 1 flag for spam on AT&T.<br><br><div style="margin: 4px 0 10px 0; color: var(--p-surface-200); font-size: 0.9em;">Carrier results</div><div style="display: flex; gap: 12px; justify-content: space-between;">
  <div style="text-align: center; width: 32%; display: flex; flex-direction: column;">
    <div style="font-weight: 600; margin-bottom: 6px;">AT&amp;T</div>
    <img src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fde975ceb671f4509ba23ee1c030bec02?format=webp&width=800" alt="AT&T flagged as spam" style="width: 100%; max-width: 140px; border-radius: 8px; margin: 0 auto; display: block;" />
  </div>
  <div style="text-align: center; width: 32%; display: flex; flex-direction: column; margin: 0 auto;">
    <div style="font-weight: 600; margin-bottom: 6px;">T-Mobile</div>
    <img src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fe853c377f12e40d1ae7e549eb5a11cfa?format=webp&width=800" alt="T-Mobile clean" style="width: 100%; max-width: 140px; border-radius: 8px; margin: 0 auto; display: block;" />
  </div>
  <div style="text-align: center; width: 32%; display: flex; flex-direction: column;">
    <div style="font-weight: 600; margin-bottom: 6px;">Verizon</div>
    <img src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2Fe853c377f12e40d1ae7e549eb5a11cfa?format=webp&width=800" alt="Verizon clean" style="width: 100%; max-width: 140px; border-radius: 8px; margin: 0 auto; display: block;" />
  </div>
</div><br>To ensure your calls connect, we've provided you with a free ARMOR® number to protect against false flags. This includes comprehensive number monitoring, remediation, and answer rate analytics.<br><br>Which number would you like to use for your Caller ID?`
        ])
        showCallerIdChoiceButtons.value = true
        audioCheckPassed.value = false
        scrollToBottom()
      }, 1500)

      scrollToBottom()
    }, 1000)
  } else {
    // Regular flow for new users
    setTimeout(() => {
      addAIMessageWithTyping([
        'I\'ve analyzed your contact\'s phone numbers using real connection data from 900M+ calls, recent phone engagement, calling patterns, and carrier signals—so you only dial numbers likely to connect.<br><br>I\'ve prioritized the phone numbers most likely to connect so you spend time talking, not hitting dead lines.<br><br>Here\'s what I found:<br><div style="margin-left: 1em; text-indent: -1em;">• 40 numbers have \'High\' Connect Scores and show consistent calling activity in the last 12 months. These are highly likely to be connected and assigned to active subscribers.</div><br><div style="margin-left: 1em; text-indent: -1em;">��� 67 numbers have \'Medium\' Connect Scores and are worth calling after you exhaust your \'High\' Connect Score numbers.</div><br><div style="margin-left: 1em; text-indent: -1em;">• 54 numbers have \'Low\' Connect Scores and are likely disconnected or inactive lines that won\'t answer when dialed.</div>'
      ])

      // Phone verification button will be shown automatically when typing completes
    }, 1000)
  }
}

const handleTryAgain = (): void => {
  // Hide contact preview buttons and mark as used
  showContactPreviewButtons.value = false
  contactPreviewButtonsUsed.value = true

  // Add user message showing what button was clicked
  addUserMessage('Try Again')

  // Add AI response after a delay
  setTimeout(() => {
    addAIMessage('What didn\'t look right previously that I can fix?')
    // Set flag to wait for user response
    waitingForTryAgainResponse.value = true
  }, 1000)
}

const handlePhoneVerification = (): void => {
  // Hide phone verification button and mark as used
  showPhoneVerificationButton.value = false
  phoneVerificationButtonUsed.value = true

  // Add user message showing what button was clicked
  addUserMessage('Now lets verify my phone number')

  // Announce to screen readers
  announceToScreenReader('Phone verification started. Please enter your phone number.')

  // Set verification step to enter phone
  verificationStep.value = 'enter-phone'

  // Add AI response after a delay
  setTimeout(() => {
    addAIMessage('Great! To start dialing, you need to add a verified phone number to your account. What number would you like to use?')
    announceToScreenReader('AI response: Please enter your phone number to continue.')

    // Focus the chat input after the AI message appears
    setTimeout(() => {
      if (chatInputRef.value && chatInputRef.value.focus) {
        chatInputRef.value.focus()
        console.log('Auto-focused chat input for phone number entry')
      } else {
        console.log('Chat input ref not available for phone number auto-focus')
      }
    }, 500)
  }, 1000)
}

const getPlaceholderText = (): string => {
  // Handle verification steps first
  switch (verificationStep.value) {
    case 'enter-phone':
      return 'Enter your business phone number'
    case 'enter-code':
      return 'Enter 6-digit verification code'
  }

  // Handle notes input state
  if (waitingForNotesInput.value) {
    return 'Enter notes...'
  }

  // Handle disposition selection state
  if (showDispositionButtons.value && showDialer.value) {
    return 'Enter notes...'
  }

  // Only allow animation on the very initial welcome screen
  // Animation shows when: not signed in, no buttons showing, no file uploaded, etc.
  const isInitialWelcomeState = !isSignedIn.value &&
                                 !showActionButtons.value &&
                                 !showContactPreviewButtons.value &&
                                 !showPhoneVerificationButton.value &&
                                 !showStartDialingButton.value &&
                                 !showDispositionButtons.value &&
                                 !showContinueQueueButton.value &&
                                 !showSignupButtons.value &&
                                 !hasUploadedFile.value &&
                                 !showDialer.value &&
                                 !waitingForNotesInput.value

  if (isInitialWelcomeState) {
    return '' // Allow animation
  } else if (waitingForNotesInput.value && showDialer.value && !showContinueQueueButton.value) {
    return 'Enter notes...'
  } else {
    return 'Reply to ARKON...' // Static text everywhere else
  }
}

const handleResendCode = (): void => {
  // Add user message
  addUserMessage('Resend Code')

  // Add AI response
  setTimeout(() => {
    const fm = formatPhoneNumber(enteredPhoneNumber.value)
    addAIMessage(`We've sent a new verification code to ${fm}. Please check your messages.`)
  }, 1000)
}

const handleTryAnotherNumber = (): void => {
  // Hide verification buttons
  showVerificationButtons.value = false

  // Add user message
  addUserMessage('Try Another Number')

  // Reset to phone entry step
  verificationStep.value = 'enter-phone'
  enteredPhoneNumber.value = ''
  verificationCodeTypingComplete.value = false // Reset typing state

  // Add AI response
  setTimeout(() => {
    addAIMessage('No problem! Please enter a different phone number you\'d like to use for verification.')

    // Focus the chat input after the AI message appears
    setTimeout(() => {
      if (chatInputRef.value && chatInputRef.value.focus) {
        chatInputRef.value.focus()
        console.log('Auto-focused chat input for try another number')
      } else {
        console.log('Chat input ref not available for try another number auto-focus')
      }
    }, 500)
  }, 1000)
}

const handleStartDialing = (): void => {
  startDialSession()
}

const onAudioCheckPassed = (): void => {
  showMicSpeakerCheck.value = false
  audioCheckPassed.value = true
  addUserMessage('Audio check success')
}

const formatPhoneNumber = (input: string): string => {
  if (!input) return input
  const digits = input.replace(/\D/g, '')
  const cleaned = digits.length >= 10 ? digits.slice(-10) : digits
  if (cleaned.length === 10) {
    const area = cleaned.slice(0, 3)
    const prefix = cleaned.slice(3, 6)
    const line = cleaned.slice(6)
    return `(${area}) ${prefix}-${line}`
  }
  return input
}

const selectCallerId = (choice: 'personal' | 'armor'): void => {
  if (choice === 'personal') {
    addUserMessage('Use Personal Caller ID')
  } else {
    addUserMessage('Use ARMOR® Number (Recommended)')
  }
  showCallerIdChoiceButtons.value = false
  showStartDialingButton.value = true
  audioCheckPassed.value = false
}

const startDialSession = (): void => {
  // Hide start dialing button
  showStartDialingButton.value = false

  // Reset queue completion state
  queueCompletionReady.value = false

  // Add user message showing what button was clicked
  addUserMessage('Start Dialing')

  // Show the dialer
  showDialer.value = true

  // Add AI response after a delay
  setTimeout(() => {
    addAIMessage('Starting your dialing session! Connecting you to your first contact...')

    // Add separator for the first call
    setTimeout(() => {
      addSeparatorMessage(currentContact.value.name)

      // Start the call simulation after showing separator
      setTimeout(() => {
        simulateCall()
      }, 500)
    }, 1000)
  }, 1000)
}

// Call simulation
let callTimer: number | null = null
let queueTimer: number | null = null
let callSimulationTimeout: number | null = null

const simulateCall = (): void => {
  // Contact index should already be set by handleNextContact or other functions

  // Reset manual hang up flag for new call
  isManualHangUp.value = false

  // Start ringing
  callState.value = 'ringing'

  // Start queue timer
  queueTimer = setInterval(() => {
    queueTime.value++
  }, 1000)

  // Check if this is George Sample (voicemail scenario)
  if (currentContact.value && currentContact.value.name === 'George Sample') {
    // Simulate ringing for 4-6 seconds then go to voicemail
    callSimulationTimeout = setTimeout(() => {
      // Check if queue is still active (not paused)
      if (queuePaused.value) {
        return // Don't proceed if queue is paused
      }

      // Call goes to voicemail - don't set as connected
      isManualHangUp.value = false // This is automatic, not manual
      callState.value = 'ended'
      showDispositionButtons.value = true
      totalCalls.value++

      // Add to call log with voicemail entry
      callLog.value.push({
        contact: currentContact.value.name,
        duration: '00:00', // No connection time for voicemail
        disposition: 'No Disposition Set',
        notes: ''
      })

      // Show combined voicemail message (no separate call ended message)
      addAIMessageWithTyping('Voicemail detected...<br><br>Please select a call outcome or enter notes about this call.')
      scrollToBottom()
    }, 4000)
  } else {
    // Regular call simulation for other contacts
    callSimulationTimeout = setTimeout(() => {
      // Check if queue is still active (not paused)
      if (queuePaused.value) {
        return // Don't proceed if queue is paused
      }

      // Contact answers
      callState.value = 'connected'
      callDuration.value = 0
      connectedCalls.value++

      // Start call duration timer
      callTimer = setInterval(() => {
        callDuration.value++
      }, 1000)

      // Show AI message that call connected
      // Show connection message first, then script with delay
      showCallConnectedMessages(currentContact.value)
    }, 3000)
  }
}

// Dialer Methods
const handleCallBack = (): void => {
  addAIMessage(`Calling ${currentContact.value.name} back on their number...`)
  simulateCall()
}

const handleNextContact = (): void => {
  // Stop current timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }

  // Reset disposition flag for new contact
  dispositionSet.value = false
  waitingForNotesInput.value = false
  currentDisposition.value = ''
  dispositionButtonClicked.value = false

  // Move to next contact
  if (currentContactIndex.value < contacts.length - 1) {
    currentContactIndex.value++

    callState.value = 'idle'
    callDuration.value = 0

    addUserMessage('Next contact')

    // Add separator message for the new contact
    setTimeout(() => {
      addSeparatorMessage(currentContact.value.name)
      scrollToBottom()

      // Start calling the next contact after showing separator
      setTimeout(() => {
        simulateCall()
      }, 1000)
    }, 1500)
  } else {
    addAIMessage('📋 All contacts have been processed. Dialing session complete!')
    showDialer.value = false
    scrollToBottom()

    // Stop queue timer
    if (queueTimer) {
      clearInterval(queueTimer)
      queueTimer = null
    }
  }
}

const handleHangUp = (): void => {
  // Set flag to indicate this was a manual hang up
  isManualHangUp.value = true

  // Add user message to show they hung up
  addUserMessage('Call ended')

  // Stop timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }

  callState.value = 'ended'
  showDispositionButtons.value = true
  totalCalls.value++

  // Add to call log with temporary entry (will be updated when disposition is set)
  const duration = `${Math.floor(callDuration.value / 60).toString().padStart(2, '0')}:${(callDuration.value % 60).toString().padStart(2, '0')}`
  callLog.value.push({
    contact: currentContact.value.name,
    duration: duration,
    disposition: 'No Disposition Set',
    notes: ''
  })

  // Only show coaching recap for manual hang ups and if AI Coach is enabled
  if (isManualHangUp.value && aiCoachEnabled.value) {
    // Get coach-specific recap title
    const getCoachRecapTitle = (): string => {
      const name = currentCoach.value?.displayName || 'Coach'
      const first = name.split(' ')[0]
      return `<strong>${first}'s Call Recap</strong>`
    }

    addAIMessageWithTyping([
      getCoachRecapTitle(),
      '<br>',
      getDynamicCoachingFeedback(),
      '<br>',
      'Delivery: 9/10<br>Pace: 9/10<br>Confidence: 9/10'
    ])
  }

  // Reset the flag
  isManualHangUp.value = false
}

const handleMute = (muted: boolean): void => {
  addUserMessage(muted ? 'Microphone muted' : 'Microphone unmuted')
}

const handleHold = (onHold: boolean): void => {
  addUserMessage(onHold ? 'Call placed on hold' : 'Call resumed')
}

const handleKeypad = (): void => {
  addAIMessage('�� Keypad opened')
}

const handlePauseQueue = (): void => {
  // Set paused state
  queuePaused.value = true

  // Stop timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
  if (queueTimer) {
    clearInterval(queueTimer)
    queueTimer = null
  }

  // Clear any pending call simulation timeout
  if (callSimulationTimeout) {
    clearTimeout(callSimulationTimeout)
    callSimulationTimeout = null
  }

  // Hide dialer and reset notes input state
  showDialer.value = false
  waitingForNotesInput.value = false

  addUserQueuePausedMessage('Queue paused')

  // Add session summary content to chat
  setTimeout(() => {
    addSessionSummaryToChat()
  }, 1000)
}

const closeSessionSummary = (): void => {
  showSessionSummary.value = false
}

// Handler for triggering file upload flow
const triggerFileUpload = (): void => {
  loadNewFile(queuePaused.value)
}

// Handler for export with animation
const handleExportFile = (): void => {
  // Find all export buttons and update them
  const exportButtons = document.querySelectorAll('button[onclick="handleExportFile()"]')
  exportButtons.forEach((button: Element) => {
    const btn = button as HTMLButtonElement
    btn.disabled = true
    btn.style.opacity = '0.7'
    btn.style.cursor = 'not-allowed'

    // Update icon and text
    const icon = btn.querySelector('i')
    if (icon) {
      icon.className = 'pi pi-spin pi-spinner'
      icon.style.animation = 'spin 1s linear infinite'
    }

    // Update text content
    const textNodes = Array.from(btn.childNodes).filter(node => node.nodeType === Node.TEXT_NODE)
    textNodes.forEach(node => {
      if (node.textContent?.includes('Export')) {
        node.textContent = ' Downloading...'
      }
    })
  })

  // After 2 seconds, show file upload interface
  setTimeout(() => {
    // Reset all export buttons
    exportButtons.forEach((button: Element) => {
      const btn = button as HTMLButtonElement
      btn.disabled = false
      btn.style.opacity = '1'
      btn.style.cursor = 'pointer'

      // Reset icon
      const icon = btn.querySelector('i')
      if (icon) {
        icon.className = 'pi pi-download'
        icon.style.animation = ''
      }

      // Reset text content
      const textNodes = Array.from(btn.childNodes).filter(node => node.nodeType === Node.TEXT_NODE)
      textNodes.forEach(node => {
        if (node.textContent?.includes('Downloading')) {
          node.textContent = ' Export Enriched File'
        }
      })
    })

    // Trigger file upload flow - preserve queue state if paused
    loadNewFile(queuePaused.value)
  }, 2000)
}

// Toggle function for Call Log collapse/expand
const toggleCallLog = (uniqueId?: string): void => {
  console.log('toggleCallLog called with ID:', uniqueId)
  const contentId = uniqueId ? `callLogContent_${uniqueId}` : 'callLogContent'
  const chevronId = uniqueId ? `callLogChevron_${uniqueId}` : 'callLogChevron'

  const content = document.getElementById(contentId)
  const chevron = document.getElementById(chevronId)

  console.log('content:', content, 'chevron:', chevron)

  if (content && chevron) {
    if (content.style.display === 'none') {
      content.style.display = 'block'
      chevron.style.transform = 'rotate(90deg)'
      console.log('Call log expanded')
    } else {
      content.style.display = 'none'
      chevron.style.transform = 'rotate(0deg)'
      console.log('Call log collapsed')
    }
  } else {
    console.error(`Could not find ${contentId} or ${chevronId} elements`)
  }
}

// Make functions globally accessible immediately
;(window as any).triggerFileUpload = triggerFileUpload
;(window as any).handleExportFile = handleExportFile
;(window as any).toggleCallLog = toggleCallLog

// Ensure functions are available on mount
onMounted(() => {
  // Global go-home event from Sidebar (fallback)
  window.addEventListener('arkon-go-home', goToMainApp)

  // Parse URL parameters for coach functionality and management modes
  const urlParams = new URLSearchParams(window.location.search)
  const coach = urlParams.get('coach')
  const createCoach = urlParams.get('create-coach')
  const coachAdmin = urlParams.get('coach-admin')
  const coachDashboard = urlParams.get('coach-dashboard')

  // Set coach if specified
  if (coach === 'all') {
    showCoachCarousel.value = true
    setCurrentCoach(null)
    console.log('Coach carousel mode enabled')
  } else if (coach) {
    setCurrentCoach(coach)
    console.log('Coach parameter detected:', coach)
  }

  // Show coach dashboard if requested
  if (coachDashboard) {
    showCoachDashboard.value = true
    dashboardCoachName.value = coachDashboard
    setCurrentCoach(coachDashboard)
  }

  // Set management mode based on URL parameters
  if (createCoach === 'true') {
    setManagementMode('create')
    console.log('Coach creation mode enabled')
  } else if (coachAdmin) {
    setManagementMode('admin')
    console.log('Coach admin mode enabled')
  }

  // Set the initial welcome message based on coach parameter
  if (messages.value.length > 0 && messages.value[0].type === 'ai') {
    if (showCoachCarousel.value) {
      messages.value[0].content = [
        'Welcome to ARKON by PhoneBurner.<br><br>I\'m here to help you call with confidence and close more deals.<br><br>Choose your sales coach first - everything from your scripts to follow-up strategies will be tailored to their winning approach.'
      ]
    } else {
      messages.value[0].content = [getCoachWelcomeMessage.value]
    }
  }

  ;(window as any).triggerFileUpload = triggerFileUpload
  ;(window as any).handleExportFile = handleExportFile
  ;(window as any).toggleCallLog = toggleCallLog
  console.log('Global functions assigned')
})

// Clean up global references when component is unmounted
onUnmounted(() => {
  delete (window as any).triggerFileUpload
  delete (window as any).handleExportFile
  delete (window as any).toggleCallLog
  window.removeEventListener('arkon-go-home', goToMainApp)
})

// Helper functions for session summary
const getCoachAvatarHtml = (): string => {
  if (currentCoach.value?.avatarUrl) {
    return `<img src="${currentCoach.value.avatarUrl}" alt="${currentCoach.value.displayName}" style="width: 18px; height: 18px; border-radius: 50%; object-fit: cover; margin-right: 8px;">`
  } else if (currentCoach.value) {
    const initials = currentCoach.value.displayName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
    return `<div style="width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, #60a5fa 0%, #7b68ee 100%); display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 10px; font-weight: bold; color: white;">${initials}</div>`
  }
  return '<i class="pi pi-check-circle" style="margin-right: 8px;"></i>'
}

const getCoachTitle = (): string => {
  return currentCoach.value ? `${currentCoach.value.displayName}'s Session Recap` : 'AI Coaching'
}

const addSessionSummaryToChat = (isCompleted: boolean = false): void => {
  // Create session summary content as HTML
  const title = isCompleted ? 'Queue Completed!' : 'Queue Paused!'
  const uniqueId = Date.now() // Create unique ID for this session summary
  const summaryHTML = `
    <div style="background-color: rgb(31, 41, 55); border-radius: 12px; padding: 16px; margin: 12px 0;">
      <h2 style="color: white; font-size: 24px; font-weight: 600; margin-bottom: 16px;">${title}</h2>
      ${isCompleted ? '<p style="color: rgb(209, 213, 219); font-size: 16px; margin-bottom: 32px;">Congratulations! You have completed your entire call queue. All contacts have been processed.</p>' : ''}

      <!-- Results & Next Steps Section - only show coaching if AI Coach is enabled -->
      ${aiCoachEnabled.value ? `
      <div style="margin-bottom: 32px;">
        <h3 style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center;">${getCoachAvatarHtml()}${getCoachTitle()}</h3>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px;">
          <div style="color: rgb(209, 213, 219); font-size: 14px; font-weight: normal; line-height: 1.5;">
            ${isCompleted ?
              `Outstanding work completing your queue! I observed some key strengths in your calling approach:<br><br>
               <div style="margin-left: 20px;">
                 <div style="margin-bottom: 16px;"><strong style="color: #fbbf24;"><i class="pi pi-check" style="margin-right: 8px;"></i>Strong opening rapport</strong> - You connected well with prospects and built trust quickly</div>
                 <div style="margin-bottom: 16px;"><strong style="color: #fbbf24;"><i class="pi pi-check" style="margin-right: 8px;"></i>Active listening</strong> - You picked up on buying signals and pain points effectively</div>
                 <div style="margin-bottom: 16px;"><strong style="color: #fbbf24;"><i class="pi pi-check" style="margin-right: 8px;"></i>Confident close attempts</strong> - You weren't afraid to ask for the appointment when the timing was right</div>
               </div>
               For your next session, focus on slowing down your pace slightly during objection handling—give prospects more time to process your responses. This will increase your conversion rate even further.<br><br>
               <button style="background-color: rgb(59, 130, 246); color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;" onclick="handleExportFile()">
                 <i class="pi pi-download"></i> Export Enriched File
               </button>` :
              `Great progress so far! I've been listening to your calls and here's my coaching feedback:<br><br>
               <div style="margin-left: 20px;">
                 <div style="margin-bottom: 16px;"><strong style="color: #fbbf24;"><i class="pi pi-check" style="margin-right: 8px;"></i>Energy and enthusiasm</strong> - Your positive tone is engaging prospects right from the start</div>
                 <div style="margin-bottom: 16px;"><strong style="color: #fbbf24;"><i class="pi pi-info-circle" style="margin-right: 8px;"></i>Opportunity area</strong> - Try asking more discovery questions before jumping into your pitch</div>
                 <div style="margin-bottom: 16px;"><strong style="color: #fbbf24;"><i class="pi pi-lightbulb" style="margin-right: 8px;"></i>Key insight</strong> - When you slow down and really listen, your closing rate increases significantly</div>
               </div>
               Take a quick break if needed, then get back in there! Your next few calls are primed for success—I can feel the momentum building.<br><br>
               <button style="background-color: rgb(59, 130, 246); color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;" onclick="handleExportFile()">
                 <i class="pi pi-download"></i> Export Enriched File
               </button>`
            }
          </div>
        </div>
      </div>
      ` : `
      <!-- Export button for when AI Coach is disabled -->
      <div style="margin-bottom: 32px;">
        <button style="background-color: rgb(59, 130, 246); color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;" onclick="handleExportFile()">
          <i class="pi pi-download"></i> Export Enriched File
        </button>
      </div>
      `}

      <!-- Call Log Section -->
      <div style="margin-top: 8px;">
        <div onclick="toggleCallLog('${uniqueId}')" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; color: white; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
          <span><i class="pi pi-list" style="margin-right: 8px;"></i>Call Log</span>
          <i id="callLogChevron_${uniqueId}" class="pi pi-chevron-right" style="transition: transform 0.2s ease;"></i>
        </div>
        <div id="callLogContent_${uniqueId}" style="display: none;">
          <!-- Statistics Cards -->
          ${(() => {
            const contactsLeft = contacts.length - currentContactIndex.value - 1;
            const showContactsLeft = !isCompleted && contactsLeft > 0;
            const gridCols = showContactsLeft ? 6 : 5;

            return `
            <div style="display: grid; grid-template-columns: repeat(${gridCols}, 1fr); gap: 8px; margin-bottom: 16px;">
              ${showContactsLeft ? `
              <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
                <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-users"></i> ${contactsLeft}</div>
                <div style="color: white; font-size: 11px; line-height: 1.2;">Contacts Left to Call</div>
              </div>` : ''}
              <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
                <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-users"></i> ${currentContactIndex.value + 1}</div>
                <div style="color: white; font-size: 11px; line-height: 1.2;">Contacts Dialed</div>
              </div>
              <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
                <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-phone"></i> ${totalCalls.value}</div>
                <div style="color: white; font-size: 11px; line-height: 1.2;">Total Calls Made</div>
              </div>
              <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
                <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-clock"></i> ${queueTime.value}s</div>
                <div style="color: white; font-size: 11px; line-height: 1.2;">Queue Duration</div>
              </div>
              <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
                <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-comments"></i> ${connectedCalls.value}</div>
                <div style="color: white; font-size: 11px; line-height: 1.2;">Connected Calls</div>
              </div>
              <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
                <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-step-forward"></i> ${skippedNumbers.value}</div>
                <div style="color: white; font-size: 11px; line-height: 1.2;">Skipped Numbers</div>
              </div>
            </div>`;
          })()}

          <div style="background-color: rgb(55, 65, 81); border-radius: 8px; overflow: hidden;">
            <!-- Table Header -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 16px; border-bottom: 1px solid rgb(75, 85, 99); background-color: rgb(45, 55, 72);">
              <div style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase;">CONTACT</div>
              <div style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase;">DURATION</div>
              <div style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase;">DISPOSITION</div>
              <div style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase;">NOTES</div>
            </div>
            <!-- Table Rows -->
            ${callLog.value.map(call => `
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 16px; border-bottom: 1px solid rgb(75, 85, 99);">
                <div style="color: white; font-size: 14px; font-weight: normal;">${call.contact}</div>
                <div style="color: white; font-size: 14px; font-weight: normal;">${call.duration}</div>
                <div style="color: white; font-size: 14px; font-weight: normal;">${call.disposition}</div>
                <div style="color: white; font-size: 14px; font-weight: normal;">${call.notes || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `

  addAIMessageWithoutScroll([summaryHTML])

  // Show action buttons for continuing or loading new file
  if (!shouldCompleteQueue.value) {
    showContinueQueueButton.value = true
  } else {
    // Show Load New File button when queue is completed (not in practice mode)
    showLoadNewFileButton.value = !isPracticeMode.value
  }
}

const continueQueue = (): void => {
  // Reset paused state
  queuePaused.value = false

  showSessionSummary.value = false
  showDialer.value = true
  showContinueQueueButton.value = false

  // Restart queue timer
  queueTimer = setInterval(() => {
    queueTime.value++
  }, 1000)

  addAIMessage('Resuming call queue where you left off.')
}

const startDialerFromPrompt = (): void => {
  addUserMessage("Yes let's call them now")
  showCallNowCta.value = false
  skipToDialer()
}

const sendFollowUpEmails = (): void => {
  addUserMessage('Send Follow-up Emails')
  // Hide any other CTAs
  showCallNowCta.value = false
  showNewLeadsCta.value = false
  showYesterdayNoAnswerCta.value = false
  showTodayFollowupsCta.value = false
  showHighAttemptsCta.value = false

  addAIMessageWithTyping([
    "What email drafts would you like use?"
  ])
  showEmailDraftsCta.value = true
}

const saveAsCallList = (): void => {
  addUserMessage('Save as Call List')
  showCallNowCta.value = false
  addAIMessage("Saved these leads as a new call list: 'Leads not called in 3 weeks'. You can open it from the Dialer.")
}

const dismissCallOptions = (): void => {
  addUserMessage('Not Now')
  showCallNowCta.value = false
  addAIMessage("Okay, I won't take action right now. Let me know when you're ready.")
}

// Handlers for Yesterday No-Answer CTA
const startFollowUpCalls = (): void => {
  addUserMessage('Start Follow-up Calls')
  showYesterdayNoAnswerCta.value = false
  skipToDialer()
}
const sendTextsToNoAnswers = (): void => {
  addUserMessage('Send Text Messages')
  showYesterdayNoAnswerCta.value = false
  addAIMessage("I'll prepare text messages for these contacts to increase your chances of connecting.")
}
const tryDifferentTime = (): void => {
  addUserMessage('Try at Different Time')
  showYesterdayNoAnswerCta.value = false
  addAIMessage("Okay, I'll suggest optimal times to try again based on recent pickup patterns.")
}
const skipTheseNoAnswers = (): void => {
  addUserMessage('Skip These')
  showYesterdayNoAnswerCta.value = false
  addAIMessage("Skipping these for now. You can revisit them anytime.")
}

// Handlers for New Leads CTA
const startNewLeadDialSession = (): void => {
  addUserMessage('Start New Lead Dial Session')
  showNewLeadsCta.value = false
  skipToDialer()
}

const sendWelcomeEmailsFirst = (): void => {
  addUserMessage('Send Welcome Emails First')
  showNewLeadsCta.value = false
  addAIMessage("I'll generate welcome emails for these new leads and queue them for your review.")
}

const scheduleForLater = (): void => {
  addUserMessage('Schedule for Later')
  showNewLeadsCta.value = false
  addAIMessage("Scheduled a new lead dial session for later. You can adjust in your Dialer settings.")
}

const dismissNewLeadOptions = (): void => {
  addUserMessage('Not Now')
  showNewLeadsCta.value = false
  addAIMessage("Okay, no action taken for now.")
}

// Handlers for Today's Follow-ups CTA
const callInOrderOfTime = (): void => {
  addUserMessage('Call in Order of Time')
  showTodayFollowupsCta.value = false
  skipToDialer()
}
const callHighestPriorityFirst = (): void => {
  addUserMessage('Call Highest Priority First')
  showTodayFollowupsCta.value = false
  addAIMessage("I'll prioritize follow-ups by urgency and likelihood to convert.")
}
const sendReminderEmails = (): void => {
  addUserMessage('Send Reminder Emails')
  showTodayFollowupsCta.value = false
  addAIMessage("Sending reminder emails to today’s follow-ups. You'll find drafts ready in your CRM.")
}
const rescheduleAllFollowups = (): void => {
  addUserMessage('Reschedule All')
  showTodayFollowupsCta.value = false
  addAIMessage("All follow-ups have been queued for rescheduling. Adjust times in your calendar settings.")
}

// Handlers for Email Drafts CTA (from 3-weeks prompt)
const sendSelectedEmails = (): void => {
  addUserMessage('Send Emails')
  showEmailDraftsCta.value = false
  const tmpl = selectedEmailTemplate.value || 'Selected Template'
  addAIMessage(`Sending '${tmpl}' emails to these contacts. You can review status in your CRM.`)
}
const saveEmailsForLater = (): void => {
  addUserMessage('Save For Later')
  showEmailDraftsCta.value = false
  const tmpl = selectedEmailTemplate.value || 'Selected Template'
  addAIMessage(`Saved '${tmpl}' email drafts for later. You can send them anytime from drafts.`)
}

// Handlers for High Attempts CTA
const switchToEmailHighAttempts = (): void => {
  addUserMessage('Switch to Email')
  showHighAttemptsCta.value = false
  addAIMessage("I'll prepare outreach emails for these contacts and move them to an email-first sequence.")
}
const trySmsInsteadHighAttempts = (): void => {
  addUserMessage('Try SMS Instead')
  showHighAttemptsCta.value = false
  addAIMessage("I will generate SMS drafts to attempt re-engagement via text.")
}
const tryDifferentTimesHighAttempts = (): void => {
  addUserMessage('Try Different Times')
  showHighAttemptsCta.value = false
  addAIMessage("I'll recommend alternative call windows based on historical pickup patterns.")
}
const moveToInactiveHighAttempts = (): void => {
  addUserMessage('Move to Inactive')
  showHighAttemptsCta.value = false
  addAIMessage("These contacts have been moved to Inactive. You can restore them anytime from settings.")
}

const skipToDialer = (): void => {
  // Hide Call Now CTA if visible
  showCallNowCta.value = false
  // Skip all setup steps and go directly to dialer for internal testing
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = true
  hasUploadedFile.value = true
  updateWelcomeMessageTyping() // Update typing status for welcome message
  showActionButtons.value = false
  showContactPreviewButtons.value = false
  showPhoneVerificationButton.value = false
  showStartDialingButton.value = false
  showDialer.value = true

  // Initialize dialer state
  callState.value = 'idle'
  currentContactIndex.value = 0

  // Clear messages and add dialer startup message
  messages.value = []
  addAIMessage('Dialer activated for testing! Starting first call...')

  // Set focus context for header
  nextTick(() => {
    if (headerRef.value?.establishFocusContext) {
      headerRef.value.establishFocusContext()
    }
  })

  // Automatically start a call after a brief delay
  setTimeout(() => {
    // Start the call simulation
    callState.value = 'ringing'
    currentContactIndex.value = 0 // Start with Sam Sample

    // Start queue timer
    queueTimer = setInterval(() => {
      queueTime.value++
    }, 1000)

    // Add call separator for first contact
    addSeparatorMessage(currentContact.value.name)

    // Simulate ringing for 3-5 seconds then connect
    setTimeout(() => {
      // Contact answers
      callState.value = 'connected'
      callDuration.value = 0
      connectedCalls.value++

      // Start call duration timer
      callTimer = setInterval(() => {
        callDuration.value++
      }, 1000)

      // Show AI message that call connected
      // Show connection message first, then script with delay
      showCallConnectedMessages(currentContact.value)
    }, 3000)
  }, 1500) // Brief delay to show the startup message
}

const loadNewFile = (preserveQueueState: boolean = false): void => {
  // Only reset queue state if not preserving it
  if (!preserveQueueState) {
    queuePaused.value = false
    queueCompletionReady.value = false
    showContinueQueueButton.value = false

    // Reset all state
    currentContactIndex.value = 0
    callState.value = 'idle'
    callDuration.value = 0
    queueTime.value = 0
    totalCalls.value = 0
    connectedCalls.value = 0
    callLog.value = []
  }

  showSessionSummary.value = false
  showDialer.value = false
  hasUploadedFile.value = false
  showLoadNewFileButton.value = false // Hide the Load New File button

  // Show file upload component for new file only if not preserving queue state and not already visible
  if (!preserveQueueState && !showFileUploadForReturningUser.value) {
    addAIMessage('Ready to load a new file. Please upload your contact list to start a new dialing session.')
    showFileUploadForReturningUser.value = true
  }
}

const exportFile = (): void => {
  addAIMessage('Exporting your enriched contact file with Connect Scores and call results...')
}

const handleCompleteQueue = (): void => {
  // Stop timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
  if (queueTimer) {
    clearInterval(queueTimer)
    queueTimer = null
  }

  // Hide dialer and reset notes input state
  showDialer.value = false
  waitingForNotesInput.value = false

  // Add user message for queue completion with custom positioning
  addUserQueueCompletedMessage('Queue completed')

  // Add session summary content to chat after a delay
  setTimeout(() => {
    addSessionSummaryToChat(true)
    // Show Load New File button (not in practice mode)
    showLoadNewFileButton.value = !isPracticeMode.value
  }, 500)
}

const handleAICoachToggle = (enabled: boolean): void => {
  aiCoachEnabled.value = enabled
}

const handleDisposition = (disposition: string): void => {
  // Hide disposition buttons
  showDispositionButtons.value = false

  // Mark that a disposition button was clicked
  dispositionButtonClicked.value = true

  // Store the disposition for later use
  currentDisposition.value = disposition

  // Update the last call log entry with the disposition
  if (callLog.value.length > 0) {
    const lastCall = callLog.value[callLog.value.length - 1]
    lastCall.disposition = disposition
  }

  // Add user message showing what disposition was selected
  addUserMessage(disposition)

  // Set disposition flag to enable next button immediately (notes are optional)
  dispositionSet.value = true

  // Set flag to wait for notes input
  waitingForNotesInput.value = true

  // Add AI response prompting for notes
  setTimeout(() => {
    addAIMessageWithTyping('Great! Now please enter any notes about this call or continue to the next call.')

    // Focus the chat input for notes
    setTimeout(() => {
      if (chatInputRef.value && chatInputRef.value.focus) {
        chatInputRef.value.focus()
        console.log('Auto-focused chat input for notes entry')
      } else {
        console.log('Chat input ref not available for notes auto-focus')
      }
    }, 500)

    scrollToBottom()
  }, 1000)
}

// Signup Methods
const handleGoogleSignup = () => {
  // Show terms modal for new Google signup users
  showTermsModal.value = true
}

const handleEmailSignup = () => {
  currentPage.value = 'signup'

  // Clear any existing focus when navigating to signup page
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
  })
}

const handleSignupSubmit = () => {
  // Show terms modal for signup flow
  showTermsModal.value = true
}

const switchToSignin = () => {
  showAccountCreation.value = false
  currentPage.value = 'signup'

  // Clear any existing focus when navigating to signup page
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
  })
}

// Terms Modal Methods
const closeTermsModal = () => {
  showTermsModal.value = false
}

const handleTermsCancel = () => {
  closeTermsModal()
  // Take user back to the start (welcome page)
  currentPage.value = 'main'
  isSignedIn.value = false
  isReturningUser.value = false
  showActionButtons.value = false
  // Clear messages and show welcome message
  messages.value = []
  addAIMessage('���� Welcome to ARKON! I\'m your AI calling assistant. I\'ll help you connect with more prospects and close more deals. What would you like to accomplish today?')

  // Set focus context for header
  nextTick(() => {
    if (headerRef.value?.establishFocusContext) {
      headerRef.value.establishFocusContext()
    }
  })
}

const handleTermsAgree = () => {
  closeTermsModal()
  // Show pricing page after terms agreement
  showPricingPage.value = true
}

// Pricing Page Methods
const closePricingPage = () => {
  showPricingPage.value = false
}

const showPaymentFromPricing = () => {
  showPricingPage.value = false
  showPaymentPage.value = true
}

const closePaymentPage = () => {
  showPaymentPage.value = false
  showPricingPage.value = true
}

const handlePurchaseCompleted = () => {
  // Close payment page and complete signup flow
  showPaymentPage.value = false
  showPricingPage.value = false
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = false // This is a new user

  // Ensure the initial welcome bubble does not retype
  if (messages.value.length > 0 && messages.value[0].type === 'ai') {
    messages.value[0].typing = false
  }

  // Reset congratulations typing completion and action buttons used state
  congratulationsTypingComplete.value = false
  actionButtonsUsed.value = false
  showCreateAccountCTA.value = false

  // Stop any pending 'create an account' typing bubbles (CRM/connect or upload)
  messages.value.forEach((m: any) => {
    if (m?.type === 'ai' && m?.typing && Array.isArray(m.content) && m.content.join(' ').toLowerCase().includes('create an account')) {
      m.typing = false
    }
  })

  // Add user message confirming account creation and upgrade
  addUserMessage('Account created & upgraded')

  // Pin this flow to top like goals: maintain top position and add AI without auto-scroll
  const maintainTop = () => {
    scrollToTopForGoals()
  }
  const maintainer = setInterval(maintainTop, 300)

  setTimeout(() => {
    // One more forced top position before adding AI response
    scrollToTopForGoals()
    addAIMessageWithTypingNoScroll('Congratulations! You\'ve successfully upgraded to the Pro plan and have unlimited access to all features.<br><br>To help us understand what your goals are, what are you trying to accomplish?')
    // Stop maintaining after typing starts
    setTimeout(() => clearInterval(maintainer), 2000)
  }, 500)
}

const handleUpgradeSelected = () => {
  closePricingPage()
  isSignedIn.value = true
  showActionButtons.value = true
  addAIMessage('�� Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session! What are you trying to accomplish?')

  // Ensure scroll happens after action buttons are rendered
  setTimeout(() => {
    scrollToBottom()
  }, 500)
}

// Account Creation Methods
const closeAccountCreation = () => {
  showAccountCreation.value = false
}

const handleAccountCreated = (accountData: any) => {
  closeAccountCreation()
  isSignedIn.value = true
  showActionButtons.value = true
  updateWelcomeMessageTyping() // Update typing status for welcome message
  addAIMessage('🎉 Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session! What are you trying to accomplish?')

  // Ensure scroll happens after action buttons are rendered
  setTimeout(() => {
    scrollToBottom()
  }, 500)
}

const showTermsFromAccount = () => {
  showAccountCreation.value = false
  showTermsModal.value = true
}

const handleGoogleSignupFromAccount = () => {
  closeAccountCreation()
  addAIMessage('<i class="pi pi-rocket"></i> Great choice! Setting up your Google account integration...')
  setTimeout(() => {
    isSignedIn.value = true
    showActionButtons.value = true
    updateWelcomeMessageTyping() // Update typing status for welcome message
    addAIMessage('����� Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session! What are you trying to accomplish?')

    // Ensure scroll happens after action buttons are rendered
  setTimeout(() => {
    scrollToBottom()
  }, 500)
  }, 2000)
}

// Action Button Methods
const handleActionButton = (action: string): void => {
  // Hide action buttons after selection and mark as used
  showActionButtons.value = false
  actionButtonsUsed.value = true
  // Reset contact preview typing state for new message
  contactPreviewTypingComplete.value = false
  contactPreviewButtonsUsed.value = false
  // Hide contact preview buttons initially - they'll show after typing completes
  showContactPreviewButtons.value = false
  
  // Add user message showing their selection
  addUserGoalMessage(`I want to ${action.toLowerCase()}`)

  // Maintain scroll position for goal message even during AI response
  const maintainGoalPosition = () => {
    scrollToTopForGoals()
  }

  // Set up periodic maintenance of scroll position
  const scrollMaintainer = setInterval(maintainGoalPosition, 300)

  // Wait for user message scroll to complete, then add AI response
  setTimeout(() => {
      let response = []
      const sampleContacts = `
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
        </div>`

      switch (action) {
      case 'Set Appointments':
        response = [
          'Perfect! Setting appointments is our bread and butter. We\'ll help you fill your calendar.<br><br>I\'ve analyzed your <strong style=\"color: #fbbf24;\">156 contacts</strong> and checked phone numbers with Connect Score.<br><br>Here\'s a preview of your data. Does this look correct?<br><br>',
          sampleContacts
        ]
        break
      case 'Close Live Sales':
        response = [
          'Outstanding! Closing live sales is where the magic happens. We\'ll get you connected with your hottest prospects.',
          '',
          'Your trial is ready! I\'ve analyzed your <strong style="color: #fbbf24;">156 contacts</strong> and prioritized those ready to buy with Connect Score.',
          'Here\'s a preview of your highest-intent prospects. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Create Opportunities':
        response = [
          'Perfect! Creating opportunities is all about finding the right prospects at the right time. We\'ll build your pipeline.',
          '',
          'Your trial is ready! I\'ve analyzed your <strong style="color: #fbbf24;">156 contacts</strong> and identified potential opportunities with Connect Score.',
          'Here\'s a preview of your warmest leads. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Set Follow Ups':
        response = [
          'Smart choice! Follow-ups are where deals are won. We\'ll help you reconnect with precision timing.',
          '',
          'Your trial is ready! I\'ve analyzed your <strong style="color: #fbbf24;">156 contacts</strong> and optimized follow-up timing with Connect Score.',
          'Here\'s a preview of your follow-up targets. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Make Live Transfers':
        response = [
          'Brilliant! Live transfers maximize your team\'s efficiency. We\'ll connect you with prospects ready to talk.',
          '',
          'Your trial is ready! I\'ve analyzed your <strong style="color: #fbbf24;">156 contacts</strong> and identified transfer-ready prospects with Connect Score.',
          'Here\'s a preview of your transfer candidates. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Live Conversations':
        response = [
          'Fantastic! Live conversations are the heart of great sales. We\'ll get you talking to the right people.',
          '',
          'Your trial is ready! I\'ve analyzed your <strong style="color: #fbbf24;">156 contacts</strong> and found conversation-ready prospects with Connect Score.',
          'Here\'s a preview of your best conversation targets. Does this look correct?',
          sampleContacts
        ]
        break
      default:
        response = [`I\'ll help you with ${action.toLowerCase()}. Let me prepare your optimal calling strategy.`]
      }

      // Force scroll position one more time before AI response
      scrollToTopForGoals()

      addAIMessageWithTypingNoScroll(response)

      // Stop maintaining scroll position after AI response starts
      setTimeout(() => {
        clearInterval(scrollMaintainer)
      }, 2000)

      // Contact preview buttons will be shown automatically when typing completes
  }, 1500) // Increased delay to ensure user message scroll completes
}

// Coach Management Methods
const handleCoachCreated = async (coachData: any) => {
  try {
    const newCoach = await addCoach(coachData)
    const newUrl = generateCoachUrl(newCoach.name)
    setTimeout(() => {
      window.location.href = newUrl
    }, 100)
  } catch (error) {
    console.error('Error creating coach:', error)
  }
}

const handleCoachModalClose = () => {
  // Simply set management mode to null for testing
  setManagementMode(null)
}

// Lifecycle hook to establish focus context when app loads
onMounted(() => {
  // Give the app time to fully render, then establish focus context by mimicking header click
  setTimeout(() => {
    if (headerRef.value && headerRef.value.establishFocusContext) {
      headerRef.value.establishFocusContext()
      console.log('Focus context established by mimicking header click')
    }
  }, 500)
})
</script>

<style scoped>
/* Message bubble text styling */
.message-bubble p {
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.message-bubble p:last-child {
  margin-bottom: 0;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 480px) {
  .grid-cols-3 {
    grid-template-columns: repeat(1, 1fr) !important;
  }
}

/* Custom PrimeVue overrides */
::deep(.p-fileupload) {
  background: transparent;
  border: none;
}

::deep(.p-fileupload-buttonbar) {
  display: none;
}

::deep(.p-fileupload-content) {
  background: transparent;
  border: none;
  padding: 0;
}

.email-drafts-listbox :deep(.p-listbox-option.p-listbox-option-selected) {
  background-color: var(--p-blue-700);
  color: var(--p-surface-0);
}
.email-drafts-listbox :deep(.p-listbox-option:hover) {
  background-color: var(--p-blue-900);
  color: var(--p-surface-0);
}

</style>
