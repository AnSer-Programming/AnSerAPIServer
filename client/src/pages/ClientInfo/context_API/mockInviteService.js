// client/src/pages/ClientInfo/context_API/mockInviteService.js
// A small mock invite service to simulate server responses. Replace with real fetch calls later.

// Mutable in-memory store for mock invites. Intended for local/testing only.
let MOCK_INVITES = {
  'mock-token-123': {
    clientId: 'client-abc',
    targetStep: 'company-info',
    inviterName: 'Demo Admin',
    message: 'Please review your Answer Calls settings',
    formData: {
      companyInfo: { businessName: 'Main Street Pediatrics' },
      answerCalls: {
        routine: { useStandard: true, custom: '', guidelines: '' },
        urgent: { useStandard: true, custom: '', guidelines: '' },
        callTypes: [],
      },
    },
  },
  'mock-token-review': {
    clientId: 'client-xyz',
    targetStep: 'review',
    inviterName: 'Demo Admin',
    message: 'Please review and submit',
    formData: {},
  },
};

function makeToken() {
  // simple non-cryptographic token for local testing
  return `mock-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}

export async function createMockInvite({ clientId = 'client-local', targetStep = 'start', inviterName = '', message = '', formData = {}, expiresAt = null }) {
  const token = makeToken();
  MOCK_INVITES[token] = { clientId, targetStep, inviterName, message, formData, expiresAt };
  // simulate latency
  await new Promise((r) => setTimeout(r, 120));
  return { ok: true, token, data: MOCK_INVITES[token] };
}

export function listMockInvites() {
  return { ...MOCK_INVITES };
}

export async function getInviteByToken(token) {
  // Simulate server latency
  await new Promise((r) => setTimeout(r, 350));

  // Return mock invite if exists
  if (MOCK_INVITES[token]) {
    return { ok: true, data: MOCK_INVITES[token] };
  }
  return { ok: false, status: 404, error: 'Not found' };

  // Example real fetch (commented):
  /*
  const res = await fetch(`/api/wizard/invite/${token}`);
  if (!res.ok) return { ok: false, status: res.status, error: await res.text() };
  const data = await res.json();
  return { ok: true, data };
  */
}

export async function getWizardStateByClientId(clientId, token) {
  // Simulate fetch of server-stored wizard state
  await new Promise((r) => setTimeout(r, 250));
  // In this mock we return empty or the formData from the invite for demo
  // In real usage you'd fetch by clientId or by token on server
  return { ok: true, data: { formData: {}, visitedSteps: [] } };

  // Example real fetch (commented):
  /*
  const res = await fetch(`/api/wizard/state?clientId=${clientId}&token=${token}`);
  if (!res.ok) return { ok: false, status: res.status };
  const data = await res.json();
  return { ok: true, data };
  */
}
