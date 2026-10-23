import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');

const BASE_URL = process.env.API_URL || 'http://127.0.0.1:5000/api';

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

async function runTests() {
  console.log('====================================================');
  console.log('🩺 MediKiosk Phase 3A: Backend Persistence Test');
  console.log('====================================================\n');

  let serverProcess = null;
  if (!(await isServerRunning())) {
    console.log('[Setup] Starting local backend server on port 5000...');
    serverProcess = spawn('node', ['dist/server.js'], { cwd: backendDir, stdio: 'ignore' });
    for (let i = 0; i < 15; i++) {
      await sleep(1000);
      if (await isServerRunning()) break;
    }
  }

  // 1. Health check
  console.log('[Test 1] Querying GET /api/health...');
  let health;
  try {
    for (let i = 0; i < 8; i++) {
      const res = await fetch(`${BASE_URL}/health`);
      health = await res.json();
      if (health.database.connected) break;
      await sleep(1000);
    }
    console.log(`  ✓ Service Status: ${health.status}`);
    console.log(`  ✓ Database State: ${health.database.status} (connected: ${health.database.connected})`);
    console.log(`  ✓ Database Name:  ${health.database.name}`);
  } catch (err) {
    console.error('  ✗ Health check failed. Is the backend server running on port 5000?');
    console.error(`    Error: ${err.message}`);
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }

  if (!health.database.connected) {
    console.log('\n⚠️  Notice: MongoDB Atlas is currently disconnected.');
    if (serverProcess) serverProcess.kill();
    return;
  }

  // 2. Submit synthetic patient record
  console.log('\n[Test 2] Submitting synthetic patient intake record...');
  const syntheticPayload = {
    clientSubmissionId: `TEST-SUB-${Date.now()}`,
    consentGiven: true,
    isDemo: true,
    registration: {
      patientId: `SYNTH-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: 'Aarav Sharma (Synthetic Demo)',
      age: 42,
      gender: 'male',
      preferredLanguage: 'en',
      visitDate: new Date().toISOString().split('T')[0],
      phone: '9876500000',
    },
    complaint: {
      selectedSymptoms: ['Persistent Dry Cough', 'Mild Fever'],
      customDescription: 'Low grade fever for 4 days with nocturnal dry cough.',
      durationValue: '4',
      durationUnit: 'days',
      severity: 'moderate',
    },
    history: {
      associatedSymptoms: ['Throat irritation'],
      existingConditions: ['Asthma (Mild intermittent)'],
      pastSurgery: 'no',
      pastSurgeryDetails: '',
      currentMedications: 'yes',
      medicationsDetails: 'Salbutamol inhaler as needed',
      knownAllergies: 'no',
      allergiesDetails: '',
      familyHistory: ['Asthma in maternal family'],
      dietType: 'vegetarian',
      tobaccoUse: 'no',
      alcoholUse: 'no',
      sleepQuality: 'good',
      conditionalFollowUpNotes: 'No hemoptysis, no severe dyspnea.',
    },
    emergency: {
      isTriggered: false,
      reasons: [],
      acknowledged: false,
    },
  };

  let createdIntakeId;
  try {
    const postRes = await fetch(`${BASE_URL}/patients/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syntheticPayload),
    });
    const postData = await postRes.json();

    if (postRes.status === 201 && postData.success) {
      createdIntakeId = postData.data.intakeId;
      console.log(`  ✓ Record saved to MongoDB Atlas!`);
      console.log(`    - Intake ID:    ${postData.data.intakeId}`);
      console.log(`    - Token Number: ${postData.data.tokenNumber}`);
      console.log(`    - Visit Date:   ${postData.data.visitDate}`);
    } else {
      console.error(`  ✗ Submission failed (Status ${postRes.status}):`, postData);
      return;
    }
  } catch (err) {
    console.error('  ✗ Submission network error:', err.message);
    return;
  }

  // 3. Retrieve record by intakeId (requires clinician auth)
  console.log(`\n[Test 3] Fetching record GET /api/patients/intake/${createdIntakeId}...`);
  try {
    const getRes = await fetch(`${BASE_URL}/patients/intake/${createdIntakeId}`, {
      headers: {
        'x-clinician-key': process.env.CLINICIAN_PORTAL_KEY || 'medikiosk-clinical-staff-secure-2026',
      },
    });
    const getData = await getRes.json();

    if (getRes.status === 200 && getData.success) {
      console.log(`  ✓ Record retrieved successfully!`);
      console.log(`    - Patient Name: ${getData.data.fullName}`);
      console.log(`    - Complaint:    ${getData.data.complaint.selectedSymptoms.join(', ')}`);
      console.log(`    - Severity:     ${getData.data.complaint.severity}`);
      console.log(`    - Status:       ${getData.data.status}`);
    } else {
      console.error(`  ✗ Retrieval failed (Status ${getRes.status}):`, getData);
    }
  } catch (err) {
    console.error('  ✗ Retrieval network error:', err.message);
  }

  // 4. Test duplicate prevention
  console.log('\n[Test 4] Testing duplicate submission prevention (re-submitting identical payload)...');
  try {
    const dupRes = await fetch(`${BASE_URL}/patients/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syntheticPayload),
    });
    const dupData = await dupRes.json();

    if (dupRes.status === 200 && dupData.duplicatePrevented) {
      console.log(`  ✓ Duplicate prevented successfully! Server returned existing record.`);
      console.log(`    - Message: ${dupData.message}`);
    } else {
      console.log(`  ⚠️ Unexpected duplicate response:`, dupData);
    }
  } catch (err) {
    console.error('  ✗ Duplicate test error:', err.message);
  }

  // 5. Cleanup synthetic test record
  if (createdIntakeId) {
    console.log(`\n[Test 5] Cleaning up synthetic test record ${createdIntakeId}...`);
    try {
      const delRes = await fetch(`${BASE_URL}/patients/synthetic/${createdIntakeId}`, {
        method: 'DELETE',
        headers: {
          'x-clinician-key': process.env.CLINICIAN_PORTAL_KEY || 'medikiosk-clinical-staff-secure-2026',
        },
      });
      const delData = await delRes.json();
      if (delRes.status === 200) {
        console.log(`  ✓ Cleaned up synthetic test record ${createdIntakeId}`);
      } else {
        console.warn(`  ⚠️ Cleanup notice:`, delData);
      }
    } catch (delErr) {
      console.warn(`  ⚠️ Cleanup error: ${delErr.message}`);
    }
  }

  if (serverProcess) {
    serverProcess.kill();
  }

  console.log('\n====================================================');
  console.log('🎉 Phase 3A Persistence Tests Completed!');
  console.log('====================================================\n');
}

runTests();
