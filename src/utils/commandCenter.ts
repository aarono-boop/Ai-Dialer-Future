export type Status = 'green' | 'yellow' | 'red'

export interface Kpi {
  label: string
  value: string | number
}

export interface ModuleSignal {
  name: string
  value: any
}

export interface ModuleState {
  key: string
  name: string
  category: 'Configuration' | 'Deliverability' | 'Compliance' | 'Productivity' | 'Billing' | 'Analytics'
  icon: string // primeicon class
  lastUpdated: string // ISO string
  kpis: Kpi[]
  signals: Record<string, any>
  status: Status
  statusReason: string
}

// Reasonable defaults/thresholds (assumptions documented in code)
const THRESHOLDS = {
  armor: {
    spamLabelIncidenceRed: 0.15, // 15% of active numbers with spam labels => red
    spamLabelIncidenceYellow: 0.05,
    reputationTarget: 70, // out of 100
  },
  email: {
    spamRateRed: 0.05, // 5%+ spam complaints => red
    spamRateYellow: 0.02,
    deliverabilityTarget: 0.9,
  },
  integrations: {
    syncFreshHours: 24,
  },
  businessVerification: {
    maxAgeDays: 365,
  },
}

export const formatDate = (d: Date) => d.toISOString()

export function computeStatus(key: string, signals: Record<string, any>): { status: Status; reason: string } {
  switch (key) {
    case 'businessVerification': {
      const started = !!signals.started
      const verified = !!signals.verified
      const failed = !!signals.failed
      const verifiedAt = signals.verifiedAt ? new Date(signals.verifiedAt) : null
      if (failed || !started) return { status: 'red', reason: failed ? 'Verification failed' : 'Verification not started' }
      if (!verified) return { status: 'yellow', reason: 'Verification pending' }
      if (verifiedAt) {
        const ageDays = (Date.now() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24)
        if (ageDays > THRESHOLDS.businessVerification.maxAgeDays) {
          return { status: 'yellow', reason: 'Verification stale (>365 days)' }
        }
      }
      return { status: 'green', reason: 'Verified and current' }
    }
    case 'armorStrategy': {
      const stirShaken = !!signals.stirShaken
      const spamIncidence = Number(signals.spamLabelIncidence ?? 0) // 0..1
      const reputation = Number(signals.reputation ?? 0) // 0..100
      if (!stirShaken || spamIncidence >= THRESHOLDS.armor.spamLabelIncidenceRed) return { status: 'red', reason: !stirShaken ? 'ARMOR not activated' : 'High spam label incidence' }
      if (spamIncidence >= THRESHOLDS.armor.spamLabelIncidenceYellow || reputation < THRESHOLDS.armor.reputationTarget) return { status: 'yellow', reason: spamIncidence >= THRESHOLDS.armor.spamLabelIncidenceYellow ? 'Some numbers flagged as spam' : 'Reputation below target' }
      return { status: 'green', reason: 'All numbers pass checks and reputation on target' }
    }
    case 'voicemailDrops': {
      const templateApproved = !!signals.templateApproved
      const consentDocumented = !!signals.consentDocumented
      const deliverability = Number(signals.deliverability ?? 0)
      if (!templateApproved || !consentDocumented) return { status: 'red', reason: !templateApproved ? 'No approved template' : 'Consent missing' }
      if (deliverability < 0.85) return { status: 'yellow', reason: 'Deliverability below benchmark' }
      return { status: 'green', reason: 'Approved templates and healthy deliverability' }
    }
    case 'integrations': {
      const authOk = !!signals.authOk
      const mappingComplete = !!signals.mappingComplete
      const lastSyncAt = signals.lastSyncAt ? new Date(signals.lastSyncAt) : null
      if (!authOk || !mappingComplete) return { status: 'red', reason: !authOk ? 'CRM auth failed' : 'Field mappings missing' }
      if (!lastSyncAt) return { status: 'yellow', reason: 'No recent sync' }
      const hours = (Date.now() - lastSyncAt.getTime()) / (1000 * 60 * 60)
      if (hours > THRESHOLDS.integrations.syncFreshHours) return { status: 'yellow', reason: 'Sync stale (>24h)' }
      return { status: 'green', reason: 'Sync healthy in last 24h' }
    }
    case 'emailSetup': {
      const spf = !!signals.spf
      const dkim = !!signals.dkim
      const dmarc = !!signals.dmarc
      const warmupComplete = !!signals.warmupComplete
      const spamRate = Number(signals.spamRate ?? 0)
      const deliverability = Number(signals.deliverability ?? 0)
      if (!spf || !dkim || !dmarc) return { status: 'red', reason: 'SPF/DKIM/DMARC not valid' }
      if (!warmupComplete || spamRate > THRESHOLDS.email.spamRateYellow || deliverability < THRESHOLDS.email.deliverabilityTarget) return { status: 'yellow', reason: !warmupComplete ? 'Warmup incomplete' : spamRate > THRESHOLDS.email.spamRateYellow ? 'Spam rate elevated' : 'Deliverability below target' }
      return { status: 'green', reason: 'All records valid and deliverability healthy' }
    }
    case 'numberManagement': {
      const poolSize = Number(signals.poolSize ?? 0)
      const localPresence = !!signals.localPresence
      const activeNumbers = Number(signals.activeNumbers ?? 0)
      if (!localPresence || poolSize === 0 || activeNumbers === 0) return { status: 'red', reason: !localPresence ? 'Local presence off' : 'No active/pool numbers' }
      if (poolSize < 5) return { status: 'yellow', reason: 'Small pool may affect connect rates' }
      return { status: 'green', reason: 'Balanced pool and local presence enabled' }
    }
    case 'cadences': {
      const active = Number(signals.active ?? 0)
      const stale = Number(signals.stale ?? 0)
      if (active === 0) return { status: 'red', reason: 'No active sequences' }
      if (stale > 0) return { status: 'yellow', reason: 'Some sequences stale' }
      return { status: 'green', reason: 'Healthy cadence coverage' }
    }
    case 'callScripts': {
      const approved = Number(signals.approved ?? 0)
      const outdated = Number(signals.outdated ?? 0)
      if (approved === 0) return { status: 'red', reason: 'No approved scripts' }
      if (outdated > 0) return { status: 'yellow', reason: 'Scripts need refresh' }
      return { status: 'green', reason: 'Scripts current and approved' }
    }
    case 'compliance': {
      const dncSynced = !!signals.dncSynced
      const tcpaGuard = !!signals.tcpaGuard
      const policyAck = !!signals.policyAck
      if (!dncSynced || !tcpaGuard) return { status: 'red', reason: !dncSynced ? 'DNC not synced' : 'TCPA guardrails off' }
      if (!policyAck) return { status: 'yellow', reason: 'Policy not acknowledged' }
      return { status: 'green', reason: 'Compliance checks in place' }
    }
    case 'analytics': {
      const goalsSet = !!signals.goalsSet
      const pickup = Number(signals.pickup ?? 0)
      if (!goalsSet) return { status: 'yellow', reason: 'Goals not set' }
      if (pickup < 0.15) return { status: 'yellow', reason: 'Pickup below target' }
      return { status: 'green', reason: 'Tracking goals and KPIs' }
    }
    case 'billing': {
      const methodOnFile = !!signals.methodOnFile
      const pastDue = !!signals.pastDue
      if (pastDue || !methodOnFile) return { status: 'red', reason: pastDue ? 'Past due invoice' : 'No payment method on file' }
      return { status: 'green', reason: 'Billing healthy' }
    }
    case 'sms': {
      const registered = !!signals.registered
      const optInPolicy = !!signals.optInPolicy
      const deliverability = Number(signals.deliverability ?? 0)
      if (!registered || !optInPolicy) return { status: 'red', reason: !registered ? '10DLC registration missing' : 'Opt-in policy missing' }
      if (deliverability < 0.9) return { status: 'yellow', reason: 'Deliverability below target' }
      return { status: 'green', reason: 'Registered with healthy deliverability' }
    }
    default:
      return { status: 'yellow', reason: 'Status not defined' }
  }
}

export function seedModules(now = new Date()): ModuleState[] {
  const ts = formatDate(now)
  const list: ModuleState[] = [
    {
      key: 'businessVerification',
      name: 'Business Verification',
      category: 'Compliance',
      icon: 'pi pi-verified',
      lastUpdated: ts,
      signals: { started: true, verified: false, failed: false },
      kpis: [
        { label: 'Status', value: 'Pending' },
        { label: 'Docs', value: '2/3' }
      ],
      status: 'yellow',
      statusReason: 'Verification pending'
    },
    {
      key: 'armorStrategy',
      name: 'Armor Strategy',
      category: 'Deliverability',
      icon: 'pi pi-shield',
      lastUpdated: ts,
      signals: { stirShaken: false, spamLabelIncidence: 0.12, reputation: 62 },
      kpis: [
        { label: "#'s Protected", value: '0/5' }
      ],
      status: 'red',
      statusReason: 'STIR/SHAKEN not configured'
    },
    {
      key: 'voicemailDrops',
      name: 'Voicemail Drops',
      category: 'Productivity',
      icon: 'pi pi-volume-down',
      lastUpdated: ts,
      signals: { templateApproved: false, consentDocumented: false, deliverability: 0.92 },
      kpis: [
        { label: 'Deliverability', value: '92%' },
      ],
      status: 'red',
      statusReason: 'No approved template'
    },
    {
      key: 'integrations',
      name: 'Integrations',
      category: 'Configuration',
      icon: 'pi pi-sitemap',
      lastUpdated: ts,
      signals: { authOk: true, mappingComplete: true, lastSyncAt: ts },
      kpis: [
        { label: 'Last Sync', value: 'Just now' },
      ],
      status: 'red',
      statusReason: 'Field mappings missing'
    },
    {
      key: 'emailSetup',
      name: 'Email Setup',
      category: 'Deliverability',
      icon: 'pi pi-at',
      lastUpdated: ts,
      signals: { spf: true, dkim: false, dmarc: false, warmupComplete: false, spamRate: 0.03, deliverability: 0.86 },
      kpis: [
        { label: 'Deliverability', value: '86%' },
      ],
      status: 'red',
      statusReason: 'SPF/DKIM/DMARC not valid'
    },
    {
      key: 'numberManagement',
      name: 'Number Management',
      category: 'Configuration',
      icon: 'pi pi-hashtag',
      lastUpdated: ts,
      signals: { poolSize: 6, localPresence: true, activeNumbers: 6 },
      kpis: [
        { label: 'Pool', value: 6 },
        { label: 'Local Presence', value: 'On' },
      ],
      status: 'yellow',
      statusReason: 'Small pool may affect connect rates'
    },
    {
      key: 'cadences',
      name: 'Cadences/Sequences',
      category: 'Productivity',
      icon: 'pi pi-list-check',
      lastUpdated: ts,
      signals: { active: 2, stale: 1 },
      kpis: [
        { label: 'Active', value: 2 },
        { label: 'Stale', value: 1 },
      ],
      status: 'yellow',
      statusReason: 'Some sequences stale'
    },
    {
      key: 'callScripts',
      name: 'Call Scripts & Agent Assist',
      category: 'Productivity',
      icon: 'pi pi-microphone',
      lastUpdated: ts,
      signals: { approved: 2, outdated: 0 },
      kpis: [
        { label: 'Approved', value: 2 },
      ],
      status: 'red',
      statusReason: 'No approved scripts'
    },
    {
      key: 'compliance',
      name: 'Compliance (DNC/TCPA)',
      category: 'Compliance',
      icon: 'pi pi-lock',
      lastUpdated: ts,
      signals: { dncSynced: true, tcpaGuard: false, policyAck: false },
      kpis: [
        { label: 'DNC', value: 'Synced' },
      ],
      status: 'red',
      statusReason: 'TCPA guardrails off'
    },
    {
      key: 'analytics',
      name: 'Analytics & Goals',
      category: 'Analytics',
      icon: 'pi pi-chart-line',
      lastUpdated: ts,
      signals: { goalsSet: true, pickup: 0.18 },
      kpis: [
        { label: 'Pickup', value: '18%' },
      ],
      status: 'yellow',
      statusReason: 'Goals not set'
    },
    {
      key: 'billing',
      name: 'Billing & Payments',
      category: 'Billing',
      icon: 'pi pi-credit-card',
      lastUpdated: ts,
      signals: { methodOnFile: false, pastDue: false },
      kpis: [
        { label: 'Plan', value: 'Trial' },
      ],
      status: 'red',
      statusReason: 'No payment method on file'
    },
    {
      key: 'sms',
      name: 'SMS',
      category: 'Deliverability',
      icon: 'pi pi-send',
      lastUpdated: ts,
      signals: { registered: true, optInPolicy: true, deliverability: 0.92 },
      kpis: [
        { label: 'Deliverability', value: '92%' },
      ],
      status: 'red',
      statusReason: '10DLC registration missing'
    },
  ]

  // Ensure statuses are computed from signals
  return list.map(m => {
    const { status, reason } = computeStatus(m.key, m.signals)
    return { ...m, status, statusReason: reason }
  })
}

export function applyActions(key: string, signals: Record<string, any>, actions: string[]): Record<string, any> {
  const s = { ...signals }
  // Simplified effects of actions; each action mutates signals safely
  actions.forEach(a => {
    switch (key) {
      case 'armorStrategy':
        if (a === 'Enable STIR/SHAKEN') s.stirShaken = true
        if (a === 'Rotate flagged numbers') s.spamLabelIncidence = Math.max(0, (s.spamLabelIncidence ?? 0) - 0.08)
        if (a === 'Improve reputation blend') s.reputation = Math.min(100, (s.reputation ?? 0) + 15)
        break
      case 'emailSetup':
        if (a === 'Validate SPF') s.spf = true
        if (a === 'Validate DKIM') s.dkim = true
        if (a === 'Enable DMARC (p=quarantine)') s.dmarc = true
        if (a === 'Complete warmup') s.warmupComplete = true
        if (a === 'Reduce spam rate') s.spamRate = Math.max(0, (s.spamRate ?? 0) - 0.02)
        if (a === 'Optimize deliverability') s.deliverability = Math.min(1, (s.deliverability ?? 0) + 0.08)
        break
      case 'integrations':
        if (a === 'Fix field mappings') s.mappingComplete = true
        if (a === 'Reconnect CRM') s.authOk = true
        if (a === 'Force sync') s.lastSyncAt = formatDate(new Date())
        break
      case 'voicemailDrops':
        if (a === 'Approve template') s.templateApproved = true
        if (a === 'Document consent') s.consentDocumented = true
        if (a === 'Improve deliverability') s.deliverability = Math.min(1, (s.deliverability ?? 0) + 0.05)
        break
      case 'numberManagement':
        if (a === 'Enable local presence') s.localPresence = true
        if (a === 'Increase pool size') s.poolSize = (s.poolSize ?? 0) + 3
        if (a === 'Activate numbers') s.activeNumbers = Math.max((s.activeNumbers ?? 0), 5)
        break
      case 'cadences':
        if (a === 'Activate sequences') s.active = Math.max((s.active ?? 0), 3)
        if (a === 'Refresh stale sequences') s.stale = 0
        break
      case 'callScripts':
        if (a === 'Approve scripts') s.approved = Math.max((s.approved ?? 0), 2)
        if (a === 'Update outdated scripts') s.outdated = 0
        break
      case 'compliance':
        if (a === 'Sync DNC') s.dncSynced = true
        if (a === 'Enable TCPA guardrails') s.tcpaGuard = true
        if (a === 'Acknowledge policy') s.policyAck = true
        break
      case 'billing':
        if (a === 'Add payment method') s.methodOnFile = true
        if (a === 'Resolve past due') s.pastDue = false
        break
      case 'sms':
        if (a === 'Register 10DLC') s.registered = true
        if (a === 'Add opt-in policy') s.optInPolicy = true
        if (a === 'Improve SMS deliverability') s.deliverability = Math.min(1, (s.deliverability ?? 0) + 0.08)
        break
      case 'businessVerification':
        if (a === 'Start verification') s.started = true
        if (a === 'Submit documents') s.started = true
        if (a === 'Verify business') { s.verified = true; s.verifiedAt = formatDate(new Date()) }
        if (a === 'Clear failure') s.failed = false
        break
    }
  })
  return s
}
