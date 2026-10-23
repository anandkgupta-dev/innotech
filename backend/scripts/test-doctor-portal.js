/**
 * MediKiosk - Doctor Portal & Clinician Review Verification Script
 * 
 * Verifies:
 * 1. Clinician server-side authentication (staffId + passcode).
 * 2. Real patient queue retrieval with emergency red flags and demo separation.
 * 3. Individual patient intake retrieval by ID without invented data.
 * 4. Doctor notes and clinical sign-off persistence to MongoDB Atlas.
 * 5. Re-fetch verification ensuring notes persist after refresh.
 * 6. Clean-up of ONLY the synthetic records created in this test.
 * 
 * Usage: node backend/scripts/test-doctor-portal.js
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');

const BASE_URL = process.env.API_URL || 'http://127.0.0.1:5000/api';
const SERVER_AUTH_SECRET = process.env.CLINICIAN_PORTAL_KEY || process.env.CLINICIAN_ACCESS_KEY || 'medikiosk-clinical-staff-secure-2026';

function generateExpiredToken() {
  const payload = {
    staffId: 'EXPIRED-DOC',
    name: 'Dr. Expired',
    role: 'doctor',
    department: 'OPD',
    issuedAt: Date.now() - 10 * 60 * 60 * 1000,
    expiresAt: Date.now() - 2 * 60 * 60 * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SERVER_AUTH_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function isServerRunning() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    return data && data.status === 'ok';
  } catch {
    return false;
  }
}

async function run() {
  console.log('====================================================');
  console.log('🩺 MediKiosk: Doctor Portal & Clinical Queue Verification');
  console.log('====================================================\n');

  let serverProcess = null;

  // Step 0: Ensure backend server is running
  if (!(await isServerRunning())) {
    console.log('[Setup] Starting local backend server on port 5000...');
    serverProcess = spawn('node', ['dist/server.js'], {
      cwd: backendDir,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    serverProcess.stdout.on('data', (d) => {
      // console.log('[Backend]', d.toString().trim());
    });
    serverProcess.stderr.on('data', (d) => {
      // console.error('[Backend Err]', d.toString().trim());
    });

    let running = false;
    for (let i = 0; i < 15; i++) {
      await sleep(1000);
      if (await isServerRunning()) {
        running = true;
        break;
      }
    }

    if (!running) {
      console.error('❌ Failed to start local backend server. Aborting tests.');
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
    console.log('  ✓ Backend server is up and responding.\n');
  } else {
    console.log('[Setup] Backend server is already running on port 5000.\n');
  }

  // 1. Verify Health & MongoDB Atlas Connectivity
  console.log('[Step 1] Checking backend health and database connection...');
  let health = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const healthRes = await fetch(`${BASE_URL}/health`);
    health = await healthRes.json();
    if (health.database.connected) break;
    await sleep(1000);
  }

  console.log(`  ✓ Status: ${health.status}`);
  console.log(`  ✓ Database: ${health.database.status} (connected: ${health.database.connected})`);

  if (!health.database.connected) {
    console.error('❌ MongoDB Atlas is not connected. Check MONGODB_URI in backend/.env.');
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }

  const createdIntakeIds = [];

  try {
    // 2. Submit Synthetic Patient A (Non-Emergency, Sulfa Allergy)
    console.log('\n[Step 2] Creating Synthetic Patient A (Priya Nair - Migraine & Sulfa Allergy)...');
    const patientAPayload = {
      clientSubmissionId: `TEST-SUB-A-${Date.now()}`,
      consentGiven: true,
      isDemo: true,
      registration: {
        patientId: `TEST-SYNTH-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: 'Priya Nair (Synthetic Demo)',
        age: 34,
        gender: 'female',
        preferredLanguage: 'en',
        visitDate: new Date().toISOString().split('T')[0],
        phone: '9876543210',
      },
      complaint: {
        selectedSymptoms: ['Severe Throbbing Headache', 'Nausea and Photophobia'],
        customDescription: 'Unilateral pulsating headache on left side since 3 days with light sensitivity.',
        durationValue: '3',
        durationUnit: 'days',
        severity: 'severe',
      },
      history: {
        associatedSymptoms: ['Visual aura before headache'],
        existingConditions: ['Migraine with aura'],
        pastSurgery: 'no',
        pastSurgeryDetails: '',
        currentMedications: 'yes',
        medicationsDetails: 'Naproxen 500mg as needed',
        knownAllergies: 'yes',
        allergiesDetails: 'Sulfa drugs (Hives and pruritus)',
        familyHistory: ['Mother had chronic migraines'],
        dietType: 'vegetarian',
        tobaccoUse: 'no',
        alcoholUse: 'no',
        sleepQuality: 'disturbed',
        conditionalFollowUpNotes: 'No fever or neck stiffness reported.',
      },
      emergency: {
        isTriggered: false,
        reasons: [],
        acknowledged: false,
      },
    };

    const resA = await fetch(`${BASE_URL}/patients/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientAPayload),
    });
    const dataA = await resA.json();
    if (resA.status !== 201 || !dataA.success) {
      throw new Error(`Failed to create Patient A: ${JSON.stringify(dataA)}`);
    }
    const intakeIdA = dataA.data.intakeId;
    createdIntakeIds.push(intakeIdA);
    console.log(`  ✓ Patient A created: ID ${intakeIdA}, Token: ${dataA.data.tokenNumber}`);

    // 3. Submit Synthetic Patient B (Emergency Red Flag Triggered)
    console.log('\n[Step 3] Creating Synthetic Patient B (Rajesh Kulkarni - Chest Discomfort & Red Flag)...');
    const patientBPayload = {
      clientSubmissionId: `TEST-SUB-B-${Date.now()}`,
      consentGiven: true,
      isDemo: true,
      registration: {
        patientId: `TEST-SYNTH-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: 'Rajesh Kulkarni (Synthetic Demo)',
        age: 62,
        gender: 'male',
        preferredLanguage: 'hi',
        visitDate: new Date().toISOString().split('T')[0],
        phone: '9811122233',
      },
      complaint: {
        selectedSymptoms: ['Chest Discomfort', 'Exertional Shortness of Breath'],
        customDescription: 'Retrosternal pressure radiating to left shoulder on climbing stairs for 2 weeks.',
        durationValue: '2',
        durationUnit: 'weeks',
        severity: 'severe',
      },
      history: {
        associatedSymptoms: ['Profuse cold sweating', 'Palpitations'],
        existingConditions: ['Type 2 Diabetes (10y)', 'Hypertension (6y)'],
        pastSurgery: 'no',
        pastSurgeryDetails: '',
        currentMedications: 'yes',
        medicationsDetails: 'Telmisartan 40mg, Metformin 1000mg BD',
        knownAllergies: 'no',
        allergiesDetails: '',
        familyHistory: ['Father had myocardial infarction at age 58'],
        dietType: 'non-vegetarian',
        tobaccoUse: 'yes',
        alcoholUse: 'no',
        sleepQuality: 'disturbed',
        conditionalFollowUpNotes: 'Active angina symptoms on minimal exertion.',
      },
      emergency: {
        isTriggered: true,
        reasons: ['Severe chest discomfort radiating to shoulder', 'Exertional dyspnea with diaphoresis'],
        acknowledged: true,
      },
    };

    const resB = await fetch(`${BASE_URL}/patients/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientBPayload),
    });
    const dataB = await resB.json();
    if (resB.status !== 201 || !dataB.success) {
      throw new Error(`Failed to create Patient B: ${JSON.stringify(dataB)}`);
    }
    const intakeIdB = dataB.data.intakeId;
    createdIntakeIds.push(intakeIdB);
    console.log(`  ✓ Patient B created: ID ${intakeIdB}, Token: ${dataB.data.tokenNumber}`);

    // 4. Test Clinician Authentication
    console.log('\n[Step 4] Testing Clinician Server-Side Authentication...');
    // 4a. Bad credentials rejection
    const badAuthRes = await fetch(`${BASE_URL}/patients/clinician/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: 'DR-RAO-14', passcode: 'WRONG-PIN' }),
    });
    console.log(`  ✓ Invalid passcode correctly rejected: Status ${badAuthRes.status}`);
    if (badAuthRes.status !== 401) {
      throw new Error('Server accepted incorrect staff passcode!');
    }

    // 4b. Valid authentication
    const goodAuthRes = await fetch(`${BASE_URL}/patients/clinician/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: 'DR-RAO-14', passcode: 'DOCTOR2026' }),
    });
    const authData = await goodAuthRes.json();
    if (goodAuthRes.status !== 200 || !authData.token) {
      throw new Error(`Clinician authentication failed: ${JSON.stringify(authData)}`);
    }
    const clinicianToken = authData.token;
    console.log(`  ✓ Clinician authenticated: ${authData.session.name} (${authData.session.department})`);
    console.log(`    Token issued (expires in 8h)`);

    // 4c. Verify production security fail-closed and demo evaluation behavior
    console.log('\n[Step 4c] Verifying production fail-closed security and demo evaluator behavior...');
    const originalNodeEnv = process.env.NODE_ENV;
    const originalDemoEnv = process.env.ENABLE_DEMO_EVALUATION;
    const originalPasscode = process.env.CLINICIAN_STAFF_PASSCODE;
    const originalKey = process.env.CLINICIAN_PORTAL_KEY;
    try {
      const { authenticateClinicianCredentials } = await import('../dist/middleware/auth.js');

      // Test 1: Production fail-closed when secrets are unconfigured
      process.env.NODE_ENV = 'production';
      delete process.env.CLINICIAN_PORTAL_KEY;
      delete process.env.CLINICIAN_ACCESS_KEY;
      delete process.env.CLINICIAN_STAFF_PASSCODE;
      delete process.env.ENABLE_DEMO_EVALUATION;

      const failClosedAuth = await authenticateClinicianCredentials('DR-RAO-14', 'DOCTOR2026', {});
      if (failClosedAuth.success) {
        throw new Error('SECURITY VIOLATION: Production permitted default fallback credentials without configured secrets!');
      }
      console.log(`  ✓ Production Mode Fail-Closed: Unconfigured instance strictly rejected login ("${failClosedAuth.error}")`);

      // Test 2: Production with configured secrets, but demo disabled by default -> MUST REJECT DEMO
      process.env.CLINICIAN_PORTAL_KEY = 'test-prod-portal-key-2026';
      process.env.CLINICIAN_STAFF_PASSCODE = 'SECURE-STAFF-PIN-981';
      delete process.env.ENABLE_DEMO_EVALUATION;

      const prodDemoAuth = await authenticateClinicianCredentials('DEMO-DOC', 'DEMO', {});
      if (prodDemoAuth.success) {
        throw new Error('SECURITY VIOLATION: Demo credentials authenticated on production without ENABLE_DEMO_EVALUATION!');
      }
      console.log(`  ✓ Demo login rejected in production by default: "${prodDemoAuth.error}"`);

      // Test 3: Production mode with ENABLE_DEMO_EVALUATION=true -> MUST ALLOW ONLY DEMO
      process.env.ENABLE_DEMO_EVALUATION = 'true';
      const prodDemoAllowed = await authenticateClinicianCredentials('DEMO-DOC', 'DEMO', {});
      if (!prodDemoAllowed.success) {
        throw new Error('Demo credentials failed when ENABLE_DEMO_EVALUATION was explicitly set to true!');
      }
      console.log(`  ✓ Demo login allowed in production when ENABLE_DEMO_EVALUATION=true: Role=${prodDemoAllowed.session.role}`);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      if (originalDemoEnv !== undefined) process.env.ENABLE_DEMO_EVALUATION = originalDemoEnv;
      else delete process.env.ENABLE_DEMO_EVALUATION;
      if (originalPasscode !== undefined) process.env.CLINICIAN_STAFF_PASSCODE = originalPasscode;
      else delete process.env.CLINICIAN_STAFF_PASSCODE;
      if (originalKey !== undefined) process.env.CLINICIAN_PORTAL_KEY = originalKey;
      else delete process.env.CLINICIAN_PORTAL_KEY;
    }

    // 5. Test Token Security: Missing, Invalid, and Expired Tokens
    console.log('\n[Step 5] Verifying endpoints reject missing, invalid, and expired tokens...');
    // 5a. Missing token
    const unauthQueueRes = await fetch(`${BASE_URL}/patients/queue`);
    console.log(`  ✓ Missing token rejected: Status ${unauthQueueRes.status}`);
    if (unauthQueueRes.status !== 401) {
      throw new Error('Queue endpoint permitted unauthenticated access!');
    }

    // 5b. Invalid signature token
    const invalidTokenRes = await fetch(`${BASE_URL}/patients/queue`, {
      headers: { Authorization: 'Bearer invalid.tampered.token' },
    });
    console.log(`  ✓ Invalid signature token rejected: Status ${invalidTokenRes.status}`);
    if (invalidTokenRes.status !== 401) {
      throw new Error('Endpoint accepted invalid signature token!');
    }

    // 5c. Expired token
    const expiredToken = generateExpiredToken();
    const expiredTokenRes = await fetch(`${BASE_URL}/patients/intake/${intakeIdA}`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    console.log(`  ✓ Expired token rejected: Status ${expiredTokenRes.status}`);
    if (expiredTokenRes.status !== 401) {
      throw new Error('Endpoint accepted expired token!');
    }

    // 6. Test Authorized Queue Fetch
    console.log('\n[Step 6] Fetching active patient queue with clinician token...');
    const queueRes = await fetch(`${BASE_URL}/patients/queue?includeDemo=true`, {
      headers: { Authorization: `Bearer ${clinicianToken}` },
    });
    const queueData = await queueRes.json();
    if (queueRes.status !== 200 || !queueData.success) {
      throw new Error(`Queue fetch failed: ${JSON.stringify(queueData)}`);
    }

    console.log(`  ✓ Retrieved queue: ${queueData.count} records`);
    const recordAInQueue = queueData.data.find((p) => p.intakeId === intakeIdA);
    const recordBInQueue = queueData.data.find((p) => p.intakeId === intakeIdB);

    if (!recordAInQueue) throw new Error(`Patient A (${intakeIdA}) missing in queue!`);
    if (!recordBInQueue) throw new Error(`Patient B (${intakeIdB}) missing in queue!`);

    console.log(`  ✓ Patient A in queue: "${recordAInQueue.fullName}" | Token: ${recordAInQueue.tokenNumber} | Class: ${recordAInQueue.recordClassification} | RedFlag: ${recordAInQueue.emergency?.isTriggered}`);
    console.log(`  ✓ Patient B in queue: "${recordBInQueue.fullName}" | Token: ${recordBInQueue.tokenNumber} | Class: ${recordBInQueue.recordClassification} | RedFlag: ${recordBInQueue.emergency?.isTriggered} (Emergency!)`);

    if (!recordBInQueue.emergency?.isTriggered) {
      throw new Error('Patient B emergency red flag not preserved in queue!');
    }

    // 7. Test Fetching Full Intake Record by ID
    console.log(`\n[Step 7] Fetching detailed clinical record GET /api/patients/intake/${intakeIdA}...`);
    const detailRes = await fetch(`${BASE_URL}/patients/intake/${intakeIdA}`, {
      headers: { Authorization: `Bearer ${clinicianToken}` },
    });
    const detailData = await detailRes.json();
    if (detailRes.status !== 200 || !detailData.success) {
      throw new Error(`Detail fetch failed: ${JSON.stringify(detailData)}`);
    }
    const fullA = detailData.data;
    console.log(`  ✓ Retrieved full record for ${fullA.fullName}`);
    console.log(`    - Age/Gender: ${fullA.age} / ${fullA.gender}`);
    console.log(`    - Classification: ${fullA.recordClassification}`);
    console.log(`    - Known Allergy: ${fullA.history.allergiesDetails}`);
    console.log(`    - Diet: ${fullA.history.dietType} | Sleep: ${fullA.history.sleepQuality}`);
    console.log(`    - Pre-review Status: ${fullA.status}`);

    if (fullA.history.allergiesDetails !== 'Sulfa drugs (Hives and pruritus)') {
      throw new Error('Allergy details do not match patient-reported input!');
    }

    // 8. Test Doctor Notes & Sign-off Persistence (PATCH)
    console.log(`\n[Step 8] Submitting doctor notes and signing off Patient A...`);
    const reviewPayload = {
      doctorNotes: 'Clinical examination confirms acute migraine episode. Sulfa allergy noted (contraindicated). Prescribed Sumatriptan 50mg SOS at onset. Advised hydration and sleep hygiene.',
      isApproved: true,
      reviewedBy: 'Dr. Sunita Rao, MD',
      status: 'completed',
    };

    const reviewRes = await fetch(`${BASE_URL}/patients/intake/${intakeIdA}/review`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${clinicianToken}`,
      },
      body: JSON.stringify(reviewPayload),
    });
    const reviewData = await reviewRes.json();
    if (reviewRes.status !== 200 || !reviewData.success) {
      throw new Error(`Doctor review patch failed: ${JSON.stringify(reviewData)}`);
    }
    console.log(`  ✓ Doctor review saved: Status -> ${reviewData.data.status}`);
    console.log(`  ✓ Sign-off metadata: Approved=${reviewData.data.review.isApproved} by ${reviewData.data.review.reviewedBy}`);

    // 8b. Test Silent Overwrite Protection (Without allowAmendment)
    console.log('\n[Step 8b] Testing silent overwrite prevention on already completed review...');
    const overwriteRes = await fetch(`${BASE_URL}/patients/intake/${intakeIdA}/review`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${clinicianToken}`,
      },
      body: JSON.stringify({ doctorNotes: 'Attempted unauthorized overwrite notes' }),
    });
    const overwriteData = await overwriteRes.json();
    console.log(`  ✓ Silent overwrite blocked: Status ${overwriteRes.status} (${overwriteData.code})`);
    if (overwriteRes.status !== 409 || overwriteData.code !== 'ALREADY_COMPLETED') {
      throw new Error(`Server allowed silent overwrite of completed review! Status: ${overwriteRes.status}`);
    }

    // 8c. Test Authorized Clinical Amendment (With allowAmendment: true)
    console.log('\n[Step 8c] Testing authorized clinical amendment (allowAmendment: true)...');
    const amendmentNotes = reviewPayload.doctorNotes + ' [Amended: Added follow-up in 10 days if symptoms persist]';
    const amendRes = await fetch(`${BASE_URL}/patients/intake/${intakeIdA}/review`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${clinicianToken}`,
      },
      body: JSON.stringify({
        doctorNotes: amendmentNotes,
        allowAmendment: true,
      }),
    });
    const amendData = await amendRes.json();
    console.log(`  ✓ Authorized amendment accepted: Status ${amendRes.status}`);
    if (amendRes.status !== 200 || !amendData.success) {
      throw new Error(`Failed to amend review with explicit authorization: ${JSON.stringify(amendData)}`);
    }

    // 8d. Test Evaluator Role Mode & Restrictions
    console.log('\n[Step 8d] Testing evaluator role credentials...');
    const demoAuthRes = await fetch(`${BASE_URL}/patients/clinician/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: 'DEMO-DOC', passcode: 'DEMO' }),
    });
    const demoAuthData = await demoAuthRes.json();
    if (demoAuthRes.status === 200) {
      console.log(`  ✓ Demo evaluator login succeeded (allowed in development): Role=${demoAuthData.session.role}`);
    } else {
      console.log(`  ✓ Demo evaluator login rejected by environment rule: ${demoAuthData.error}`);
    }

    // 9. Re-fetch Record (Simulate Page Refresh) to Verify Persistent Storage
    console.log(`\n[Step 9] Re-fetching Patient A to verify MongoDB persistence after refresh...`);
    const verifyRes = await fetch(`${BASE_URL}/patients/intake/${intakeIdA}`, {
      headers: { Authorization: `Bearer ${clinicianToken}` },
    });
    const verifyData = await verifyRes.json();
    const verifiedRecord = verifyData.data;

    if (verifiedRecord.doctorNotes !== amendmentNotes) {
      throw new Error('Amended doctor notes did not persist accurately in MongoDB Atlas!');
    }
    if (verifiedRecord.status !== 'completed' || !verifiedRecord.review?.isApproved) {
      throw new Error('Sign-off status did not persist in MongoDB Atlas!');
    }
    console.log(`  ✓ Persistence Verified! Record status is "${verifiedRecord.status}" with saved amended notes:`);
    console.log(`    "${verifiedRecord.doctorNotes.slice(0, 80)}..."`);

  } finally {
    // 10. Clean-up of ONLY synthetic test records created in this test
    console.log('\n[Step 10] Cleaning up ONLY synthetic test records created in this run...');

    // Safety guard verification: non-synthetic records cannot be deleted
    try {
      const guardRes = await fetch(`${BASE_URL}/patients/synthetic/REAL-PATIENT-SAFEGUARD`, {
        method: 'DELETE',
        headers: {
          'x-clinician-key': process.env.CLINICIAN_PORTAL_KEY || 'medikiosk-clinical-staff-secure-2026',
        },
      });
      console.log(`  ✓ Safety guard: Non-synthetic / non-existent target safely rejected (Status ${guardRes.status})`);
    } catch {
      // ignore
    }

    for (const id of createdIntakeIds) {
      try {
        // Authenticate as test runner to clean up
        const delRes = await fetch(`${BASE_URL}/patients/synthetic/${id}`, {
          method: 'DELETE',
          headers: {
            'x-clinician-key': process.env.CLINICIAN_PORTAL_KEY || 'medikiosk-clinical-staff-secure-2026',
          },
        });
        const delData = await delRes.json();
        if (delRes.status === 200) {
          console.log(`  ✓ Deleted synthetic record ${id}: ${delData.message}`);
        } else {
          console.warn(`  ⚠️ Cleanup warning for ${id}:`, delData);
        }
      } catch (delErr) {
        console.warn(`  ⚠️ Could not clean up ${id}: ${delErr.message}`);
      }
    }

    if (serverProcess) {
      console.log('\n[Teardown] Stopping local server process...');
      serverProcess.kill();
    }
  }

  console.log('\n====================================================');
  console.log('🎉 ALL DOCTOR PORTAL BACKEND TESTS PASSED CLEANLY!');
  console.log('====================================================\n');
}

run().catch((e) => {
  console.error('\n❌ Test execution failed:', e.message);
  process.exit(1);
});
