import type { Block } from "./types";

export const BLOCKS: Block[] = [
  // ─────────────────────────────────────────────────────────────────
  // BLOCK 1 — Cardiovascular System
  // ─────────────────────────────────────────────────────────────────
  {
    id: "block-1",
    title: "Cardiovascular System",
    specialty: "Cardiology",
    description: "ECG interpretation, heart failure, arrhythmias, and hypertensive emergencies",
    difficulty: "Medium",
    color: "from-red-600 to-rose-800",
    icon: "❤️",
    mcqs: [
      {
        id: "b1q1",
        caseStudy:
          "A 58-year-old male presents to the emergency department with severe crushing chest pain radiating to the left arm, diaphoresis, and nausea for the past 90 minutes. He is a known hypertensive and smoker. On examination, BP is 90/60 mmHg, HR 110 bpm, and he appears distressed. The 12-lead ECG shown is obtained. Troponin-I is reported as markedly elevated. What is the most likely diagnosis?",
        image: {
          type: "ecg",
          caption: "12-lead ECG",
          finding: "ST elevation in leads V1–V4 with reciprocal depression in II, III, aVF",
        },
        options: [
          { label: "A", text: "Non-ST Elevation Myocardial Infarction (NSTEMI)" },
          { label: "B", text: "Anterior ST-Elevation Myocardial Infarction (STEMI)" },
          { label: "C", text: "Aortic Dissection" },
          { label: "D", text: "Massive Pulmonary Embolism" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Anterior STEMI is the correct answer. The clinical picture — crushing chest pain with radiation, diaphoresis, elevated troponin, hypotension, and ST elevation in V1–V4 (anterior leads representing the LAD territory) — is classic for anterior STEMI. ST elevation ≥1 mm in ≥2 contiguous leads with troponin elevation confirms STEMI. Reciprocal depression in inferior leads (II, III, aVF) is characteristic. Immediate reperfusion (primary PCI within 90 minutes or thrombolysis if PCI unavailable) is the treatment priority.",
          incorrect: [
            "NSTEMI presents with chest pain and troponin elevation but WITHOUT ST elevation on ECG. It may show ST depression or T-wave inversion. This ECG shows clear ST elevation, ruling out NSTEMI.",
            "Aortic dissection classically presents with tearing chest pain radiating to the back, pulse differentials, and widened mediastinum on CXR. ECG changes would be non-specific or normal. Troponin may be mildly elevated only if dissection extends to coronary ostia.",
            "Massive PE presents with pleuritic chest pain, dyspnoea, tachycardia, and right heart strain on ECG (S1Q3T3 pattern, right bundle branch block). ST elevation in anterior leads is not a feature of PE.",
          ],
        },
      },
      {
        id: "b1q2",
        caseStudy:
          "A 72-year-old woman with a history of hypertension and type 2 diabetes presents with increasing breathlessness over 3 weeks, unable to lie flat at night (orthopnoea), and 3-pillow orthopnoea. She has bilateral pitting oedema up to the knees and a raised JVP. Chest examination reveals bilateral basal crackles. The CXR is shown. What is the most likely diagnosis?",
        image: {
          type: "chest-xray",
          caption: "PA Chest X-ray",
          finding: "Cardiomegaly with upper lobe venous diversion and bilateral perihilar haze (bat-wing appearance)",
        },
        options: [
          { label: "A", text: "Liver cirrhosis with portal hypertension" },
          { label: "B", text: "Congestive Heart Failure (CHF)" },
          { label: "C", text: "COPD Exacerbation" },
          { label: "D", text: "Pulmonary Fibrosis" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Congestive Heart Failure is correct. The triad of orthopnoea/PND (due to redistribution of fluid in the supine position), raised JVP (indicating right heart failure and elevated venous pressure), and bilateral basal crackles (pulmonary oedema) with pitting peripheral oedema is the classic presentation of CHF. CXR shows cardiomegaly (CTR >0.5), upper lobe blood diversion, Kerley B lines, and bilateral perihilar haziness. BNP/NT-proBNP would be markedly elevated.",
          incorrect: [
            "Liver cirrhosis with portal hypertension causes ascites, splenomegaly, and peripheral oedema (hypoalbuminaemia), but does NOT cause orthopnoea, PND, raised JVP, or bilateral basal crackles. JVP would be normal and CXR would not show cardiomegaly.",
            "COPD exacerbation presents with wheeze, increased sputum production, and hypoxia. It does not cause bilateral pitting oedema, orthopnoea, or elevated JVP. CXR in COPD shows hyperinflation, flat diaphragms, and increased AP diameter, not cardiomegaly.",
            "Pulmonary fibrosis presents with progressive exertional dyspnoea and dry cough over years, not weeks. CXR shows bilateral reticular shadowing predominantly at the lung bases. It does not cause bilateral pitting oedema or raised JVP (unless cor pulmonale develops).",
          ],
        },
      },
      {
        id: "b1q3",
        caseStudy:
          "A 65-year-old man with a history of rheumatic heart disease presents with palpitations and fatigue. On examination his pulse is completely irregular with a rate of 120 bpm. His BP is 130/85 mmHg. The ECG shown demonstrates an irregularly irregular rhythm with absent P waves and variable ventricular response. What is the drug of first choice for rate control in this patient?",
        image: {
          type: "ecg",
          caption: "12-lead ECG",
          finding: "Irregularly irregular baseline (fibrillatory waves), absent P waves, variable RR intervals",
        },
        options: [
          { label: "A", text: "Digoxin" },
          { label: "B", text: "Metoprolol (beta-blocker)" },
          { label: "C", text: "Adrenaline (epinephrine)" },
          { label: "D", text: "Lidocaine" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Metoprolol (or another beta-blocker such as bisoprolol or atenolol) is the first-line agent for ventricular rate control in atrial fibrillation, as per ACC/AHA and ESC guidelines. Beta-blockers reduce AV node conduction, slowing the ventricular rate. They are particularly effective in high adrenergic states (exercise, stress). Target resting heart rate is <110 bpm. Non-dihydropyridine calcium channel blockers (diltiazem, verapamil) are an alternative when beta-blockers are contraindicated.",
          incorrect: [
            "Digoxin is now considered second-line for AF rate control. It only provides rate control at rest through vagal enhancement and is ineffective during exercise. It has a narrow therapeutic index and multiple drug interactions. It may be used as adjunct therapy.",
            "Adrenaline (epinephrine) would markedly worsen atrial fibrillation by increasing heart rate and atrial excitability. It is contraindicated in AF and would be used only in cardiac arrest (VF/pulseless VT).",
            "Lidocaine is a class Ib antiarrhythmic used specifically for ventricular arrhythmias (VT/VF), not supraventricular arrhythmias like AF. It has no role in AF management.",
          ],
        },
      },
      {
        id: "b1q4",
        caseStudy:
          "A 28-year-old medical student with no previous cardiac history presents with episodes of palpitations occurring suddenly and stopping abruptly. He describes a 'racing heart' lasting 10–15 minutes. On auscultation a mid-systolic click followed by a late systolic murmur is noted best at the apex. An echocardiogram reveals posterior displacement of mitral leaflets into the left atrium during systole. What is the most likely diagnosis?",
        image: {
          type: "ecg",
          caption: "Echocardiographic view",
          finding: "Parasternal long-axis view showing posterior mitral leaflet prolapse with mild MR jet",
        },
        options: [
          { label: "A", text: "Hypertrophic Obstructive Cardiomyopathy (HOCM)" },
          { label: "B", text: "Mitral Valve Prolapse (MVP)" },
          { label: "C", text: "Aortic Stenosis" },
          { label: "D", text: "Wolff-Parkinson-White Syndrome" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Mitral Valve Prolapse (MVP) is correct. The hallmark findings are: (1) mid-systolic click — the click moves EARLIER with Valsalva and standing, later with squatting; (2) late systolic murmur at the apex; (3) echo showing posterior displacement (>2mm) of mitral leaflets into the left atrium. MVP is the most common valvular abnormality (2–3% prevalence), more common in young women. Palpitations are common, usually benign SVT. Complications include mitral regurgitation, infective endocarditis, and rarely sudden cardiac death.",
          incorrect: [
            "HOCM presents with a harsh systolic ejection murmur at the left sternal border that increases with Valsalva and decreases with squatting (opposite of aortic stenosis). It may cause syncope with exertion and sudden cardiac death. Echo shows asymmetric septal hypertrophy and systolic anterior motion (SAM) of the mitral valve — not leaflet prolapse.",
            "Aortic stenosis causes a harsh crescendo-decrescendo systolic ejection murmur at the aortic area (right 2nd intercostal space) that radiates to the carotids. The murmur is heard throughout systole, not a mid-systolic click followed by a late murmur. It occurs in elderly patients.",
            "WPW syndrome causes palpitations (pre-excitation via accessory pathway) and shows delta waves with short PR interval on ECG. Auscultation is entirely normal — no murmurs or clicks. Echo would be normal.",
          ],
        },
      },
      {
        id: "b1q5",
        caseStudy:
          "A 55-year-old man with no prior cardiac history presents with a 2-hour history of severe headache, blurred vision, and confusion. His blood pressure is measured at 230/140 mmHg bilaterally. Fundoscopy reveals bilateral papilloedema with flame haemorrhages and cotton-wool spots. Urinalysis shows 2+ proteinuria. Serum creatinine is elevated. What is this condition called and what is the priority treatment target within the first hour?",
        image: {
          type: "fundoscopy",
          caption: "Fundoscopic examination",
          finding: "Bilateral papilloedema, flame-shaped haemorrhages, and cotton-wool spots at the macula",
        },
        options: [
          { label: "A", text: "Hypertensive Urgency — reduce BP by 25% over 24–48 hours orally" },
          { label: "B", text: "Hypertensive Emergency — reduce MAP by 25% in first hour with IV labetalol" },
          { label: "C", text: "Hypertensive Emergency — immediately normalise BP to <120/80 mmHg" },
          { label: "D", text: "Hypertensive Urgency — admit for observation, no medication needed" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "This is a Hypertensive Emergency (malignant hypertension) — severely elevated BP with acute end-organ damage (hypertensive encephalopathy, retinopathy with papilloedema, acute kidney injury). The target is to reduce Mean Arterial Pressure (MAP) by 25% in the first hour using IV agents (labetalol, nicardipine, or sodium nitroprusside). Rapid complete normalisation of BP is dangerous as it can cause cerebral, coronary, or renal ischaemia due to loss of autoregulation. Further gradual reduction over 24–48 hours follows.",
          incorrect: [
            "Reducing by 25% over 24–48 hours orally describes management of hypertensive URGENCY (severe BP elevation WITHOUT end-organ damage). This patient has papilloedema, confusion, and renal impairment — definite end-organ damage requiring immediate IV treatment.",
            "Immediately normalising BP to <120/80 mmHg is dangerous. The brain, heart, and kidneys have adapted their autoregulation to the chronically elevated BP. Rapid normalisation causes ischaemia to these organs. The 25% MAP reduction in the first hour is the evidence-based target.",
            "Observation without medication is entirely inappropriate. This patient has hypertensive emergency with active end-organ damage (encephalopathy, retinopathy, AKI). Immediate IV antihypertensive treatment is a medical emergency.",
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // BLOCK 2 — Respiratory System
  // ─────────────────────────────────────────────────────────────────
  {
    id: "block-2",
    title: "Respiratory System",
    specialty: "Pulmonology",
    description: "Asthma, pneumonia, TB, pneumothorax, and chronic lung disease",
    difficulty: "Medium",
    color: "from-sky-600 to-blue-800",
    icon: "🫁",
    mcqs: [
      {
        id: "b2q1",
        caseStudy:
          "A 22-year-old medical student with known eczema and allergic rhinitis presents with sudden onset dyspnoea, wheeze, and chest tightness after exposure to dust while cleaning a library. On examination, bilateral expiratory wheeze is present. SpO2 is 94% on room air. PEF is 55% of predicted. After two doses of nebulised salbutamol, PEF rises to 78% and wheeze improves. What is the most appropriate diagnosis and initial management?",
        image: {
          type: "chest-xray",
          caption: "PA Chest X-ray",
          finding: "Hyperinflated lung fields with flattened diaphragms — no consolidation",
        },
        options: [
          { label: "A", text: "COPD exacerbation — commence long-acting bronchodilators" },
          { label: "B", text: "Acute asthma (moderate) — inhaled SABA, systemic corticosteroids" },
          { label: "C", text: "Anaphylaxis — IM adrenaline 0.5 mg immediately" },
          { label: "D", text: "Bronchiolitis — supportive care and oxygen" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Acute moderate asthma is correct. Key features: young atopic patient (eczema + rhinitis), clear precipitant (allergen exposure), bilateral expiratory wheeze, PEF 33–50% = severe / 50–75% = moderate (this case: 55% = moderate), and reversibility with bronchodilator (rise to 78%). Management: inhaled SABA (salbutamol) via spacer or nebuliser, systemic corticosteroids (prednisolone 40–50 mg orally or IV hydrocortisone), controlled oxygen targeting SpO2 94–98%, and reassessment.",
          incorrect: [
            "COPD exacerbation occurs in older patients with a significant smoking history (>20 pack-years), chronic productive cough, and an FEV1/FVC <70% at baseline. This young, non-smoking atopic patient does not fit COPD. Also, COPD is less reversible than asthma.",
            "Anaphylaxis requires systemic features beyond wheeze: urticaria, angioedema, hypotension, syncope, or vomiting after allergen exposure. Wheeze alone with known asthma and atopy in response to dust is asthma, not anaphylaxis. IM adrenaline would be inappropriate without systemic features.",
            "Bronchiolitis affects infants <2 years old and is caused by RSV. It is not relevant to a 22-year-old adult.",
          ],
        },
      },
      {
        id: "b2q2",
        caseStudy:
          "A 45-year-old construction worker presents with a 5-day history of fever (39.2°C), productive cough with rust-coloured sputum, pleuritic chest pain on the right side, and rigors. On examination, dullness to percussion and bronchial breathing are noted at the right lung base. The CXR shown is obtained. Sputum Gram stain reveals Gram-positive diplococci. What is the most likely causative organism?",
        image: {
          type: "chest-xray",
          caption: "PA Chest X-ray",
          finding: "Right lower lobe consolidation with air bronchograms — lobar pneumonia pattern",
        },
        options: [
          { label: "A", text: "Mycoplasma pneumoniae" },
          { label: "B", text: "Streptococcus pneumoniae" },
          { label: "C", text: "Staphylococcus aureus" },
          { label: "D", text: "Legionella pneumophila" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Streptococcus pneumoniae (pneumococcus) is the most common cause of community-acquired pneumonia (CAP) and the commonest cause of lobar pneumonia. Classic features: acute onset, high fever, rigors, rust-coloured (rusty) sputum (due to blood + mucus), pleuritic chest pain, and lobar consolidation on CXR with air bronchograms. Sputum Gram stain shows Gram-positive diplococci (lancet-shaped). Treatment: Amoxicillin or Co-amoxiclav; add macrolide if atypical coverage needed.",
          incorrect: [
            "Mycoplasma pneumoniae causes atypical pneumonia — gradual onset, dry cough, low-grade fever, extrapulmonary features (haemolytic anaemia, erythema multiforme). CXR shows patchy interstitial infiltrates, not lobar consolidation. Gram stain shows no organisms (no cell wall). Responds to macrolides, not penicillin.",
            "Staphylococcus aureus pneumonia is less common and typically occurs post-influenza, in IV drug users, or hospitalised patients. CXR classically shows cavitating lesions or abscesses. Gram stain shows Gram-positive cocci in clusters, not diplococci.",
            "Legionella pneumophila causes severe atypical pneumonia (Legionnaire's disease) associated with water cooling systems. It presents with diarrhoea, confusion, hyponatraemia, and markedly elevated LDH. Gram stain: negative rods (but poorly visible). Diagnosis by urine antigen.",
          ],
        },
      },
      {
        id: "b2q3",
        caseStudy:
          "A 30-year-old male healthcare worker presents with a 3-month history of productive cough, haemoptysis, drenching night sweats, weight loss of 8 kg, and low-grade fever. He reports recent travel to an endemic area. The CXR shown demonstrates cavitary lesion in the right upper lobe. Sputum AFB smear is positive (3+). Mantoux test: 22 mm induration. What is the first-line treatment regimen?",
        image: {
          type: "chest-xray",
          caption: "PA Chest X-ray",
          finding: "Right upper lobe cavitary lesion with surrounding consolidation and hilar lymphadenopathy",
        },
        options: [
          { label: "A", text: "Rifampicin + Isoniazid for 6 months only" },
          { label: "B", text: "RHZE × 2 months (intensive), then RH × 4 months (continuation)" },
          { label: "C", text: "Amoxicillin + Clarithromycin for 4 weeks" },
          { label: "D", text: "Prednisolone 40 mg daily for 8 weeks" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "The WHO-recommended standard first-line ATT regimen for new pulmonary TB is: 2HRZE / 4HR. Intensive phase (2 months): Rifampicin (R) + Isoniazid (H) + Pyrazinamide (Z) + Ethambutol (E). Continuation phase (4 months): Rifampicin (R) + Isoniazid (H). Total duration: 6 months. Pyridoxine (Vitamin B6) is given with isoniazid to prevent peripheral neuropathy. DOTS (Directly Observed Therapy Short-course) is recommended for compliance. Sputum AFB should be repeated at 2 months to confirm response.",
          incorrect: [
            "Rifampicin + Isoniazid for 6 months alone is insufficient. The intensive phase MUST include Pyrazinamide and Ethambutol for the first 2 months to rapidly reduce the bacterial load and prevent resistance. Using only two drugs in the intensive phase promotes multi-drug resistance (MDR-TB).",
            "Amoxicillin + Clarithromycin is a community-acquired pneumonia regimen. It has no activity against Mycobacterium tuberculosis (an acid-fast bacillus with a unique waxy cell wall requiring specific anti-mycobacterial drugs).",
            "Prednisolone is used as an ADJUNCT in specific TB complications (TB meningitis, TB pericarditis, pleural effusion). It is NOT a primary treatment and would be dangerous without anti-TB coverage — it would cause massive dissemination of the bacilli.",
          ],
        },
      },
      {
        id: "b2q4",
        caseStudy:
          "A 19-year-old tall thin male develops sudden onset right-sided chest pain and severe breathlessness after lifting heavy boxes. On examination his trachea is deviated to the left. The right side shows absent breath sounds, hyper-resonance on percussion, and distended neck veins. He is tachycardic (HR 130 bpm) and hypotensive (BP 80/50 mmHg). The CXR confirms the diagnosis shown. What is the IMMEDIATE management?",
        image: {
          type: "chest-xray",
          caption: "PA Chest X-ray",
          finding: "Absent lung markings on the right with tracheal deviation to the left — tension pneumothorax",
        },
        options: [
          { label: "A", text: "Insert intercostal chest drain (ICD) in 5th ICS mid-axillary line" },
          { label: "B", text: "Immediate needle decompression — 2nd ICS mid-clavicular line, followed by ICD" },
          { label: "C", text: "Emergency CXR to confirm before treatment" },
          { label: "D", text: "High-flow oxygen and urgent cardiology review" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Tension pneumothorax is a clinical diagnosis — do NOT wait for CXR confirmation. Immediate needle decompression (large-bore 14G cannula, 2nd intercostal space, mid-clavicular line) releases the tension immediately. This converts tension pneumothorax to a simple pneumothorax. Then definitively manage with an intercostal chest drain (ICD) in the 5th ICS, mid-axillary line, using the safe triangle. Delay kills — haemodynamic compromise from tension pneumothorax is rapidly fatal.",
          incorrect: [
            "Inserting an ICD is the definitive treatment but NOT the first step in a haemodynamically unstable tension pneumothorax. ICD insertion takes longer and requires proper positioning. First decompress with a needle to save the patient's life, then insert the ICD.",
            "Getting a CXR first is dangerous and can be fatal. Tension pneumothorax is a clinical diagnosis based on: absent breath sounds + hyper-resonance + tracheal deviation + haemodynamic instability. Do not wait for imaging in an unstable patient with this clinical picture.",
            "High-flow oxygen alone does not treat tension pneumothorax. While oxygen should be administered, the primary life-threatening issue is mechanical compression of the mediastinum requiring immediate decompression.",
          ],
        },
      },
      {
        id: "b2q5",
        caseStudy:
          "A 50-year-old male ex-smoker presents with a long history of daily productive cough with large volumes of purulent sputum, worse in the morning ('morning dip'). He reports recurrent chest infections requiring hospitalisation. On examination, finger clubbing is present. CXR shown reveals characteristic changes. HRCT of the thorax is the gold standard for confirmation. What is the most likely diagnosis?",
        image: {
          type: "chest-xray",
          caption: "PA Chest X-ray",
          finding: "Bilateral lower lobe tram-track opacities and ring shadows with crowded bronchovascular markings",
        },
        options: [
          { label: "A", text: "Chronic Obstructive Pulmonary Disease (COPD)" },
          { label: "B", text: "Bronchiectasis" },
          { label: "C", text: "Idiopathic Pulmonary Fibrosis (IPF)" },
          { label: "D", text: "Cystic Fibrosis" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Bronchiectasis is the correct answer. The triad of: (1) chronic productive cough with copious purulent sputum (often worse in the morning with postural drainage), (2) recurrent lower respiratory tract infections, and (3) finger clubbing — with CXR showing tram-tracking (parallel lines = dilated bronchial walls) and ring shadows (dilated bronchi on end-on view) is pathognomonic. HRCT showing dilated bronchi wider than their accompanying pulmonary artery ('signet ring sign') is the gold standard. Causes include post-TB, post-infectious, immune deficiency, and cystic fibrosis.",
          incorrect: [
            "COPD presents with progressive exertional dyspnoea, chronic cough, and a smoking history. CXR shows hyperinflation (flattened diaphragms, increased AP diameter, barrel chest), NOT tram-tracking. Finger clubbing is NOT a feature of uncomplicated COPD.",
            "Idiopathic Pulmonary Fibrosis presents with dry cough and progressive dyspnoea. CXR shows bilateral basal reticular shadowing (honeycombing). HRCT shows peripheral reticulation with honeycombing. It does NOT cause large-volume purulent sputum or finger clubbing (unless advanced).",
            "Cystic fibrosis is a possibility (it causes bronchiectasis), but it primarily presents in children/young adults and is associated with pancreatic insufficiency, malabsorption, and infertility. A 50-year-old ex-smoker would more likely have post-infectious bronchiectasis.",
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // BLOCK 3 — Neurology
  // ─────────────────────────────────────────────────────────────────
  {
    id: "block-3",
    title: "Neurology",
    specialty: "Neurology",
    description: "Stroke, meningitis, Parkinson's disease, seizures and cranial nerve palsy",
    difficulty: "Hard",
    color: "from-purple-600 to-violet-800",
    icon: "🧠",
    mcqs: [
      {
        id: "b3q1",
        caseStudy:
          "A 67-year-old woman with hypertension and atrial fibrillation is brought to A&E with sudden onset right-sided facial weakness, right arm and leg weakness, and slurred speech that began 1 hour ago. She is on warfarin. INR is 1.8. NIHSS score is 14. Non-contrast CT brain shows no haemorrhage. MRI DWI sequence reveals restricted diffusion in the left MCA territory. What is the most appropriate immediate management?",
        image: {
          type: "brain-ct",
          caption: "Non-contrast CT Brain",
          finding: "No acute haemorrhage; subtle loss of grey-white differentiation in left MCA territory",
        },
        options: [
          { label: "A", text: "IV Alteplase (tPA) 0.9 mg/kg immediately" },
          { label: "B", text: "Urgent neurosurgical consultation for hemicraniectomy" },
          { label: "C", text: "Aspirin 300 mg immediately, then secondary prevention" },
          { label: "D", text: "Anticoagulation reversal with Vitamin K only, then observe" },
        ],
        correctIndex: 2,
        explanation: {
          correct:
            "Aspirin 300 mg is the correct answer. IV thrombolysis (tPA) is contraindicated when INR >1.7 (in this case INR 1.8 — anticoagulated patient). The risk of haemorrhagic transformation is unacceptably high. Aspirin 300 mg loading dose is therefore the appropriate immediate treatment for acute ischaemic stroke when thrombolysis is contraindicated. She should also be considered for mechanical thrombectomy (endovascular) if a large vessel occlusion is confirmed, as this is not affected by anticoagulation status. Dual antiplatelet or anticoagulation decisions follow after 24 hours.",
          incorrect: [
            "IV Alteplase is contraindicated here because INR is 1.8 (>1.7). Thrombolysis in an anticoagulated patient carries a very high risk of fatal intracranial haemorrhage. Other absolute contraindications include recent major surgery (<14 days), active bleeding, or platelets <100,000.",
            "Urgent hemicraniectomy is indicated for large MCA infarction (>50% territory) causing malignant oedema and herniation — typically assessed at 48–72 hours, not immediately. NIHSS 14 is severe but this decision is made after initial treatment and monitoring, not at presentation.",
            "Anticoagulation reversal (Vitamin K + FFP/PCC for warfarin) is indicated if the patient had intracranial haemorrhage. Here, the CT shows NO haemorrhage — this is ischaemic stroke. Reversing anticoagulation would remove protection and is not the priority.",
          ],
        },
      },
      {
        id: "b3q2",
        caseStudy:
          "A 19-year-old university student presents with a 12-hour history of severe headache described as 'the worst of my life', fever (39.8°C), neck stiffness, and photophobia. On examination, Kernig's sign and Brudzinski's sign are positive. A widespread non-blanching petechial and purpuric rash is noted over the trunk and limbs. He appears confused (GCS 13). What is the most important FIRST step in management?",
        image: {
          type: "peripheral-smear",
          caption: "Clinical photograph",
          finding: "Non-blanching petechial and purpuric rash over trunk — does not disappear with glass pressure test",
        },
        options: [
          { label: "A", text: "Urgent CT brain before lumbar puncture" },
          { label: "B", text: "IV Benzylpenicillin or Ceftriaxone immediately — do NOT delay for CT or LP" },
          { label: "C", text: "Urgent lumbar puncture for CSF analysis" },
          { label: "D", text: "IV Dexamethasone first, then antibiotics" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Immediate IV antibiotics (Benzylpenicillin 2.4g IV or Ceftriaxone 2g IV) is the correct answer. In suspected bacterial meningitis with haemodynamic instability or rapidly progressive rash, NEVER delay antibiotics for imaging or LP. The non-blanching petechial rash is pathognomonic of meningococcal septicaemia (Neisseria meningitidis). Every hour of delay increases mortality by approximately 10%. If LP is needed, take blood cultures FIRST, then give antibiotics, then do CT, then LP if safe. The pneumonic: Bloods → Antibiotics → CT → LP.",
          incorrect: [
            "CT brain BEFORE LP is appropriate only to rule out space-occupying lesions before LP in patients with papilloedema, focal neurology, or immunocompromise. However, antibiotics must NEVER be delayed for CT in septicaemic meningococcal disease. The CT should be done, but after blood cultures are taken and antibiotics started.",
            "Urgent LP without first giving antibiotics risks a 2–4 hour delay in treatment. While LP is essential for CSF analysis, it must NOT take priority over IV antibiotics in a deteriorating patient with non-blanching rash. After starting antibiotics, LP findings are still interpretable for 48 hours.",
            "Dexamethasone has evidence for reducing hearing loss and neurological sequelae in bacterial meningitis (especially pneumococcal). It should be given with or just before the first antibiotic dose — but NOT instead of antibiotics. Giving dexamethasone FIRST before antibiotics is incorrect.",
          ],
        },
      },
      {
        id: "b3q3",
        caseStudy:
          "A 45-year-old woman presents with sudden onset unilateral left-sided facial weakness noticed on waking. She is unable to close her left eye, the left forehead is smooth and cannot be wrinkled, and the nasolabial fold is flattened on the left. There is no limb weakness, no slurred speech, and no history of headache or trauma. BP is 124/78 mmHg. What is the most likely diagnosis?",
        image: {
          type: "brain-ct",
          caption: "Clinical illustration",
          finding: "Left-sided lower motor neuron facial nerve palsy involving forehead (Bell's palsy pattern)",
        },
        options: [
          { label: "A", text: "Right MCA territory ischaemic stroke" },
          { label: "B", text: "Bell's Palsy (Idiopathic Lower Motor Neuron VII Palsy)" },
          { label: "C", text: "Ramsay Hunt Syndrome" },
          { label: "D", text: "Acoustic Neuroma (Vestibular Schwannoma)" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Bell's Palsy (idiopathic LMN VII palsy) is correct. The key distinguishing feature is FOREHEAD INVOLVEMENT. In LMN (peripheral) facial nerve palsy, ALL ipsilateral facial muscles are affected including the forehead (unable to wrinkle brow, raise eyebrow). This is because the forehead receives bilateral cortical innervation — so UMN lesions spare the forehead. The sudden onset on waking, unilateral weakness without limb involvement, and complete hemifacial involvement (including forehead) are classic for Bell's palsy. Treatment: prednisolone (within 72 hours) + eye protection (artificial tears, eye patch at night) ± aciclovir.",
          incorrect: [
            "Right MCA stroke would cause an UPPER motor neuron facial palsy affecting the lower face (contralateral side), with SPARING of the forehead. It would also cause right-sided limb weakness (contralateral hemiplegia), dysphasia (if dominant hemisphere), and other focal neurological deficits. This woman has FOREHEAD involvement — an UMN stroke does not do this.",
            "Ramsay Hunt Syndrome is HSV-3 (VZV) reactivation in the geniculate ganglion. It also causes LMN VII palsy with forehead involvement, BUT it is distinguished by the triad: facial palsy + vesicular rash in the ear (auricle/external auditory canal) + ipsilateral sensorineural hearing loss. No ear vesicles or hearing loss are mentioned here.",
            "Acoustic neuroma grows at the cerebellopontine angle and causes gradual progressive unilateral sensorineural hearing loss, tinnitus, and vertigo first. Facial weakness is a LATE feature and develops gradually. Sudden onset facial weakness on waking is not characteristic of acoustic neuroma.",
          ],
        },
      },
      {
        id: "b3q4",
        caseStudy:
          "A 68-year-old retired teacher is brought by his family due to gradual worsening of walking and hand tremors over 2 years. His wife notes he has become expressionless and speaks softly. On examination, he has a resting tremor ('pill-rolling') at 4–6 Hz worse at rest and improved with action, cogwheel rigidity in all limbs, bradykinesia (slow finger tapping), and a shuffling gait with reduced arm swing. Postural reflexes are impaired. What is the diagnosis and drug of choice?",
        image: {
          type: "brain-ct",
          caption: "Dopamine transporter (DAT) SPECT scan",
          finding: "Asymmetric reduction in striatal dopamine transporter uptake — loss of the normal 'comma' pattern",
        },
        options: [
          { label: "A", text: "Essential Tremor — propranolol first-line" },
          { label: "B", text: "Parkinson's Disease — Levodopa/Carbidopa remains most effective" },
          { label: "C", text: "Drug-induced Parkinsonism — stop offending drug" },
          { label: "D", text: "Wilson's Disease — D-penicillamine chelation therapy" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Parkinson's Disease is characterised by the cardinal triad: (1) Resting tremor (pill-rolling, 4–6 Hz, suppressed by movement), (2) Rigidity (cogwheel or lead-pipe), (3) Bradykinesia — with postural instability as a fourth feature. Additional features: expressionless facies (hypomimia), micrographia, shuffling festinant gait, reduced arm swing, soft speech (hypophonia). Levodopa (combined with carbidopa/benserazide to prevent peripheral decarboxylation) is the most effective symptomatic treatment. It replenishes dopamine deficiency from substantia nigra neuronal loss. DAT-SPECT confirms nigrostriatal dopaminergic deficit.",
          incorrect: [
            "Essential tremor presents with an ACTION tremor (worse with movement, absent at rest) — opposite of PD resting tremor. ET is bilateral, typically involves hands and head, and often has a positive family history. There is NO rigidity, bradykinesia, gait disturbance, or facial masking. First-line: propranolol or primidone.",
            "Drug-induced parkinsonism (from dopamine antagonists: metoclopramide, haloperidol, risperidone) is clinically indistinguishable from idiopathic PD but typically has an acute/subacute onset after starting the offending drug. No drug history of dopamine antagonists is mentioned here. DAT scan would be normal in drug-induced parkinsonism.",
            "Wilson's disease (copper accumulation) presents in patients under 40 with a movement disorder (tremor — 'wing-beating' tremor at 3–5 Hz, not pill-rolling), liver disease, and Kayser-Fleischer rings (copper deposits in Descemet's membrane — seen on slit-lamp). This 68-year-old's age and presentation are not consistent with Wilson's disease.",
          ],
        },
      },
      {
        id: "b3q5",
        caseStudy:
          "A 40-year-old hypertensive woman is brought to A&E after collapsing at home. Her husband says she complained of the 'worst headache of her life' suddenly while gardening, followed by vomiting and brief loss of consciousness. On examination, GCS is 13/15, neck stiffness is present, and there is photophobia. Non-contrast CT brain is obtained. Lumbar puncture shows uniformly blood-stained CSF with xanthochromia (yellow supernatant after centrifugation). What is the most likely diagnosis?",
        image: {
          type: "brain-ct",
          caption: "Non-contrast CT Brain",
          finding: "Hyperdense blood in the basal cisterns and Sylvian fissure — subarachnoid haemorrhage pattern",
        },
        options: [
          { label: "A", text: "Migraine with aura" },
          { label: "B", text: "Subarachnoid Haemorrhage (SAH)" },
          { label: "C", text: "Hypertensive Encephalopathy" },
          { label: "D", text: "Traumatic Lumbar Puncture (tap)" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Subarachnoid Haemorrhage (SAH) is correct. The 'thunderclap headache' (sudden onset, maximal at onset — 'worst headache of my life') is the hallmark symptom. CT shows blood in the basal cisterns and subarachnoid space (hyperdense) in 95% within 12 hours. LP showing xanthochromia (yellow discolouration from haemoglobin breakdown products — bilirubin) performed ≥12 hours after headache onset confirms SAH when CT is negative. Commonest cause: ruptured berry aneurysm (80%) at Circle of Willis. Management: urgent neurosurgical referral, nimodipine (for vasospasm prevention), blood pressure control.",
          incorrect: [
            "Migraine may present with severe headache and photophobia/phonophobia, but the onset is typically gradual (builds over 30–60 minutes) with a preceding aura (visual, sensory, or speech disturbance). True thunderclap headache (maximal at onset) is NOT typical of migraine. CSF would be normal in migraine.",
            "Hypertensive encephalopathy (from chronically elevated BP) causes confusion, visual changes, and headache but develops over hours-to-days, not seconds. CSF would not be bloody. CT would show posterior leukoencephalopathy (PRES syndrome), not subarachnoid blood.",
            "Traumatic (bloody) LP is a common worry when CSF is blood-stained. Key differentiation: in a traumatic tap, the CSF clears progressively with subsequent samples, red cell count falls from tube 1 to tube 3, and the supernatant is CLEAR (no xanthochromia). In SAH, all samples are equally blood-stained and xanthochromia develops after 2 hours.",
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // BLOCK 4 — Gastrointestinal & Hepatic
  // ─────────────────────────────────────────────────────────────────
  {
    id: "block-4",
    title: "Gastrointestinal & Hepatic",
    specialty: "Gastroenterology",
    description: "Appendicitis, peptic ulcer, liver cirrhosis, and bowel obstruction",
    difficulty: "Medium",
    color: "from-amber-600 to-orange-800",
    icon: "🫃",
    mcqs: [
      {
        id: "b4q1",
        caseStudy:
          "An 18-year-old male presents with a 24-hour history of periumbilical pain that has migrated to the right iliac fossa, associated with nausea, anorexia, and one episode of vomiting. Temperature is 38.1°C. On examination, maximal tenderness is at McBurney's point, with rebound tenderness and guarding. Rovsing's sign is positive. WBC is 14,500/µL. The abdominal X-ray shown is reviewed. What is the diagnosis and definitive management?",
        image: {
          type: "abdominal-xray",
          caption: "Erect Abdominal X-ray",
          finding: "Non-specific; no free gas under diaphragm; faecolith visible in right iliac fossa",
        },
        options: [
          { label: "A", text: "Mesenteric lymphadenitis — conservative management, antibiotics" },
          { label: "B", text: "Acute Appendicitis — urgent appendicectomy (laparoscopic)" },
          { label: "C", text: "Right inguinal hernia — surgical repair" },
          { label: "D", text: "Renal colic — IV fluids, analgesia, and urology referral" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Acute appendicitis is the diagnosis. The classic migration of pain from periumbilical to right iliac fossa (McBurney's point) due to local peritoneal irritation, accompanied by anorexia, nausea, low-grade fever, leukocytosis, and positive Rovsing's sign (pressure in LIF causes pain in RIF — due to peritoneal stretching) confirms the diagnosis. Alvarado Score ≥7 indicates high probability. Definitive management: laparoscopic appendicectomy (preferred) or open appendicectomy. IV antibiotics (ceftriaxone + metronidazole) perioperatively.",
          incorrect: [
            "Mesenteric lymphadenitis mimics appendicitis and is common in children/adolescents, often preceded by a viral URTI. Tenderness is less localised, there is no guarding, and the temperature is usually lower. A positive Rovsing's sign and maximal point tenderness at McBurney's point strongly favour appendicitis over lymphadenitis.",
            "Right inguinal hernia causes groin pain and a reducible or irreducible lump in the groin/scrotum. Pain localised to McBurney's point with migration from the periumbilical region and systemic features (fever, nausea) are not features of an uncomplicated inguinal hernia.",
            "Renal colic causes severe colicky loin-to-groin pain with haematuria. The patient is typically restless (cannot find comfortable position) rather than lying still. There is no peritoneal guarding or rebound tenderness. Urinalysis would show red blood cells.",
          ],
        },
      },
      {
        id: "b4q2",
        caseStudy:
          "A 50-year-old male with a history of daily NSAID use for arthritis and H. pylori infection presents with episodic epigastric burning pain, worse 2–3 hours after meals and at night, relieved temporarily by food and antacids. He reports dark stools (melaena) for 2 days. On examination, epigastric tenderness is present. Hb is 8.2 g/dL. Endoscopy reveals a 1.5 cm ulcer on the posterior wall of the duodenal bulb. What is the most appropriate treatment?",
        image: {
          type: "abdominal-xray",
          caption: "Upper GI Endoscopy view",
          finding: "2 cm deep ulcer with punched-out edges on posterior wall of first part of duodenum, oozing blood",
        },
        options: [
          { label: "A", text: "Surgery immediately — Billroth II gastrectomy" },
          { label: "B", text: "H. pylori eradication (triple therapy) + PPI, stop NSAIDs" },
          { label: "C", text: "Antacids three times daily for 4 weeks" },
          { label: "D", text: "Bismuth quadruple therapy alone for 14 days" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "H. pylori triple therapy + PPI is the correct management for H. pylori-positive peptic ulcer disease. Standard triple therapy: PPI (omeprazole/lansoprazole) + Amoxicillin 1g + Clarithromycin 500 mg — twice daily for 7–14 days. This achieves eradication in 70–85% of cases. Stopping NSAIDs is critical (they inhibit COX-1 reducing mucosal prostaglandin synthesis). Confirm eradication with urea breath test or stool antigen 4 weeks after completing treatment. PPI should be continued for 4–8 weeks to promote ulcer healing.",
          incorrect: [
            "Surgery (Billroth II gastrectomy) is indicated for complications of peptic ulcer disease: perforation (free gas under diaphragm), massive uncontrolled haemorrhage unresponsive to endoscopic treatment, or obstruction. This patient has a haemorrhage that was controlled at endoscopy — surgery is not the first line.",
            "Antacids (H2 blockers or simple antacids) alone are insufficient for H. pylori-positive ulcer disease. They relieve symptoms temporarily but do not address the underlying infection, which is the primary cause and will lead to recurrence without eradication therapy.",
            "Bismuth quadruple therapy (bismuth + PPI + metronidazole + tetracycline) is used as second-line rescue therapy after failed triple therapy or for metronidazole-resistant H. pylori. Standard first-line is triple therapy. Bismuth quadruple therapy alone without subsequent PPI continuation would not be optimal.",
          ],
        },
      },
      {
        id: "b4q3",
        caseStudy:
          "A 55-year-old male who consumes 180 units of alcohol per week presents with jaundice, progressive abdominal distension, and bilateral leg oedema. On examination, he has multiple spider naevi on his upper chest, palmar erythema, leukonychia, and a distended abdomen with shifting dullness and fluid thrill. His liver is hard and shrunken. LFTs reveal: Bilirubin 89 µmol/L, Albumin 21 g/L, PT/INR 2.1, Sodium 129 mEq/L. Child-Pugh score is C. What is the cause of his ascites?",
        image: {
          type: "abdominal-xray",
          caption: "Abdominal Ultrasound",
          finding: "Shrunken, nodular liver with heterogeneous echo texture; large volume ascites; splenomegaly",
        },
        options: [
          { label: "A", text: "Constrictive pericarditis causing right heart failure" },
          { label: "B", text: "Portal hypertension due to alcoholic liver cirrhosis" },
          { label: "C", text: "Nephrotic syndrome causing hypoalbuminaemia" },
          { label: "D", text: "Malignant ascites from hepatocellular carcinoma" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Portal hypertension from alcoholic liver cirrhosis is the cause of ascites here. The mechanism involves: (1) Increased sinusoidal resistance → portal hypertension → transudation of fluid, (2) Hypoalbuminaemia (albumin 21 g/L) → reduced oncotic pressure → fluid shifts to peritoneum, (3) Sodium retention via RAAS activation. Stigmata of chronic liver disease present: spider naevi (>5 = significant), palmar erythema, leukonychia (Terry's nails from hypoalbuminaemia), and ascites. Child-Pugh C = severe cirrhosis. SAAG (serum-ascites albumin gradient) >1.1 g/dL confirms portal hypertension.",
          incorrect: [
            "Constrictive pericarditis causes ascites from increased venous pressure (raised JVP, hepatic congestion) — it can mimic cirrhosis. However, it lacks the stigmata of chronic liver disease (no spider naevi, no palmar erythema), there is a prominent x and y descent in JVP, and the liver is congested (tender, pulsatile) rather than shrunken and nodular.",
            "Nephrotic syndrome (albumin <25 g/L) causes hypoalbuminaemia and fluid retention, but the pattern is generalised oedema (facial puffiness, periorbital oedema, peripheral oedema, ascites) without the liver-specific stigmata. Massive proteinuria (>3.5 g/day) would be present on urinalysis.",
            "Hepatocellular carcinoma (HCC) can cause malignant ascites, but this is usually exudative (SAAG <1.1 g/dL) from peritoneal carcinomatosis. However, HCC most often develops ON TOP OF cirrhosis. In this clinical picture, the primary diagnosis is cirrhosis causing portal hypertension. AFP would be markedly elevated in HCC.",
          ],
        },
      },
      {
        id: "b4q4",
        caseStudy:
          "A 70-year-old woman who had an open cholecystectomy 3 weeks ago presents with absolute constipation (no flatus or stool for 36 hours), colicky central abdominal pain in waves, and progressive abdominal distension and vomiting of faeculent material. On examination, the abdomen is distended with high-pitched 'tinkling' bowel sounds. The abdominal X-ray shown is reviewed. What is the most likely diagnosis?",
        image: {
          type: "abdominal-xray",
          caption: "Erect Abdominal X-ray",
          finding: "Dilated loops of small bowel with multiple air-fluid levels in a step-ladder pattern",
        },
        options: [
          { label: "A", text: "Paralytic Ileus" },
          { label: "B", text: "Mechanical Small Bowel Obstruction (SBO)" },
          { label: "C", text: "Large Bowel Obstruction from colonic carcinoma" },
          { label: "D", text: "Acute Pancreatitis" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Mechanical Small Bowel Obstruction (SBO) is correct. Post-operative adhesions are the commonest cause of SBO in patients with prior abdominal surgery. Classic features: absolute constipation (no flatus), colicky abdominal pain, distension, vomiting (faeculent in late obstruction), and HIGH-PITCHED (tinkling) bowel sounds. Erect AXR shows distended small bowel loops in a step-ladder pattern with multiple air-fluid levels. If bowel is viable: conservative management (NBM, NGT decompression, IV fluids). If strangulation suspected: urgent surgery.",
          incorrect: [
            "Paralytic ileus presents similarly (post-operative, distension, vomiting) but has ABSENT or reduced bowel sounds (not high-pitched tinkling). AXR shows gas throughout the entire bowel (small and large bowel) uniformly — not the step-ladder pattern. Treatment is supportive (NGT, NBM, treat cause).",
            "Large bowel obstruction from colonic carcinoma affects the large bowel, presenting with massive colonic distension on AXR (haustral markings visible, peripheral distribution). The sigmoid or caecum is often the most dilated part. Distended small bowel would only appear if the ileocaecal valve is incompetent.",
            "Acute pancreatitis presents with severe epigastric pain radiating to the back, nausea, vomiting, and elevated serum amylase/lipase (>3× normal). AXR may show a 'sentinel loop' (localised small bowel ileus) or 'colon cutoff sign'. It does not cause absolute constipation and step-ladder air-fluid levels.",
          ],
        },
      },
      {
        id: "b4q5",
        caseStudy:
          "A 25-year-old female presents with a 6-month history of bloody diarrhoea (8–10 times/day with blood and mucus), tenesmus, and lower abdominal cramping. She has lost 7 kg in weight. On examination, she is pale, temperature 37.9°C, and there is tenderness over the left iliac fossa. Colonoscopy reveals continuous mucosal inflammation from the rectum extending proximally with loss of haustral pattern, pseudopolyps, and granularity. Biopsy shows crypt abscesses and goblet cell depletion. What is the most likely diagnosis?",
        image: {
          type: "abdominal-xray",
          caption: "Plain Abdominal X-ray",
          finding: "Loss of haustral pattern in descending and sigmoid colon with mucosal thickening — lead-pipe appearance",
        },
        options: [
          { label: "A", text: "Crohn's Disease" },
          { label: "B", text: "Ulcerative Colitis" },
          { label: "C", text: "Infectious Colitis (Campylobacter)" },
          { label: "D", text: "Irritable Bowel Syndrome (IBS)" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Ulcerative Colitis (UC) is correct. Key distinguishing features from Crohn's: (1) CONTINUOUS inflammation from rectum proximally (rectal involvement is universal in UC; Crohn's often spares the rectum), (2) Mucosal only (not transmural — no skip lesions, no fistulae, no perianal disease), (3) Biopsy: crypt abscesses, goblet cell depletion, and mucosal/submucosal inflammation, (4) Blood and mucus PR is the hallmark symptom. AXR in severe UC: lead-pipe colon (loss of haustra). Complications: toxic megacolon, colorectal cancer (risk increases with disease duration). Treatment: 5-ASA (mesalazine) for mild-moderate; steroids for flares; azathioprine/biologics for maintenance.",
          incorrect: [
            "Crohn's Disease affects ANY part of the GI tract (mouth to anus), shows SKIP lesions (patches of normal bowel between affected areas), is TRANSMURAL (causes fistulae, strictures, abscesses, perianal disease), and typically spares the rectum. Biopsy shows non-caseating granulomas (specific for Crohn's). Bloody diarrhoea is less common than in UC.",
            "Infectious colitis (Campylobacter, Salmonella, Shigella) presents acutely with bloody diarrhoea, fever, and self-limiting course (<2 weeks). Stool cultures would be positive. It does NOT cause chronic symptoms over 6 months, pseudopolyps, or loss of haustral pattern on AXR.",
            "IBS presents with abdominal pain related to defaecation, altered bowel habit, and bloating — but NEVER with rectal bleeding, significant weight loss, or fever. Colonoscopy and biopsy would be entirely normal. IBS is a functional disorder of gut motility.",
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // BLOCK 5 — Endocrinology & Metabolism
  // ─────────────────────────────────────────────────────────────────
  {
    id: "block-5",
    title: "Endocrinology & Metabolism",
    specialty: "Endocrinology",
    description: "Diabetes, thyroid disorders, Cushing's syndrome, and electrolyte disturbances",
    difficulty: "Medium",
    color: "from-emerald-600 to-teal-800",
    icon: "🔬",
    mcqs: [
      {
        id: "b5q1",
        caseStudy:
          "A 16-year-old previously healthy girl is brought to A&E by her parents with a 3-day history of polyuria, polydipsia, weight loss, and progressive confusion. On examination she is dehydrated, tachycardic (HR 118), and has deep sighing (Kussmaul) respirations. She smells of acetone. Blood glucose is 28 mmol/L, serum bicarbonate 11 mEq/L, pH 7.18, urine dipstick shows 4+ ketones and 4+ glucose. What is the diagnosis and the first priority in management?",
        image: {
          type: "urine-dipstick",
          caption: "Urine Dipstick Analysis",
          finding: "Strong positive ketones (4+) and glucose (4+) with negative protein — DKA pattern",
        },
        options: [
          { label: "A", text: "Hyperosmolar Hyperglycaemic State — insulin infusion immediately" },
          { label: "B", text: "Diabetic Ketoacidosis — IV fluid resuscitation (0.9% NaCl) is first priority" },
          { label: "C", text: "DKA — IV insulin bolus is the first step" },
          { label: "D", text: "DKA — IV sodium bicarbonate to correct acidosis first" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Diabetic Ketoacidosis (DKA) is the diagnosis. Diagnostic criteria: glucose >11 mmol/L, ketonaemia/ketonuria ≥3 mmol/L (or urine ketones 2+), bicarbonate <15 mEq/L, pH <7.3. The FIRST PRIORITY in DKA management is IV fluid resuscitation — 0.9% NaCl 1 litre over 1 hour (in haemodynamically stable patients). This addresses dehydration, improves renal perfusion, and reduces glucose and ketones. Insulin infusion (0.1 units/kg/hr) is started AFTER fluids are commenced (or simultaneously). NEVER start insulin before fluids — risk of hypotension and cerebral oedema.",
          incorrect: [
            "Hyperosmolar Hyperglycaemic State (HHS) occurs in older Type 2 diabetics with markedly elevated glucose (>30–33 mmol/L), severe dehydration, but MINIMAL or NO ketones and NO significant acidosis (pH >7.3). This 16-year-old has significant ketones and acidosis — this is DKA, not HHS.",
            "An IV insulin bolus is NOT recommended in DKA management. Fixed-rate insulin infusion (FRIII: 0.1 units/kg/hr) is started after fluids, NOT as an initial bolus. An initial bolus can cause dangerous hypokalaemia (insulin drives potassium intracellularly) before potassium replacement is established.",
            "Sodium bicarbonate is NOT routinely recommended in DKA, even in severe acidosis. Studies show it does not improve outcomes and may worsen intracellular acidosis and precipitate paradoxical CNS acidosis. It is only considered if pH <6.9 with haemodynamic instability, on specialist advice.",
          ],
        },
      },
      {
        id: "b5q2",
        caseStudy:
          "A 38-year-old female presents with a 6-month history of weight gain despite poor appetite, lethargy, cold intolerance, constipation, and dry skin. She has bradycardia (HR 52 bpm), periorbital oedema, and delayed ankle jerk relaxation. Her voice is hoarse. She reports heavy periods. Thyroid function tests: TSH 42 mIU/L (normal 0.4–4.0), Free T4 6.2 pmol/L (normal 12–22). Thyroid peroxidase (anti-TPO) antibodies are markedly elevated. What is the most likely diagnosis and first-line treatment?",
        image: {
          type: "thyroid-scan",
          caption: "Thyroid ultrasound",
          finding: "Diffusely enlarged, hypoechoic thyroid gland with heterogeneous echotexture — Hashimoto's pattern",
        },
        options: [
          { label: "A", text: "Hyperthyroidism (Graves' Disease) — carbimazole" },
          { label: "B", text: "Hypothyroidism (Hashimoto's Thyroiditis) — levothyroxine (T4)" },
          { label: "C", text: "Subclinical hypothyroidism — no treatment needed" },
          { label: "D", text: "Sick euthyroid syndrome — treat underlying illness" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Hashimoto's Thyroiditis (autoimmune hypothyroidism) is the most common cause of hypothyroidism in iodine-sufficient regions. Anti-TPO antibodies are the hallmark (present in >95%). Symptoms (CALM: Cold, Anorecticfattening, Lethargy, Menorrhagia + constipation, dry skin, bradycardia, periorbital oedema, delayed relaxation of deep tendon reflexes, hoarse voice) are due to reduced metabolic rate. TSH is HIGH (pituitary attempts to stimulate the underactive thyroid), T4 is LOW. Treatment: Levothyroxine (T4) starting at 25–50 mcg/day, titrated by TSH every 6–8 weeks. Target TSH: 0.5–2.5 mIU/L.",
          incorrect: [
            "Graves' Disease (autoimmune hyperthyroidism) presents with OPPOSITE symptoms: weight loss despite increased appetite, heat intolerance, diarrhoea, tachycardia, tremor, anxiety, exophthalmos, pretibial myxoedema. TSH would be SUPPRESSED (<0.01), T4 markedly elevated. Anti-TPO antibodies may be positive but TSH-R antibodies are specific for Graves'.",
            "Subclinical hypothyroidism is defined as elevated TSH with NORMAL Free T4 and NO symptoms. This patient has both elevated TSH AND low Free T4 with florid clinical symptoms — this is overt hypothyroidism requiring treatment, not subclinical.",
            "Sick euthyroid syndrome (non-thyroidal illness syndrome) is a pattern of thyroid function tests in critically ill patients showing low T3, low or normal T4, and normal-to-low TSH. It occurs due to impaired peripheral T4 to T3 conversion. This patient has an extremely HIGH TSH and clinical features pointing to primary hypothyroidism.",
          ],
        },
      },
      {
        id: "b5q3",
        caseStudy:
          "A 40-year-old woman presents with a 2-year history of weight gain (predominantly central), stretch marks (purple striae) on her abdomen and thighs, easy bruising, muscle weakness (unable to rise from a squat), and depression. On examination, she has a round plethoric face ('moon face'), a 'buffalo hump', and hypertension (BP 158/96 mmHg). Blood glucose is 11.2 mmol/L. 24-hour urinary free cortisol is markedly elevated. Overnight dexamethasone suppression test (1 mg) fails to suppress cortisol. What is the diagnosis?",
        image: {
          type: "abdominal-xray",
          caption: "Clinical features illustration",
          finding: "Truncal obesity, purple striae, moon face, and buffalo hump — classical Cushing's habitus",
        },
        options: [
          { label: "A", text: "Metabolic Syndrome (obesity, hypertension, diabetes)" },
          { label: "B", text: "Cushing's Syndrome — excess cortisol" },
          { label: "C", text: "Hypothyroidism — weight gain and depression" },
          { label: "D", text: "Polycystic Ovary Syndrome (PCOS)" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Cushing's Syndrome is the diagnosis. The clinical features are pathognomonic of chronic hypercortisolism: moon face, buffalo hump (fat redistribution), purple striae (>1 cm wide, purple due to protein catabolism thinning the skin), easy bruisability, proximal myopathy (unable to rise from squat), hypertension, glucose intolerance, depression. Investigation: (1) 24h urinary free cortisol elevated, (2) Overnight dexamethasone suppression test — failure to suppress = Cushing's. Next: ACTH to determine if ACTH-dependent (Cushing's disease if pituitary, or ectopic ACTH) or ACTH-independent (adrenal adenoma/carcinoma).",
          incorrect: [
            "Metabolic syndrome (central obesity, hypertension, hyperglycaemia, dyslipidaemia) shares some features but does NOT cause purple striae, proximal myopathy, moon face, buffalo hump, or easy bruising. Urinary free cortisol and dexamethasone suppression test would be NORMAL in metabolic syndrome.",
            "Hypothyroidism causes weight gain, depression, and fatigue but without the distribution pattern of Cushing's (no truncal obesity pattern, no purple striae, no proximal myopathy from muscle wasting). TSH would be elevated in hypothyroidism, not excess cortisol.",
            "PCOS in young women causes irregular periods, hirsutism, acne, and polycystic ovaries on ultrasound, with insulin resistance causing weight gain. It does NOT cause purple striae, moon face, buffalo hump, proximal myopathy, or markedly elevated urinary free cortisol.",
          ],
        },
      },
      {
        id: "b5q4",
        caseStudy:
          "A 62-year-old type 2 diabetic on insulin (glargine 30 units at night + insulin aspart before meals) is brought by ambulance after being found unconscious at home. His wife says he skipped lunch but took his usual lunchtime insulin. On examination, he is diaphoretic, trembling, GCS 9/15, HR 108 bpm. Random blood glucose measured by paramedics: 1.8 mmol/L. What is the immediate management?",
        image: {
          type: "urine-dipstick",
          caption: "Bedside blood glucose meter reading",
          finding: "Blood glucose: 1.8 mmol/L (critical low) — severe hypoglycaemia",
        },
        options: [
          { label: "A", text: "15g oral glucose gel or dextrose tablets and recheck in 15 minutes" },
          { label: "B", text: "IV 75 mL of 20% dextrose immediately (or 150 mL 10%)" },
          { label: "C", text: "Subcutaneous insulin dose reduction and observe" },
          { label: "D", text: "IV Normal Saline bolus 500 mL and CT brain" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "IV 75 mL of 20% Dextrose (or equivalent 150 mL 10% dextrose) is the correct immediate treatment. This patient is unconscious (GCS 9) and CANNOT safely swallow — oral glucose is absolutely contraindicated (aspiration risk). IV dextrose rapidly reverses severe hypoglycaemia. Alternatively, Glucagon 1 mg IM/SC can be given (works by promoting hepatic glycogen breakdown — but is slow and may be ineffective in malnourished or alcohol-dependent patients). After recovery: give long-acting carbohydrate (e.g., biscuits), monitor BG hourly, identify and prevent recurrence.",
          incorrect: [
            "Oral glucose gel/tablets are the FIRST CHOICE for conscious patients with mild-moderate hypoglycaemia (BG <4 mmol/L) who are alert and able to swallow — the 15-15 rule (15g glucose, recheck after 15 minutes). This patient is unconscious (GCS 9) — oral treatment risks aspiration and is absolutely contraindicated.",
            "Subcutaneous insulin dose reduction is a preventive measure for future hypoglycaemia episodes, not the immediate treatment of an acute severe hypoglycaemic emergency. Giving insulin when glucose is 1.8 mmol/L would be dangerous and potentially fatal.",
            "IV Normal Saline does not contain glucose and will NOT correct hypoglycaemia. CT brain may be needed to rule out stroke if symptoms do not improve after glucose correction, but it is not the immediate priority when the cause of unconsciousness is clearly documented hypoglycaemia (BG 1.8 mmol/L).",
          ],
        },
      },
      {
        id: "b5q5",
        caseStudy:
          "A 45-year-old woman undergoes total thyroidectomy for papillary thyroid carcinoma. 24 hours post-operatively, she develops tingling around her mouth and fingertips, muscle cramps, and carpopedal spasm. On examination, tapping over the facial nerve anterior to the ear produces ipsilateral facial muscle twitching (positive Chvostek's sign). Trousseau's sign is positive. Serum calcium is 1.7 mmol/L (normal 2.2–2.6). PTH is undetectable. What is the cause and treatment?",
        image: {
          type: "abdominal-xray",
          caption: "Lab results display",
          finding: "Serum Ca²⁺: 1.7 mmol/L (critically low), PTH: <0.5 pmol/L (undetectable), Phosphate: 1.8 mmol/L (elevated)",
        },
        options: [
          { label: "A", text: "Hypomagnesaemia — IV magnesium sulphate" },
          { label: "B", text: "Hypoparathyroidism (post-surgical) — IV calcium gluconate, then oral calcium + calcitriol" },
          { label: "C", text: "Hyperkalaemia — IV calcium gluconate to stabilise cardiac membrane" },
          { label: "D", text: "Hyperthyroidism storm — propranolol and carbimazole" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Post-surgical hypoparathyroidism is the diagnosis. The parathyroid glands (4 glands embedded in/adjacent to the thyroid) may be inadvertently removed or devascularised during thyroidectomy. Without PTH, serum calcium falls (PTH normally mobilises calcium from bone, increases renal calcium reabsorption, and stimulates calcitriol production). Symptomatic hypocalcaemia: perioral tingling, carpopedal spasm, Chvostek's sign, Trousseau's sign, tetany. Management: IV Calcium Gluconate 10 mL of 10% IV slowly for acute symptomatic hypocalcaemia; then oral calcium carbonate + calcitriol (active Vitamin D, since PTH is needed for 1α-hydroxylation).",
          incorrect: [
            "Hypomagnesaemia can cause hypocalcaemia (Mg²⁺ required for PTH secretion and action), and the symptoms of Mg²⁺ and Ca²⁺ deficiency overlap. However, in a post-thyroidectomy patient with undetectable PTH, the primary diagnosis is hypoparathyroidism, not hypomagnesaemia. Check Mg²⁺ simultaneously, but treat calcium first.",
            "IV Calcium Gluconate for hyperkalaemia is used to stabilise the cardiac membrane in hyperkalaemia with ECG changes (peaked T waves, wide QRS). The mechanism is different from calcium supplementation for hypocalcaemia. This patient's problem is HYPOCALCAEMIA, not hyperkalaemia.",
            "Thyroid storm is acute hyperthyroidism (fever, tachycardia, agitation, thyrotoxicosis) and would never present with hypocalcaemia, carpopedal spasm, or undetectable PTH. It is also extremely unlikely 24 hours post-thyroidectomy (the thyroid has been removed).",
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // BLOCK 6 — Musculoskeletal & Rheumatology
  // ─────────────────────────────────────────────────────────────────
  {
    id: "block-6",
    title: "Musculoskeletal & Rheumatology",
    specialty: "Rheumatology",
    description: "Rheumatoid arthritis, gout, fractures, septic arthritis, and SLE",
    difficulty: "Medium",
    color: "from-cyan-600 to-indigo-800",
    icon: "🦴",
    mcqs: [
      {
        id: "b6q1",
        caseStudy:
          "A 42-year-old female presents with a 6-month history of bilateral hand pain and stiffness, worse in the morning for more than 1 hour. On examination, there is symmetrical swelling of the proximal interphalangeal (PIP) and metacarpophalangeal (MCP) joints bilaterally. The distal interphalangeal (DIP) joints are spared. She has subcutaneous nodules over the olecranon. Rheumatoid Factor is 1:320 (positive), Anti-CCP antibodies are strongly positive. CRP 48 mg/L, ESR 78 mm/hr. X-ray of hands is shown. What is the diagnosis?",
        image: {
          type: "hand-xray",
          caption: "X-ray of both hands",
          finding: "Juxta-articular osteoporosis, joint space narrowing at MCP and PIP joints bilaterally, periarticular erosions",
        },
        options: [
          { label: "A", text: "Osteoarthritis (OA)" },
          { label: "B", text: "Rheumatoid Arthritis (RA)" },
          { label: "C", text: "Psoriatic Arthritis" },
          { label: "D", text: "Reactive Arthritis (Reiter's Syndrome)" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Rheumatoid Arthritis is the diagnosis. The 2010 ACR/EULAR criteria are fulfilled: (1) Symmetrical polyarthritis involving MCP + PIP joints (DIP sparing — classic), (2) Morning stiffness >1 hour (inflammatory), (3) Positive RF (high titre), (4) Positive Anti-CCP (most specific test for RA), (5) Elevated CRP/ESR, (6) X-ray: juxta-articular osteoporosis + erosions. Rheumatoid nodules at pressure points (olecranon) confirm seropositive RA. Treatment escalation: NSAIDs → DMARDs (Methotrexate first-line) → Biologics (anti-TNF if inadequate response).",
          incorrect: [
            "Osteoarthritis affects DISTAL interphalangeal (DIP) joints primarily, creating Heberden's nodes (DIP) and Bouchard's nodes (PIP). Morning stiffness is brief (<30 minutes). RF and anti-CCP are negative. X-ray shows joint space narrowing, subchondral sclerosis, and osteophytes — NOT erosions. It is asymmetric, not inflammatory.",
            "Psoriatic arthritis can be symmetric and seronegative, but it characteristically involves DIP joints (sausage digits/dactylitis), is often associated with nail changes (pitting, onycholysis), and occurs in patients with psoriatic skin or nail disease. RF is typically negative. Anti-CCP may be positive in a minority.",
            "Reactive arthritis (Reiter's Syndrome) is typically asymmetric, involves large joints (knees, ankles), is preceded by an infection (urethritis, dysentery), and is associated with the classic triad: urethritis, conjunctivitis, and arthritis. It is self-limiting and seronegative.",
          ],
        },
      },
      {
        id: "b6q2",
        caseStudy:
          "A 52-year-old obese male with hypertension who drinks 3–4 beers daily wakes at 3 AM with excruciating pain, redness, warmth, and swelling of the right first metatarsophalangeal (MTP) joint. He reports a similar episode 6 months ago that resolved spontaneously. Serum uric acid is 620 µmol/L (normal <420 µmol/L). Joint aspiration reveals negatively birefringent needle-shaped crystals under polarised light. X-ray of the foot is shown. What is the treatment for this acute attack?",
        image: {
          type: "hand-xray",
          caption: "X-ray of right foot",
          finding: "Punched-out erosions with overhanging edges at 1st MTP joint — chronic tophaceous gout changes",
        },
        options: [
          { label: "A", text: "Allopurinol immediately during the acute attack" },
          { label: "B", text: "NSAIDs (indomethacin/naproxen) or colchicine as first-line" },
          { label: "C", text: "IV corticosteroids and joint washout" },
          { label: "D", text: "Aspirin 300 mg daily for anti-inflammatory effect" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "NSAIDs (e.g., indomethacin 50 mg three times daily) or colchicine (500 mcg 2–4 times daily) are first-line treatment for acute gout. Both are equally effective. Colchicine is preferred when NSAIDs are contraindicated (renal impairment, peptic ulcer disease, anticoagulation). Oral prednisolone is second-line. The acute attack should settle within 5–7 days. Urate-lowering therapy (allopurinol) should NOT be started during an acute attack as it can prolong or precipitate further flares.",
          incorrect: [
            "Allopurinol (xanthine oxidase inhibitor) is urate-lowering therapy for PREVENTION of future attacks. Starting allopurinol during an acute attack can prolong the flare or precipitate new attacks by mobilising urate crystals from deposits. It should only be started 2–4 weeks AFTER the acute attack has fully resolved, under NSAID/colchicine cover.",
            "IV corticosteroids and joint washout are reserved for septic arthritis (bacterial joint infection). For gout, if oral therapy is not possible, IM or intra-articular corticosteroids may be used, but IV steroids + washout are not standard gout management.",
            "Aspirin should NEVER be used in gout. Low-dose aspirin (<300 mg) reduces uric acid excretion, RAISING serum urate and precipitating gout attacks. Higher doses (>3g/day) promote uricosuria, but the therapeutic window is impractical. Aspirin is contraindicated in gout management.",
          ],
        },
      },
      {
        id: "b6q3",
        caseStudy:
          "A 72-year-old osteoporotic woman trips on her doorstep and falls onto her outstretched right hand. She presents with pain, swelling, and deformity of the right wrist. There is dorsal displacement of the hand with a 'dinner-fork' deformity on lateral view. Neurological examination reveals decreased sensation over the thenar eminence and lateral 3½ fingers. The X-ray is shown. What is the diagnosis?",
        image: {
          type: "hand-xray",
          caption: "Lateral view X-ray of right wrist",
          finding: "Distal radius fracture with dorsal angulation and displacement of the distal fragment — classic Colles pattern",
        },
        options: [
          { label: "A", text: "Smith's Fracture (reverse Colles)" },
          { label: "B", text: "Colles' Fracture with median nerve injury" },
          { label: "C", text: "Scaphoid fracture" },
          { label: "D", text: "Distal ulna fracture only" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Colles' Fracture is a transverse fracture of the distal radius within 2.5 cm of the radiocarpal joint with (1) dorsal angulation, (2) dorsal displacement, (3) radial shortening, and (4) radial angulation — resulting in the classic 'dinner-fork deformity' on lateral view. It occurs in osteoporotic elderly women from a FOOSH (fall on outstretched hand). Decreased sensation in median nerve distribution (thenar eminence, lateral 3½ fingers) suggests carpal tunnel syndrome from haematoma/oedema. Management: reduction under Bier's block + plaster backslap; surgical fixation if unstable.",
          incorrect: [
            "Smith's Fracture is a 'reverse Colles' — distal radius fracture with VOLAR (palmar) displacement and angulation, causing a 'garden spade' deformity. The mechanism is usually a fall on the BACK of the hand, not outstretched hand. The deformity is opposite to Colles'.",
            "Scaphoid fracture occurs in young adults (not elderly) after FOOSH, causing anatomical snuffbox tenderness (between APL/EPB and EPL tendons). It may not be visible on initial X-ray (15%). It does NOT cause dinner-fork deformity — only tenderness in the anatomical snuffbox without obvious deformity.",
            "Isolated distal ulna fracture without radial involvement would not cause the dinner-fork deformity or the clinical picture described. The ulna styloid is commonly fractured ALONGSIDE a Colles' fracture, not in isolation.",
          ],
        },
      },
      {
        id: "b6q4",
        caseStudy:
          "A 6-year-old boy presents with a 2-day history of fever (39.5°C), limping, and refusal to bear weight on his right leg. On examination, the right hip is held in flexion, abduction, and external rotation. Any movement of the hip causes severe pain. WBC is 18,000/µL, CRP 140 mg/L, ESR 65 mm/hr. Ultrasound of the hip shows an effusion. Kocher criteria are all 4 positive. What is the diagnosis and management?",
        image: {
          type: "knee-xray",
          caption: "X-ray pelvis — AP view",
          finding: "Slight widening of right hip joint space compared to left — effusion. Soft tissue swelling noted",
        },
        options: [
          { label: "A", text: "Transient Synovitis — rest and NSAIDs" },
          { label: "B", text: "Septic Arthritis — urgent surgical drainage + IV antibiotics" },
          { label: "C", text: "Perthes Disease — observation and physiotherapy" },
          { label: "D", text: "Juvenile Idiopathic Arthritis — methotrexate" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "Septic Arthritis of the hip is a surgical emergency. The Kocher criteria (temperature >38.5°C, non-weight-bearing, ESR >40 mm/hr, WBC >12,000/µL) — all 4 positive gives >99% probability of septic arthritis vs transient synovitis. Management: urgent surgical joint aspiration and washout (arthrotomy or arthroscopic) + IV antibiotics (flucloxacillin for Staphylococcus aureus empirically). Delay risks avascular necrosis of the femoral head from raised intra-articular pressure cutting off blood supply. Aspirated fluid shows WBC >50,000/µL (often >100,000) and organisms on Gram stain/culture.",
          incorrect: [
            "Transient (toxic) synovitis is the most common cause of hip pain in children 3–8 years — but it is a diagnosis of EXCLUSION. WBC and inflammatory markers are typically mildly elevated or normal, the child is WEIGHT-BEARING (though reluctant), and fever is low-grade. All 4 Kocher criteria being positive virtually rules out transient synovitis.",
            "Perthes Disease (avascular necrosis of the femoral head idiopathic) presents with a gradual insidious onset in boys 4–8 years with a limp but minimal systemic features. X-ray shows sclerosis, fragmentation, and flattening of the femoral head. Acute fever and elevated inflammatory markers are NOT features of Perthes.",
            "Juvenile Idiopathic Arthritis (JIA) is a chronic inflammatory arthritis diagnosis requiring symptoms >6 weeks in a child <16 years. It does not present acutely with fever and inability to weight-bear as described here. Acute septic arthritis must be excluded first before considering JIA.",
          ],
        },
      },
      {
        id: "b6q5",
        caseStudy:
          "A 26-year-old female presents with a 4-month history of a butterfly-shaped rash across both cheeks and nose bridge, joint pains in multiple small joints (non-deforming), fatigue, and hair loss. She reports worsening of the rash after sun exposure (photosensitivity). Blood tests reveal: Hb 9.2 g/dL, WBC 2,800/µL (lymphopenia), platelets 88,000/µL. Urinalysis: protein 2+ and RBC casts. ANA titre 1:640 (homogeneous pattern), anti-dsDNA antibodies positive, complement C3 and C4 reduced. What is the diagnosis?",
        image: {
          type: "peripheral-smear",
          caption: "Peripheral blood smear",
          finding: "Normochromic normocytic anaemia with lymphopenia — compatible with autoimmune haemolysis or chronic disease",
        },
        options: [
          { label: "A", text: "Dermatomyositis — check CK, EMG, muscle biopsy" },
          { label: "B", text: "Systemic Lupus Erythematosus (SLE)" },
          { label: "C", text: "Rosacea — topical metronidazole" },
          { label: "D", text: "Rheumatoid Arthritis with extra-articular features" },
        ],
        correctIndex: 1,
        explanation: {
          correct:
            "SLE (Systemic Lupus Erythematosus) fulfils the 2019 EULAR/ACR classification criteria: (1) Malar (butterfly) rash, (2) Photosensitivity, (3) Non-scarring alopecia, (4) Non-deforming arthritis, (5) Haematological: anaemia, leukopenia (WBC <4000), thrombocytopenia, (6) Renal: proteinuria + RBC casts (lupus nephritis), (7) ANA ≥1:80 positive, (8) Anti-dsDNA positive (highly specific — indicates disease activity), (9) Low complement (C3, C4 consumed by immune complexes). Treatment: hydroxychloroquine (for all SLE), prednisolone for active disease, cyclophosphamide/mycophenolate for nephritis.",
          incorrect: [
            "Dermatomyositis causes proximal muscle weakness, elevated CK, and a heliotrope rash (periorbital violaceous discolouration) + Gottron's papules (over knuckles). The rash is NOT in a malar distribution and is NOT triggered by sun exposure in the same way. ANA may be positive but anti-dsDNA and renal involvement are not features of dermatomyositis.",
            "Rosacea causes a facial blush/flush and papulopustular lesions on the central face, but it occurs in middle-aged adults, has no systemic features (no cytopenias, no renal involvement), is not photosensitive in the SLE manner, and has no positive autoantibodies. It is a dermatological diagnosis only.",
            "Rheumatoid Arthritis may occasionally cause systemic features (anaemia of chronic disease, pleuritis, vasculitis), but it does NOT cause a malar rash, anti-dsDNA positivity, low complement, or active urine sediment (RBC casts = glomerulonephritis). Anti-CCP and RF would be positive in RA; anti-dsDNA would be negative.",
          ],
        },
      },
    ],
  },
];

export function getBlockById(id: string): Block | undefined {
  return BLOCKS.find((b) => b.id === id);
}
